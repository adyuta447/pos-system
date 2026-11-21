import 'package:pos_core/pos_core.dart';
import 'package:test/test.dart';

void main() {
  test('formatRupiah uses dot thousands', () {
    expect(formatRupiah(0), 'Rp0');
    expect(formatRupiah(999), 'Rp999');
    expect(formatRupiah(1250000), 'Rp1.250.000');
    expect(formatRupiah(-6200), '-Rp6.200');
  });

  group('calculateTax', () {
    test('disabled tax adds nothing', () {
      expect(calculateTax(10000, const TaxSettings()), const TaxResult(subtotal: 10000, tax: 0, total: 10000));
    });

    test('exclusive tax is added and rounded half up', () {
      const ppn = TaxSettings(enabled: true, rateBp: 1100);
      expect(calculateTax(10000, ppn).tax, 1100);
      expect(calculateTax(10000, ppn).total, 11100);
      // 12.345 * 11% = 1357.95 -> 1358
      expect(calculateTax(12345, ppn).tax, 1358);
      // 2.5% of 100 = 2.5 -> 3
      expect(calculateTax(100, const TaxSettings(enabled: true, rateBp: 250)).tax, 3);
    });

    test('inclusive tax is extracted from the price, total unchanged', () {
      const pb1 = TaxSettings(enabled: true, name: 'PB1', rateBp: 1000, inclusive: true);
      final r = calculateTax(11000, pb1); // 11000 * 10/110 = 1000
      expect(r.tax, 1000);
      expect(r.total, 11000);
      expect(calculateTax(10000, pb1).tax, 909); // 909.09
    });
  });

  test('rates round-trip with up to 2 decimals', () {
    expect(parseRate('11'), 1100);
    expect(parseRate('11,5'), 1150);
    expect(parseRate('11.25'), 1125);
    expect(parseRate('0'), 0);
    expect(parseRate('11,255'), isNull);
    expect(parseRate('101'), isNull);
    expect(parseRate('abc'), isNull);
    expect(formatRate(1100), '11');
    expect(formatRate(1150), '11,5');
    expect(formatRate(1125), '11,25');
    expect(formatRate(1105), '11,05');
  });

  test('cart totals follow the tax settings', () {
    const cart = Cart(
      items: [
        CartItem(productId: 'a', name: 'A', price: 22000, qty: 2, stock: 10),
        CartItem(productId: 'b', name: 'B', price: 18000, qty: 1, stock: 10),
      ],
      tax: TaxSettings(enabled: true, rateBp: 1000),
    );
    expect(cart.subtotal, 62000);
    expect(cart.totals.tax, 6200);
    expect(cart.total, 68200);
    expect(cart.itemCount, 3);
    expect(cart.qtyOf('a'), 2);
  });

  test('stock flags use the per-product minimum', () {
    const p = ProductView(id: '1', name: 'A', price: 1, categoryId: 'c', stock: 3, minStock: 5);
    expect(p.lowStock, isTrue);
    expect(p.copyWith(stock: 0).soldOut, isTrue);
    expect(p.copyWith(stock: 0).lowStock, isFalse);
    expect(p.copyWith(stock: 6).lowStock, isFalse);
  });
}
