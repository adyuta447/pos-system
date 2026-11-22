import 'dart:io';

import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

Widget _wrap(Widget child, {double width = 400}) => MaterialApp(
  theme: posTheme(),
  home: Scaffold(
    body: Center(
      child: SizedBox(width: width, child: child),
    ),
  ),
);

void main() {
  setUpAll(() async {
    // Metrik font asli, supaya cek overflow sama dengan di tablet.
    final inter = FontLoader('packages/pos_ui/Inter');
    for (final w in ['Regular', 'Medium', 'SemiBold', 'Bold']) {
      final bytes = File('assets/fonts/Inter-$w.ttf').readAsBytesSync();
      inter.addFont(Future.value(ByteData.sublistView(bytes)));
    }
    await inter.load();
  });

  testWidgets('PosButton calls back and disables without a callback', (t) async {
    var taps = 0;
    await t.pumpWidget(
      _wrap(
        Column(
          children: [
            PosButton.primary(label: 'Bayar', onPressed: () => taps++),
            const PosButton.danger(label: 'Void', onPressed: null),
            PosButton.secondary(label: 'Batal', onPressed: () {}, size: PosButtonSize.sm),
          ],
        ),
      ),
    );
    await t.tap(find.text('Bayar'));
    await t.tap(find.text('Void'));
    expect(taps, 1);
    // PRD: tap target minimal 48dp.
    expect(t.getSize(find.byType(PosButton).last).height, greaterThanOrEqualTo(48));
  });

  testWidgets('PriceText and PosAvatar format their data', (t) async {
    await t.pumpWidget(
      _wrap(
        const Row(
          children: [
            PriceText(1250000),
            PosAvatar(name: 'rina novita'),
          ],
        ),
      ),
    );
    expect(find.text('Rp1.250.000'), findsOneWidget);
    expect(find.text('RN'), findsOneWidget);
  });

  testWidgets('ProductTile shows stock state and ignores taps when sold out', (t) async {
    var taps = 0;
    const p = ProductView(
      id: '1',
      name: 'Kopi',
      price: 18000,
      categoryId: 'c',
      stock: 3,
      minStock: 5,
    );
    await t.pumpWidget(
      _wrap(
        SizedBox(
          height: 104,
          child: ProductTile(product: p, qty: 2, onTap: () => taps++),
        ),
      ),
    );
    expect(find.text('Sisa 3'), findsOneWidget);
    expect(find.text('2'), findsOneWidget);
    await t.tap(find.text('Kopi'));
    await t.pumpWidget(
      _wrap(
        SizedBox(
          height: 104,
          child: ProductTile(product: p.copyWith(stock: 0), onTap: () => taps++),
        ),
      ),
    );
    expect(find.text('Habis'), findsOneWidget);
    await t.tap(find.text('Kopi'));
    expect(taps, 1);
  });

  testWidgets('QtyStepper disables plus at the stock limit', (t) async {
    var minus = 0;
    await t.pumpWidget(_wrap(QtyStepper(qty: 3, onMinus: () => minus++, onPlus: null)));
    await t.tap(find.bySemanticsLabel('Kurangi'));
    await t.tap(find.bySemanticsLabel('Tambah'));
    expect(minus, 1);
  });

  testWidgets('TotalsSummary hides the tax row without a label', (t) async {
    await t.pumpWidget(
      _wrap(const TotalsSummary(subtotal: 10000, taxLabel: null, tax: 0, total: 10000)),
    );
    expect(find.text('Subtotal'), findsOneWidget);
    expect(find.textContaining('PPN'), findsNothing);
    await t.pumpWidget(
      _wrap(const TotalsSummary(subtotal: 10000, taxLabel: 'PPN 11%', tax: 1100, total: 11100)),
    );
    expect(find.text('PPN 11%'), findsOneWidget);
    expect(find.text('Rp11.100'), findsOneWidget);
  });

  testWidgets('SearchField, CategoryChip and PosSegmented report changes', (t) async {
    String? query;
    var chip = 0;
    int? seg;
    await t.pumpWidget(
      _wrap(
        Column(
          children: [
            SearchField(hint: 'Cari', onChanged: (v) => query = v),
            CategoryChip(label: 'Kopi', count: 4, selected: false, onTap: () => chip++),
            PosSegmented(labels: const ['Tunai', 'QRIS'], selected: 0, onChanged: (i) => seg = i),
          ],
        ),
      ),
    );
    await t.enterText(find.byType(TextField), 'teh');
    await t.tap(find.text('Kopi'));
    await t.tap(find.text('QRIS'));
    expect((query, chip, seg), ('teh', 1, 1));
  });

  testWidgets('PaymentSheet blocks cash below the total and fills Uang pas', (t) async {
    var received = 0;
    var confirmed = 0;
    Widget sheet() => _wrap(
      SizedBox(
        height: 480,
        child: PaymentSheet(
          total: 41800,
          method: PaymentMethod.cash,
          onMethodChanged: (_) {},
          received: received,
          onReceivedChanged: (v) => received = v,
          onConfirm: () => confirmed++,
        ),
      ),
      width: 760,
    );
    await t.pumpWidget(sheet());
    await t.tap(find.text('Konfirmasi pembayaran'));
    expect(confirmed, 0);
    await t.tap(find.text('Uang pas'));
    expect(received, 41800);
    await t.pumpWidget(sheet());
    expect(find.text('Kembalian Rp0'), findsOneWidget);
    await t.tap(find.text('Konfirmasi pembayaran'));
    expect(confirmed, 1);
    await t.tap(find.text('5'));
    expect(received, 418005);
  });

  testWidgets('ReceiptPreview renders every line without overflow', (t) async {
    final lines = [
      const ReceiptLine('KOPI LARIS', bold: true),
      ReceiptLine('-' * 32),
      const ReceiptLine('TOTAL'),
    ];
    await t.pumpWidget(
      _wrap(SizedBox(height: 300, child: ReceiptPreview(lines: lines, chars: 32)), width: 320),
    );
    expect(find.text('KOPI LARIS'), findsOneWidget);
    expect(t.takeException(), isNull);
  });
}
