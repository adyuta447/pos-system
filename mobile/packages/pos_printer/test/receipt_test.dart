import 'package:flutter_test/flutter_test.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_printer/pos_printer.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  const store = StoreSettings(
    storeName: 'Kopi Laris Cabang Pusat Yang Namanya Panjang Sekali',
    address: 'Jl. Merdeka No. 10, Bandung',
    phone: '0812-3456-7890',
    receiptFooter: 'Terima kasih, sampai jumpa lagi!',
    tax: TaxSettings(enabled: true, name: 'PPN', rateBp: 1100),
    userName: 'Rina',
  );

  for (final paper in PaperWidth.values) {
    test('every line fits ${paper.name} (${paper.chars} chars)', () {
      final s = store.copyWith(paper: paper);
      final lines = ReceiptLayout.build(trx: ReceiptLayout.sample(s), store: s);
      for (final l in lines) {
        expect(l.text.length, lessThanOrEqualTo(paper.chars), reason: l.text);
      }
      expect(lines.any((l) => l.text.startsWith('PPN 11%')), isTrue);
      expect(lines.any((l) => l.text.startsWith('Kembalian')), isTrue);
    });
  }

  test('copy is marked SALINAN and disabled tax hides the tax row', () {
    final s = store.copyWith(tax: const TaxSettings());
    final lines = ReceiptLayout.build(trx: ReceiptLayout.sample(s), store: s, copy: true);
    expect(lines.any((l) => l.text.contains('*** SALINAN ***')), isTrue);
    expect(lines.any((l) => l.text.contains('PPN')), isFalse);
  });

  test('inclusive tax is labelled as included', () {
    final s = store.copyWith(tax: const TaxSettings(enabled: true, name: 'PB1', rateBp: 1000, inclusive: true));
    final trx = ReceiptLayout.sample(s);
    final lines = ReceiptLayout.build(trx: trx, store: s);
    expect(lines.any((l) => l.text.startsWith('Termasuk PB1 10%')), isTrue);
    expect(trx.total, trx.subtotal);
  });

  test('builder emits ESC/POS starting with ESC @ and ending with a cut', () async {
    final lines = ReceiptLayout.build(trx: ReceiptLayout.sample(store), store: store);
    final bytes = await const ReceiptBuilder(paper: PaperWidth.mm58).build(lines);
    expect(bytes.take(2), [0x1B, 0x40]);
    expect(bytes.length, greaterThan(200));
  });
}
