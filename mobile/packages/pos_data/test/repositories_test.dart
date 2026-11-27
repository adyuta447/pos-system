import 'package:drift/drift.dart' show driftRuntimeOptions;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_data/pos_data.dart';

void main() {
  driftRuntimeOptions.dontWarnAboutMultipleDatabases = true;
  late PosDatabase db;
  late LocalCatalogRepository catalog;
  late LocalTransactionRepository trx;
  late LocalSettingsRepository settings;
  late LocalExpenseRepository expense;
  late String catId;

  Future<ProductView> addProduct(String name, {int price = 10000, int stock = 10}) async {
    final id = await catalog.saveProduct(
      ProductView(id: '', name: name, price: price, categoryId: catId, stock: stock),
      isNew: true,
    );
    return (await catalog.watchProducts().first).firstWhere((p) => p.id == id);
  }

  CartItem item(ProductView p, int qty) =>
      CartItem(productId: p.id, name: p.name, price: p.price, qty: qty, stock: p.stock);

  setUp(() async {
    db = PosDatabase(NativeDatabase.memory());
    catalog = LocalCatalogRepository(db);
    trx = LocalTransactionRepository(db);
    settings = LocalSettingsRepository(db);
    expense = LocalExpenseRepository(db);
    catId = await catalog.saveCategory(name: 'Kopi');
  });
  tearDown(() => db.close());

  test('checkout saves sale, items and stock in one go with daily receipt numbers', () async {
    final kopi = await addProduct('Kopi Susu', price: 22000, stock: 5);
    final cart = Cart(
      items: [item(kopi, 2)],
      tax: const TaxSettings(enabled: true, name: 'PPN', rateBp: 1100),
    );
    final first = await trx.checkout(cart, PaymentMethod.cash, received: 50000);
    expect(first.total, 48840); // 44000 + 11%
    expect(first.change, 1160);
    expect(first.receiptNo, matches(RegExp(r'^INV-\d{6}-0001$')));
    final second = await trx.checkout(cart, PaymentMethod.qrisManual);
    expect(second.receiptNo, endsWith('-0002'));
    expect(second.received, second.total);

    final stock = (await catalog.watchProducts().first).single.stock;
    expect(stock, 1);
    final moves = await catalog.watchMovements(kopi.id).first;
    expect(moves.map((m) => m.type), [StockMovementType.sale, StockMovementType.sale, StockMovementType.initial]);
    expect(moves.first.stockAfter, 1);

    final today = await trx.watchByDate(DateTime.now()).first;
    expect(today.map((t) => t.receiptNo), [second.receiptNo, first.receiptNo]);
    expect(today.last.items.single.name, 'Kopi Susu');
    expect(today.last.taxRateBp, 1100);
  });

  test('out of stock rolls back the whole checkout', () async {
    final a = await addProduct('A', stock: 5);
    final b = await addProduct('B', stock: 1);
    final cart = Cart(items: [item(a, 2), item(b, 3)]);
    await expectLater(
      trx.checkout(cart, PaymentMethod.cash, received: 100000),
      throwsA(isA<OutOfStockException>().having((e) => e.productId, 'productId', b.id)),
    );
    final products = await catalog.watchProducts().first;
    expect(products.firstWhere((p) => p.id == a.id).stock, 5); // A untouched
    expect(await trx.watchByDate(DateTime.now()).first, isEmpty);
    expect((await catalog.watchMovements(a.id).first).length, 1); // only the initial stock
  });

  test('cash below the total is refused', () async {
    final a = await addProduct('A');
    expect(
      () => trx.checkout(Cart(items: [item(a, 1)]), PaymentMethod.cash, received: 9999),
      throwsArgumentError,
    );
  });

  test('void keeps the sale, marks it void and returns the stock', () async {
    final a = await addProduct('A', stock: 4);
    final sale = await trx.checkout(Cart(items: [item(a, 3)]), PaymentMethod.qrisManual);
    await trx.voidTransaction(sale.id, 'Salah input');
    final t = (await trx.watchByDate(DateTime.now()).first).single;
    expect(t.isVoid, isTrue);
    expect(t.voidReason, 'Salah input');
    expect((await catalog.watchProducts().first).single.stock, 4);
    expect(() => trx.voidTransaction(sale.id, 'lagi'), throwsStateError);
  });

  test('product names are unique; sold products can only be deactivated', () async {
    final a = await addProduct('Americano');
    expect(() => addProduct(' americano '), throwsA(isA<DuplicateNameException>()));
    await catalog.saveProduct(a.copyWith(price: 19000), isNew: false); // editing itself is fine

    await trx.checkout(Cart(items: [item(a, 1)]), PaymentMethod.qrisManual);
    final sold = (await catalog.watchProducts().first).single;
    expect(sold.hasSales, isTrue);
    expect(() => catalog.deleteProduct(a.id), throwsStateError);
    await catalog.setProductActive(a.id, false);
    expect((await catalog.watchProducts().first).single.active, isFalse);

    final fresh = await addProduct('Teh');
    await catalog.deleteProduct(fresh.id);
    expect((await catalog.watchProducts().first).map((p) => p.name), ['Americano']);
  });

  test('manual stock adjustment is logged with its reason', () async {
    final a = await addProduct('A', stock: 10);
    await catalog.adjustStock(a.id, newStock: 7, reason: StockMovementType.damaged, note: 'Jatuh');
    final m = (await catalog.watchMovements(a.id).first).first;
    expect(m.type, StockMovementType.damaged);
    expect(m.qtyChange, -3);
    expect(m.stockAfter, 7);
    expect(m.note, 'Jatuh');
    expect(() => catalog.adjustStock(a.id, newStock: -1, reason: StockMovementType.other), throwsArgumentError);
  });

  test('settings round-trip, including tax, paper and user', () async {
    expect((await settings.get()).setupDone, isFalse);
    const s = StoreSettings(
      setupDone: true,
      storeName: 'Kopi Laris',
      receiptPrefix: 'KL',
      dailyReset: false,
      tax: TaxSettings(enabled: true, name: 'PB1', rateBp: 1000, inclusive: true),
      paper: PaperWidth.mm80,
      userName: 'Rina',
    );
    await settings.save(s);
    expect(await settings.get(), s);

    final a = await addProduct('A');
    final sale = await trx.checkout(Cart(items: [item(a, 1)]), PaymentMethod.qrisManual);
    expect(sale.receiptNo, 'KL-000001');
  });

  test('expense save, edit, date filter and soft delete work as expected', () async {
    final today = DateTime.now();
    final yesterday = today.subtract(const Duration(days: 1));

    expect(
      () => expense.save(
        category: '  ',
        amount: 10000,
        source: ExpensePaymentSource.cash,
        date: today,
      ),
      throwsArgumentError,
    );
    expect(
      () => expense.save(
        category: 'Logistik',
        amount: 0,
        source: ExpensePaymentSource.cash,
        date: today,
      ),
      throwsArgumentError,
    );

    final id = await expense.save(
      category: 'Bahan baku',
      amount: 50000,
      source: ExpensePaymentSource.cash,
      date: today,
      note: 'Es batu 2 bal',
    );
    await expense.save(
      category: 'Logistik',
      amount: 15000,
      source: ExpensePaymentSource.nonCash,
      date: yesterday,
    );

    var todayList = await expense.watchByDate(today).first;
    expect(todayList, hasLength(1));
    expect(todayList.single.category, 'Bahan baku');
    expect(todayList.single.amount, 50000);
    expect(todayList.single.source, ExpensePaymentSource.cash);
    expect(todayList.single.note, 'Es batu 2 bal');

    await expense.save(
      id: id,
      category: 'Operasional',
      amount: 55000,
      source: ExpensePaymentSource.nonCash,
      date: today,
    );
    todayList = await expense.watchByDate(today).first;
    expect(todayList.single.category, 'Operasional');
    expect(todayList.single.amount, 55000);
    expect(todayList.single.note, isNull);

    await expense.delete(id);
    expect(await expense.watchByDate(today).first, isEmpty);
    expect((await expense.watchByDate(yesterday).first).single.category, 'Logistik');
  });
}
