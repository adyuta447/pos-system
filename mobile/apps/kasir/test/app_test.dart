import 'dart:async';
import 'dart:io';

import 'package:drift/drift.dart' show driftRuntimeOptions;
import 'package:drift/native.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_data/pos_data.dart';
import 'package:pos_kasir/app/format.dart';
import 'package:pos_kasir/app/providers.dart';
import 'package:pos_kasir/app/receipt_printer.dart';
import 'package:pos_kasir/main.dart';
import 'package:pos_ui/pos_ui.dart';

/// Toko yang sudah selesai setup dengan satu kategori dan dua produk.
Future<PosDatabase> _seeded() async {
  final db = PosDatabase(NativeDatabase.memory());
  await LocalSettingsRepository(db)
      .save(const StoreSettings(setupDone: true, storeName: 'Kopi Laris', userName: 'Rina Novita'));
  final catalog = LocalCatalogRepository(db);
  final cat = await catalog.saveCategory(name: 'Kopi');
  await catalog.saveProduct(
    ProductView(id: '', name: 'Kopi Susu', price: 18000, categoryId: cat, stock: 5),
    isNew: true,
  );
  await catalog.saveProduct(
    ProductView(id: '', name: 'Americano', price: 15000, categoryId: cat, stock: 0),
    isNew: true,
  );
  return db;
}

Future<void> _launch(WidgetTester t, PosDatabase db, {Size size = const Size(1000, 576)}) async {
  t.view.physicalSize = size;
  t.view.devicePixelRatio = 1;
  addTearDown(t.view.reset);
  await t.pumpWidget(
    ProviderScope(overrides: [databaseProvider.overrideWithValue(db)], child: const KasirApp()),
  );
  await _settle(t);
}

/// Query Drift berjalan di luar fake async; beri waktu nyata lalu render ulang.
Future<void> _settle(WidgetTester t) async {
  for (var i = 0; i < 5; i++) {
    await t.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 20)));
    await t.pump();
  }
  await t.pump(const Duration(milliseconds: 600));
}

Future<void> _tap(WidgetTester t, Finder f) async {
  await t.ensureVisible(f);
  await t.tap(f);
  await _settle(t);
}

Future<void> _close(WidgetTester t, PosDatabase db) async {
  await t.pumpWidget(const SizedBox());
  // Tidak di-await: close menunggu timer stream Drift yang hidup di zona fake async.
  unawaited(db.close());
  await t.pump(const Duration(seconds: 1));
}

void main() {
  setUpAll(() async {
    driftRuntimeOptions.dontWarnAboutMultipleDatabases = true;
    // Metrik font asli, supaya cek overflow sama dengan di tablet.
    final inter = FontLoader('packages/pos_ui/Inter');
    for (final w in ['Regular', 'Medium', 'SemiBold', 'Bold']) {
      final bytes = File('../../packages/pos_ui/assets/fonts/Inter-$w.ttf').readAsBytesSync();
      inter.addFont(Future.value(ByteData.sublistView(bytes)));
    }
    await inter.load();
  });

  test('formatDate uses Indonesian names', () {
    expect(formatDate(DateTime(2026, 11, 21)), 'Sabtu, 21 Nov 2026');
    expect(formatTime(DateTime(2026, 1, 1, 8, 5)), '08:05');
  });

  testWidgets('first launch runs the setup wizard, then opens the register', (t) async {
    final db = PosDatabase(NativeDatabase.memory());
    await _launch(t, db);
    expect(find.text('Setup awal'), findsOneWidget);

    await _tap(t, find.text('Lanjut'));
    expect(find.text('Nama toko wajib diisi'), findsOneWidget);
    await t.enterText(find.widgetWithText(TextFormField, 'Nama toko'), 'Warung Bu Sri');
    await _settle(t);
    // Preview struk ikut berubah.
    expect(
      find.descendant(
        of: find.byType(ReceiptPreview),
        matching: find.textContaining('Warung Bu Sri'),
      ),
      findsOneWidget,
    );
    await _tap(t, find.text('Lanjut')); // nomor struk
    await _tap(t, find.text('Lanjut')); // pajak
    await _tap(t, find.text('Lanjut')); // printer
    await _tap(t, find.text('Lewati'));
    await t.enterText(find.widgetWithText(TextFormField, 'Kategori'), 'Makanan');
    await t.enterText(find.widgetWithText(TextFormField, 'Nama produk'), 'Nasi Uduk');
    await t.enterText(find.widgetWithText(TextFormField, 'Harga'), '12000');
    await t.enterText(find.widgetWithText(TextFormField, 'Stok awal'), '10');
    await _tap(t, find.text('Selesai, mulai berjualan'));

    expect(find.text('Warung Bu Sri'), findsOneWidget);
    expect(find.widgetWithText(ProductTile, 'Nasi Uduk'), findsOneWidget);
    expect(find.text('Setup awal'), findsNothing);
    expect(t.takeException(), isNull);
    await _close(t, db);
  });

  testWidgets('cash sale saves the transaction and lowers stock', (t) async {
    final db = await t.runAsync(_seeded);
    await _launch(t, db!);
    expect(find.text('Habis'), findsOneWidget);

    await _tap(t, find.widgetWithText(ProductTile, 'Americano')); // stok 0: tidak masuk keranjang
    await _tap(t, find.widgetWithText(ProductTile, 'Kopi Susu'));
    await _tap(t, find.widgetWithText(ProductTile, 'Kopi Susu'));
    expect(find.text('Bayar Rp36.000'), findsOneWidget);
    expect(find.textContaining('PPN'), findsNothing); // pajak nonaktif

    await _tap(t, find.text('Bayar Rp36.000'));
    expect(find.text('Pembayaran'), findsOneWidget);
    await _tap(t, find.text('Rp20.000'));
    await _tap(t, find.text('Konfirmasi pembayaran')); // kurang: tidak tersimpan
    expect(find.text('Pembayaran berhasil'), findsNothing);
    await _tap(t, find.text('Rp50.000'));
    expect(find.text('Kembalian Rp14.000'), findsOneWidget);
    await _tap(t, find.text('Konfirmasi pembayaran'));
    expect(find.text('Pembayaran berhasil'), findsOneWidget);
    expect(
      find.textContaining('Printer belum dipilih'),
      findsOneWidget,
    ); // gagal cetak tidak membatalkan

    await _tap(t, find.text('Transaksi baru'));
    expect(find.text('Stok 3'), findsOneWidget);
    expect(find.text('Bayar'), findsOneWidget);

    // Snackbar gagal cetak menutupi tombol panel kanan; tutup dulu.
    messengerKey.currentState!.removeCurrentSnackBar();
    await _settle(t);
    await _tap(t, find.text('Riwayat'));
    expect(find.text('Rp36.000'), findsWidgets);
    await _tap(t, find.text('Void'));
    await t.enterText(find.byType(TextFormField), 'Salah input');
    await _tap(t, find.text('Void transaksi'));
    expect(find.text('Alasan void: Salah input'), findsOneWidget);
    expect(find.widgetWithText(Column, 'Penjualan'), findsWidgets);
    expect(find.text('Rp0'), findsWidgets); // void tidak dihitung
    expect(t.takeException(), isNull);
    await _close(t, db);
  });

  testWidgets('QRIS "Belum" returns to the cart without saving', (t) async {
    final db = await t.runAsync(_seeded);
    await _launch(t, db!);
    await _tap(t, find.widgetWithText(ProductTile, 'Kopi Susu'));
    await _tap(t, find.text('Bayar Rp18.000'));
    await _tap(t, find.text('QRIS'));
    await _tap(t, find.text('Konfirmasi pembayaran'));
    expect(find.text('Sudah dibayar?'), findsOneWidget);
    await _tap(t, find.text('Belum'));
    expect(find.text('Bayar Rp18.000'), findsOneWidget);
    final saved = await t.runAsync(() => db.select(db.transactions).get());
    expect(saved, isEmpty);
    await _close(t, db);
  });

  for (final size in const [Size(1000, 576), Size(1280, 800)]) {
    testWidgets('pages fit without overflow at $size', (t) async {
      final db = await t.runAsync(_seeded);
      await _launch(t, db!, size: size);
      for (final page in ['Produk', 'Pengaturan', 'Riwayat', 'Kasir']) {
        await _tap(t, find.text(page).first);
        expect(t.takeException(), isNull, reason: page);
      }
      for (final tab in ['Toko', 'Pajak', 'Printer']) {
        await _tap(t, find.text('Pengaturan').first);
        await _tap(t, find.text(tab));
        expect(t.takeException(), isNull, reason: tab);
      }
      await _close(t, db);
    });
  }
}
