import 'package:freezed_annotation/freezed_annotation.dart';

part 'tax.freezed.dart';

/// Pengaturan pajak toko. Tarif dalam basis poin: 11% = 1100.
@freezed
abstract class TaxSettings with _$TaxSettings {
  const factory TaxSettings({
    @Default(false) bool enabled,
    @Default('PPN') String name,
    @Default(1100) int rateBp,
    /// true = harga produk sudah termasuk pajak; false = pajak ditambahkan.
    @Default(false) bool inclusive,
  }) = _TaxSettings;
}

@freezed
abstract class TaxResult with _$TaxResult {
  const factory TaxResult({
    required int subtotal,
    required int tax,
    required int total,
  }) = _TaxResult;
}

/// Satu-satunya hitungan pajak (keranjang, struk, laporan).
/// Pajak dari subtotal, dibulatkan ke rupiah terdekat (half up).
TaxResult calculateTax(int subtotal, TaxSettings settings) {
  final bp = settings.rateBp;
  if (!settings.enabled || bp == 0 || subtotal == 0) {
    return TaxResult(subtotal: subtotal, tax: 0, total: subtotal);
  }
  if (settings.inclusive) {
    // tax = subtotal * bp / (10000 + bp), rounded
    final d = 10000 + bp;
    final tax = (2 * subtotal * bp + d) ~/ (2 * d);
    return TaxResult(subtotal: subtotal, tax: tax, total: subtotal);
  }
  final tax = (subtotal * bp + 5000) ~/ 10000;
  return TaxResult(subtotal: subtotal, tax: tax, total: subtotal + tax);
}

/// 1100 -> "11", 1150 -> "11,5", 1125 -> "11,25".
String formatRate(int bp) {
  final whole = bp ~/ 100;
  final frac = bp % 100;
  if (frac == 0) return '$whole';
  final f = frac.toString().padLeft(2, '0').replaceAll(RegExp(r'0$'), '');
  return '$whole,$f';
}

/// "11", "11,5", "11.25" -> basis poin. null kalau tidak valid, >2 desimal, atau >100%.
int? parseRate(String input) {
  final m = RegExp(r'^\s*(\d{1,3})(?:[.,](\d{1,2}))?\s*$').firstMatch(input);
  if (m == null) return null;
  final bp = int.parse(m[1]!) * 100 + int.parse((m[2] ?? '0').padRight(2, '0'));
  return bp > 10000 ? null : bp;
}

/// Label baris pajak, contoh "PPN 11%" atau "Termasuk PB1 10%". Null bila tarif 0.
String? formatTaxLabel(String name, int rateBp, {bool inclusive = false}) =>
    rateBp <= 0 ? null : '${inclusive ? 'Termasuk ' : ''}$name ${formatRate(rateBp)}%';
