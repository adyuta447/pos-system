import 'package:pos_core/pos_core.dart';

/// Baris struk yang sudah dipotong ke jumlah karakter kertas (58mm = 32, 80mm = 48).
/// Dipakai oleh ReceiptPreview (layar) dan ReceiptBuilder (printer), jadi hasilnya sama.
class ReceiptLayout {
  const ReceiptLayout._();

  static List<ReceiptLine> build({
    required TransactionView trx,
    required StoreSettings store,
    bool copy = false,
  }) {
    final w = store.paper.chars;
    final dash = ReceiptLine('-' * w);
    String row(String left, String right) {
      final room = w - right.length - 1;
      final l = left.length > room ? left.substring(0, room) : left;
      return '$l${' ' * (w - l.length - right.length)}$right';
    }

    List<ReceiptLine> center(String text, {bool bold = false}) => [
      for (final l in _wrap(text, w))
        ReceiptLine('${' ' * ((w - l.length) ~/ 2)}$l', bold: bold),
    ];

    final d = trx.createdAt;
    String two(int n) => n.toString().padLeft(2, '0');
    final when = '${two(d.day)}/${two(d.month)}/${d.year} ${two(d.hour)}:${two(d.minute)}';
    final taxLabel = trx.taxLabel;

    return [
      if (store.storeName.isNotEmpty) ...center(store.storeName, bold: true),
      if (store.address.isNotEmpty) ...center(store.address),
      if (store.phone.isNotEmpty) ...center('Telp ${store.phone}'),
      if (store.receiptHeader.isNotEmpty) ...center(store.receiptHeader),
      dash,
      if (copy) ...center('*** SALINAN ***', bold: true),
      if (trx.isVoid) ...center('*** VOID ***', bold: true),
      ReceiptLine(row('No', trx.receiptNo)),
      ReceiptLine(row('Tanggal', when)),
      ReceiptLine(row('Pesanan', trx.orderType)),
      ReceiptLine(row('Kasir', store.userName)),
      dash,
      for (final i in trx.items) ...[
        for (final l in _wrap(i.name, w)) ReceiptLine(l),
        ReceiptLine(row('  ${i.qty} x ${formatRupiah(i.price)}', formatRupiah(i.lineTotal))),
      ],
      dash,
      ReceiptLine(row('Subtotal', formatRupiah(trx.subtotal))),
      if (taxLabel != null) ReceiptLine(row(taxLabel, formatRupiah(trx.taxAmount))),
      ReceiptLine(row('TOTAL', formatRupiah(trx.total)), bold: true),
      ReceiptLine(row(trx.method.label, formatRupiah(trx.received))),
      if (trx.method == PaymentMethod.cash) ReceiptLine(row('Kembalian', formatRupiah(trx.change))),
      dash,
      if (store.receiptFooter.isNotEmpty) ...center(store.receiptFooter),
    ];
  }

  /// Bungkus per kata; kata yang lebih panjang dari [w] dipotong paksa.
  static List<String> _wrap(String text, int w) {
    final out = <String>[];
    for (final para in text.split('\n')) {
      var cur = '';
      for (var word in para.split(RegExp(r'\s+')).where((s) => s.isNotEmpty)) {
        while (word.length > w) {
          if (cur.isNotEmpty) out.add(cur);
          out.add(word.substring(0, w));
          word = word.substring(w);
          cur = '';
        }
        if (cur.isEmpty) {
          cur = word;
        } else if (cur.length + 1 + word.length <= w) {
          cur = '$cur $word';
        } else {
          out.add(cur);
          cur = word;
        }
      }
      if (cur.isNotEmpty) out.add(cur);
    }
    return out;
  }

  /// Transaksi contoh untuk preview di Pengaturan: 3 item supaya pajak, total, dan
  /// kembalian ikut terlihat.
  static TransactionView sample(StoreSettings store) {
    const items = [
      TransactionItemView(productId: '1', name: 'Kopi Susu Gula Aren', price: 22000, qty: 2),
      TransactionItemView(productId: '2', name: 'Croissant Cokelat', price: 19000, qty: 1),
      TransactionItemView(productId: '3', name: 'Air Mineral', price: 8000, qty: 1),
    ];
    final subtotal = items.fold(0, (s, i) => s + i.lineTotal);
    final t = calculateTax(subtotal, store.tax);
    return TransactionView(
      id: 'preview',
      receiptNo: '${store.receiptPrefix.isEmpty ? 'INV' : store.receiptPrefix}-'
          '${store.dailyReset ? '261121-0001' : '000001'}',
      createdAt: DateTime(2026, 11, 21, 9, 30),
      method: PaymentMethod.cash,
      orderType: 'Dine in',
      items: items,
      subtotal: subtotal,
      taxName: store.tax.name,
      taxRateBp: store.tax.enabled ? store.tax.rateBp : 0,
      taxInclusive: store.tax.inclusive,
      taxAmount: t.tax,
      total: t.total,
      received: ((t.total + 49999) ~/ 50000) * 50000,
    );
  }
}
