import 'package:drift/drift.dart';
import 'package:pos_core/pos_core.dart';
import 'package:uuid/uuid.dart';

import 'database.dart';

const _uuid = Uuid();

/// UUID v7: unik, dan urut waktu sehingga bisa dipakai untuk sorting.
String newId() => _uuid.v7();

const _settingsId = 'default';
const _userId = 'default-user';

String _dateKey(DateTime d) =>
    '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

// ---------------------------------------------------------------------------
// Interfaces: satu-satunya titik yang diganti saat sumber data pindah ke API.
// ---------------------------------------------------------------------------

abstract interface class SettingsRepository {
  Stream<StoreSettings> watch();
  Future<StoreSettings> get();
  Future<void> save(StoreSettings settings);
}

abstract interface class CatalogRepository {
  Stream<List<CategoryView>> watchCategories();

  /// Semua produk yang belum dihapus (aktif dan nonaktif), urut nama.
  Stream<List<ProductView>> watchProducts();

  /// Throws [DuplicateNameException]. Returns id.
  Future<String> saveCategory({String? id, required String name, bool active = true});

  /// Produk baru: [ProductView.stock] menjadi stok awal (tercatat di log mutasi).
  /// Edit: stok tidak diubah di sini, pakai [adjustStock]. Throws [DuplicateNameException].
  Future<String> saveProduct(ProductView product, {required bool isNew});

  Future<void> setProductActive(String id, bool active);

  /// Hanya untuk produk tanpa riwayat transaksi; selain itu throws [StateError].
  Future<void> deleteProduct(String id);

  Future<void> adjustStock(
    String productId, {
    required int newStock,
    required StockMovementType reason,
    String? note,
  });

  Stream<List<StockMovementView>> watchMovements(String productId);
}

abstract interface class TransactionRepository {
  /// Atomik: transaksi, item, pengurangan stok, dan log mutasi tersimpan semua atau
  /// tidak sama sekali. Throws [OutOfStockException] (rollback) dan [ArgumentError].
  Future<TransactionView> checkout(Cart cart, PaymentMethod method, {int? received});

  Stream<List<TransactionView>> watchByDate(DateTime day);

  /// Stok dikembalikan; transaksi tetap tersimpan dengan status void.
  Future<void> voidTransaction(String id, String reason);
}

// ---------------------------------------------------------------------------
// Implementasi lokal (Drift / SQLite).
// ---------------------------------------------------------------------------

class LocalSettingsRepository implements SettingsRepository {
  LocalSettingsRepository(this.db);
  final PosDatabase db;

  @override
  Stream<StoreSettings> watch() => _query().watch().map(_first);

  @override
  Future<StoreSettings> get() => _query().get().then(_first);

  JoinedSelectStatement<HasResultSet, dynamic> _query() =>
      db.select(db.storeSettingsTable).join([
        leftOuterJoin(db.users, db.users.id.equals(_userId)),
      ])..where(db.storeSettingsTable.id.equals(_settingsId));

  StoreSettings _first(List<TypedResult> rows) {
    if (rows.isEmpty) return const StoreSettings();
    final s = rows.first.readTable(db.storeSettingsTable);
    final u = rows.first.readTableOrNull(db.users);
    return StoreSettings(
      setupDone: s.setupDone,
      storeName: s.storeName,
      address: s.address,
      phone: s.phone,
      receiptHeader: s.receiptHeader,
      receiptFooter: s.receiptFooter,
      logoPath: s.logoPath,
      receiptPrefix: s.receiptPrefix,
      dailyReset: s.dailyReset,
      tax: TaxSettings(
        enabled: s.taxEnabled,
        name: s.taxName,
        rateBp: s.taxRateBp,
        inclusive: s.taxInclusive,
      ),
      paper: PaperWidth.values.byName(s.paper),
      printerAddress: s.printerAddress,
      printerName: s.printerName,
      userName: u?.name ?? const StoreSettings().userName,
      userPhotoPath: u?.photoPath,
    );
  }

  @override
  Future<void> save(StoreSettings s) => db.transaction(() async {
    final now = DateTime.now();
    await db.into(db.storeSettingsTable).insertOnConflictUpdate(
      StoreSettingsTableCompanion.insert(
        id: _settingsId,
        setupDone: Value(s.setupDone),
        storeName: Value(s.storeName.trim()),
        address: Value(s.address.trim()),
        phone: Value(s.phone.trim()),
        receiptHeader: Value(s.receiptHeader.trim()),
        receiptFooter: Value(s.receiptFooter.trim()),
        logoPath: Value(s.logoPath),
        receiptPrefix: Value(s.receiptPrefix.trim()),
        dailyReset: Value(s.dailyReset),
        taxEnabled: Value(s.tax.enabled),
        taxName: Value(s.tax.name.trim()),
        taxRateBp: Value(s.tax.rateBp),
        taxInclusive: Value(s.tax.inclusive),
        paper: Value(s.paper.name),
        printerAddress: Value(s.printerAddress),
        printerName: Value(s.printerName),
        updatedAt: Value(now),
      ),
    );
    await db.into(db.users).insertOnConflictUpdate(
      UsersCompanion.insert(
        id: _userId,
        name: s.userName.trim(),
        photoPath: Value(s.userPhotoPath),
        updatedAt: Value(now),
      ),
    );
  });
}

class LocalCatalogRepository implements CatalogRepository {
  LocalCatalogRepository(this.db);
  final PosDatabase db;

  @override
  Stream<List<CategoryView>> watchCategories() {
    final q = db.select(db.categories)
      ..where((c) => c.deletedAt.isNull())
      ..orderBy([(c) => OrderingTerm.asc(c.id)]);
    return q.watch().map(
      (rows) => [for (final c in rows) CategoryView(id: c.id, name: c.name, active: c.active)],
    );
  }

  @override
  Stream<List<ProductView>> watchProducts() {
    final p = db.products;
    final hasSales = existsQuery(
      db.select(db.transactionItems)..where((t) => t.productId.equalsExp(p.id)),
    );
    final q = db.select(p).join([innerJoin(db.categories, db.categories.id.equalsExp(p.categoryId))])
      ..addColumns([hasSales])
      ..where(p.deletedAt.isNull())
      ..orderBy([OrderingTerm.asc(p.name.lower())]);
    return q.watch().map(
      (rows) => [
        for (final r in rows)
          _product(r.readTable(p), r.readTable(db.categories).name, r.read(hasSales) ?? false),
      ],
    );
  }

  ProductView _product(ProductRow r, String categoryName, bool hasSales) => ProductView(
    id: r.id,
    name: r.name,
    price: r.price,
    categoryId: r.categoryId,
    categoryName: categoryName,
    sku: r.sku,
    photoPath: r.photoPath,
    stock: r.stock,
    minStock: r.minStock,
    active: r.active,
    hasSales: hasSales,
  );

  Future<bool> _taken<T extends Table, R>(
    TableInfo<T, R> table,
    GeneratedColumn<String> idCol,
    GeneratedColumn<String> nameCol,
    GeneratedColumn<DateTime> deletedCol,
    String name,
    String? except,
  ) async {
    final q = db.selectOnly(table)
      ..addColumns([idCol])
      ..where(nameCol.lower().equals(name.trim().toLowerCase()) & deletedCol.isNull());
    if (except != null) q.where(idCol.equals(except).not());
    return (await q.get()).isNotEmpty;
  }

  @override
  Future<String> saveCategory({String? id, required String name, bool active = true}) =>
      db.transaction(() async {
        final c = db.categories;
        if (await _taken(c, c.id, c.name, c.deletedAt, name, id)) {
          throw DuplicateNameException(name.trim());
        }
        final now = DateTime.now();
        final key = id ?? newId();
        await db.into(c).insertOnConflictUpdate(
          CategoriesCompanion.insert(
            id: key,
            name: name.trim(),
            active: Value(active),
            updatedAt: Value(now),
          ),
        );
        return key;
      });

  @override
  Future<String> saveProduct(ProductView product, {required bool isNew}) =>
      db.transaction(() async {
        final p = db.products;
        if (await _taken(p, p.id, p.name, p.deletedAt, product.name, isNew ? null : product.id)) {
          throw DuplicateNameException(product.name.trim());
        }
        if (product.price <= 0 || product.stock < 0 || product.minStock < 0) {
          throw ArgumentError('Harga harus > 0, stok dan batas minimum tidak boleh minus');
        }
        final now = DateTime.now();
        final sku = product.sku?.trim();
        if (!isNew) {
          await (db.update(p)..where((t) => t.id.equals(product.id))).write(
            ProductsCompanion(
              categoryId: Value(product.categoryId),
              name: Value(product.name.trim()),
              sku: Value(sku == null || sku.isEmpty ? null : sku),
              price: Value(product.price),
              minStock: Value(product.minStock),
              photoPath: Value(product.photoPath),
              active: Value(product.active),
              updatedAt: Value(now),
            ),
          );
          return product.id;
        }
        final id = newId();
        await db.into(p).insert(
          ProductsCompanion.insert(
            id: id,
            categoryId: product.categoryId,
            name: product.name.trim(),
            sku: Value(sku == null || sku.isEmpty ? null : sku),
            price: product.price,
            stock: Value(product.stock),
            minStock: Value(product.minStock),
            photoPath: Value(product.photoPath),
            active: Value(product.active),
          ),
        );
        await _movement(id, StockMovementType.initial, product.stock, product.stock);
        return id;
      });

  Future<void> _movement(
    String productId,
    StockMovementType type,
    int change,
    int after, {
    String? note,
    String? transactionId,
  }) => db.into(db.stockMovements).insert(
    StockMovementsCompanion.insert(
      id: newId(),
      productId: productId,
      type: type.name,
      qtyChange: change,
      stockAfter: after,
      note: Value(note),
      transactionId: Value(transactionId),
    ),
  );

  @override
  Future<void> setProductActive(String id, bool active) =>
      (db.update(db.products)..where((t) => t.id.equals(id))).write(
        ProductsCompanion(active: Value(active), updatedAt: Value(DateTime.now())),
      );

  @override
  Future<void> deleteProduct(String id) => db.transaction(() async {
    final sold = await (db.select(db.transactionItems)
          ..where((t) => t.productId.equals(id))
          ..limit(1))
        .getSingleOrNull();
    if (sold != null) {
      throw StateError('Produk dengan riwayat transaksi hanya bisa dinonaktifkan');
    }
    final now = DateTime.now();
    await (db.update(db.products)..where((t) => t.id.equals(id))).write(
      ProductsCompanion(deletedAt: Value(now), updatedAt: Value(now)),
    );
  });

  @override
  Future<void> adjustStock(
    String productId, {
    required int newStock,
    required StockMovementType reason,
    String? note,
  }) => db.transaction(() async {
    if (newStock < 0) throw ArgumentError('Stok tidak boleh minus');
    final row = await (db.select(db.products)..where((t) => t.id.equals(productId))).getSingle();
    final change = newStock - row.stock;
    if (change == 0) return;
    await (db.update(db.products)..where((t) => t.id.equals(productId))).write(
      ProductsCompanion(stock: Value(newStock), updatedAt: Value(DateTime.now())),
    );
    final trimmed = note?.trim();
    await _movement(
      productId,
      reason,
      change,
      newStock,
      note: trimmed == null || trimmed.isEmpty ? null : trimmed,
    );
  });

  @override
  Stream<List<StockMovementView>> watchMovements(String productId) {
    final q = db.select(db.stockMovements)
      ..where((m) => m.productId.equals(productId))
      ..orderBy([(m) => OrderingTerm.desc(m.id)]);
    return q.watch().map(
      (rows) => [
        for (final m in rows)
          StockMovementView(
            id: m.id,
            productId: m.productId,
            type: StockMovementType.values.byName(m.type),
            qtyChange: m.qtyChange,
            stockAfter: m.stockAfter,
            createdAt: m.createdAt,
            note: m.note,
          ),
      ],
    );
  }
}

class LocalTransactionRepository implements TransactionRepository {
  LocalTransactionRepository(this.db);
  final PosDatabase db;

  @override
  Future<TransactionView> checkout(Cart cart, PaymentMethod method, {int? received}) {
    if (cart.isEmpty) throw ArgumentError('Keranjang kosong');
    final totals = cart.totals;
    final paid = method == PaymentMethod.cash ? (received ?? 0) : totals.total;
    if (paid < totals.total) throw ArgumentError('Uang diterima kurang dari total');

    return db.transaction(() async {
      final now = DateTime.now();
      final id = newId();
      final receiptNo = await _nextReceiptNo(now);
      final rateBp = cart.tax.enabled ? cart.tax.rateBp : 0;
      await db.into(db.transactions).insert(
        TransactionsCompanion.insert(
          id: id,
          receiptNo: receiptNo,
          businessDate: _dateKey(now),
          orderType: Value(cart.orderType),
          paymentMethod: method.dbValue,
          subtotal: totals.subtotal,
          taxName: cart.tax.name,
          taxRateBp: rateBp,
          taxInclusive: cart.tax.inclusive,
          taxAmount: totals.tax,
          total: totals.total,
          received: paid,
          changeAmount: paid - totals.total,
          createdAt: Value(now),
          updatedAt: Value(now),
        ),
      );
      final p = db.products;
      for (final item in cart.items) {
        await db.into(db.transactionItems).insert(
          TransactionItemsCompanion.insert(
            id: newId(),
            transactionId: id,
            productId: item.productId,
            productName: item.name,
            price: item.price,
            qty: item.qty,
            lineTotal: item.lineTotal,
          ),
        );
        final updated = await (db.update(p)..where(
              (t) =>
                  t.id.equals(item.productId) &
                  t.stock.isBiggerOrEqualValue(item.qty) &
                  t.active.equals(true) &
                  t.deletedAt.isNull(),
            ))
            .write(
              ProductsCompanion.custom(stock: p.stock - Variable(item.qty), updatedAt: Variable(now)),
            );
        if (updated == 0) throw OutOfStockException(item.productId);
        await _movement(item.productId, StockMovementType.sale, -item.qty, id);
      }
      return TransactionView(
        id: id,
        receiptNo: receiptNo,
        createdAt: now,
        method: method,
        orderType: cart.orderType,
        items: [
          for (final i in cart.items)
            TransactionItemView(productId: i.productId, name: i.name, price: i.price, qty: i.qty),
        ],
        subtotal: totals.subtotal,
        taxName: cart.tax.name,
        taxRateBp: rateBp,
        taxInclusive: cart.tax.inclusive,
        taxAmount: totals.tax,
        total: totals.total,
        received: paid,
      );
    });
  }

  /// Unik dan berurutan: per hari (INV-261121-0001) atau terus berlanjut (INV-000001).
  Future<String> _nextReceiptNo(DateTime now) async {
    final s = await (db.select(db.storeSettingsTable)..where((t) => t.id.equals(_settingsId)))
        .getSingleOrNull();
    final custom = s?.receiptPrefix ?? '';
    final prefix = custom.isEmpty ? 'INV' : custom;
    final daily = s?.dailyReset ?? true;
    final t = db.transactions;
    final count = t.id.count();
    final q = db.selectOnly(t)..addColumns([count]);
    if (daily) q.where(t.businessDate.equals(_dateKey(now)));
    final n = (await q.map((r) => r.read(count)!).getSingle()) + 1;
    if (!daily) return '$prefix-${n.toString().padLeft(6, '0')}';
    final yymmdd =
        '${(now.year % 100).toString().padLeft(2, '0')}'
        '${now.month.toString().padLeft(2, '0')}${now.day.toString().padLeft(2, '0')}';
    return '$prefix-$yymmdd-${n.toString().padLeft(4, '0')}';
  }

  /// Log mutasi untuk penjualan (change < 0) dan void (change > 0).
  Future<void> _movement(String productId, StockMovementType type, int change, String trxId) async {
    final after = await (db.selectOnly(db.products)
          ..addColumns([db.products.stock])
          ..where(db.products.id.equals(productId)))
        .map((r) => r.read(db.products.stock)!)
        .getSingle();
    await db.into(db.stockMovements).insert(
      StockMovementsCompanion.insert(
        id: newId(),
        productId: productId,
        type: type.name,
        qtyChange: change,
        stockAfter: after,
        transactionId: Value(trxId),
      ),
    );
  }

  @override
  Stream<List<TransactionView>> watchByDate(DateTime day) {
    final q = db.select(db.transactions)
      ..where((t) => t.businessDate.equals(_dateKey(day)))
      ..orderBy([(t) => OrderingTerm.desc(t.id)]);
    return q.watch().asyncMap((rows) async {
      if (rows.isEmpty) return const <TransactionView>[];
      final items = await (db.select(db.transactionItems)
            ..where((i) => i.transactionId.isIn(rows.map((r) => r.id)))
            ..orderBy([(i) => OrderingTerm.asc(i.id)]))
          .get();
      return [
        for (final r in rows)
          TransactionView(
            id: r.id,
            receiptNo: r.receiptNo,
            createdAt: r.createdAt,
            method: PaymentMethod.fromDb(r.paymentMethod),
            orderType: r.orderType,
            items: [
              for (final i in items.where((i) => i.transactionId == r.id))
                TransactionItemView(
                  productId: i.productId,
                  name: i.productName,
                  price: i.price,
                  qty: i.qty,
                ),
            ],
            subtotal: r.subtotal,
            taxName: r.taxName,
            taxRateBp: r.taxRateBp,
            taxInclusive: r.taxInclusive,
            taxAmount: r.taxAmount,
            total: r.total,
            received: r.received,
            status: r.status == 'void' ? TransactionStatus.voided : TransactionStatus.completed,
            voidReason: r.voidReason,
          ),
      ];
    });
  }

  @override
  Future<void> voidTransaction(String id, String reason) => db.transaction(() async {
    final trx = await (db.select(db.transactions)..where((t) => t.id.equals(id))).getSingle();
    if (trx.status == 'void') throw StateError('Transaksi sudah di-void');
    if (reason.trim().isEmpty) throw ArgumentError('Alasan void wajib diisi');
    final now = DateTime.now();
    await (db.update(db.transactions)..where((t) => t.id.equals(id))).write(
      TransactionsCompanion(
        status: const Value('void'),
        voidReason: Value(reason.trim()),
        voidedAt: Value(now),
        updatedAt: Value(now),
      ),
    );
    final items = await (db.select(db.transactionItems)..where((i) => i.transactionId.equals(id)))
        .get();
    final p = db.products;
    for (final item in items) {
      await (db.update(p)..where((t) => t.id.equals(item.productId))).write(
        ProductsCompanion.custom(stock: p.stock + Variable(item.qty), updatedAt: Variable(now)),
      );
      await _movement(item.productId, StockMovementType.voided, item.qty, id);
    }
  });
}
