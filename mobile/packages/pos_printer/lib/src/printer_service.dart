class PrinterDevice {
  const PrinterDevice({required this.name, required this.address});
  final String name;
  final String address;
}

enum PrinterStatus { disconnected, connecting, connected, error }

class PrinterException implements Exception {
  const PrinterException(this.message);
  final String message;

  @override
  String toString() => message;
}

/// Pengiriman byte ke printer, dipisah dari isi struk supaya package Bluetooth bisa diganti.
abstract class PrinterService {
  Future<List<PrinterDevice>> scan();
  Future<void> connect(PrinterDevice device);
  Future<void> printBytes(List<int> bytes);
  Stream<PrinterStatus> get status;
}

// shortcut: no Bluetooth package yet (PRD Gate 1 picks it after testing the pilot's printer);
// replace with a real PrinterService (unified_esc_pos_printer / thermal_printer_flutter) then.
class UnavailablePrinterService implements PrinterService {
  const UnavailablePrinterService();

  static const message = 'Printer Bluetooth belum tersedia di versi ini';

  @override
  Future<List<PrinterDevice>> scan() async => const [];

  @override
  Future<void> connect(PrinterDevice device) async => throw const PrinterException(message);

  @override
  Future<void> printBytes(List<int> bytes) async => throw const PrinterException(message);

  @override
  Stream<PrinterStatus> get status => Stream.value(PrinterStatus.disconnected);
}
