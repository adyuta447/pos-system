import 'dart:io';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_printer/pos_printer.dart';

import 'providers.dart';

/// Messenger global supaya snackbar Cetak Ulang tetap tampil walau halaman sudah berganti.
final messengerKey = GlobalKey<ScaffoldMessengerState>();

final receiptPrinterProvider = Provider<ReceiptPrinter>(ReceiptPrinter.new);

/// Membuat struk lalu mengirimnya ke printer. Gagal cetak tidak melempar error:
/// muncul snackbar dengan tombol Cetak Ulang (PRD: transaksi tetap tersimpan).
class ReceiptPrinter {
  ReceiptPrinter(this.ref);
  final Ref ref;

  Future<bool> printTransaction(TransactionView trx, {bool copy = false}) async {
    final store = await ref.read(settingsRepositoryProvider).get();
    return _send(store, ReceiptLayout.build(trx: trx, store: store, copy: copy));
  }

  /// Tes cetak memakai pengaturan [store] yang sedang diedit dan data contoh.
  Future<bool> printTest(StoreSettings store) =>
      _send(store, ReceiptLayout.build(trx: ReceiptLayout.sample(store), store: store));

  /// PRD: printer terakhir di-connect otomatis saat app dibuka.
  Future<void> autoConnect() async {
    final store = await ref.read(settingsRepositoryProvider).get();
    final address = store.printerAddress;
    if (address == null) return;
    try {
      await ref
          .read(printerServiceProvider)
          .connect(PrinterDevice(name: store.printerName ?? address, address: address));
    } on Exception {
      // Dicoba lagi saat mencetak.
    }
  }

  Future<bool> _send(StoreSettings store, List<ReceiptLine> lines) async {
    try {
      final address = store.printerAddress;
      if (address == null) throw const PrinterException('Printer belum dipilih di Pengaturan');
      final logoPath = store.logoPath;
      final logo = logoPath != null && File(logoPath).existsSync()
          ? await File(logoPath).readAsBytes()
          : null;
      final bytes = await ReceiptBuilder(paper: store.paper).build(lines, logo: logo);
      final service = ref.read(printerServiceProvider);
      await service.connect(PrinterDevice(name: store.printerName ?? address, address: address));
      await service.printBytes(bytes);
      return true;
    } on Exception catch (e) {
      messengerKey.currentState
        ?..hideCurrentSnackBar()
        ..showSnackBar(
          SnackBar(
            duration: const Duration(seconds: 8),
            content: Text('Struk gagal dicetak: ${e is PrinterException ? e.message : e}'),
            action: SnackBarAction(label: 'Cetak Ulang', onPressed: () => _send(store, lines)),
          ),
        );
      return false;
    }
  }
}
