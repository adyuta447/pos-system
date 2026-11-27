import 'package:flutter/services.dart';

const _days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const _months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

/// "Sabtu, 21 Nov 2026"
String formatDate(DateTime d) =>
    '${_days[d.weekday - 1]}, ${d.day} ${_months[d.month - 1]} ${d.year}';

/// "08:05"
String formatTime(DateTime d) =>
    '${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';

DateTime dateOnly(DateTime d) => DateTime(d.year, d.month, d.day);

/// Memformat angka bulat menjadi string dengan pemisah ribuan `.` (misal `50000` -> `50.000`).
String formatThousands(int amount) =>
    amount.toString().replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (_) => '.');

/// Mengambil nilai integer dari teks berpemisah ribuan (mengabaikan karakter non-digit).
int? parseFormattedInt(String? text) {
  if (text == null) return null;
  final digits = text.replaceAll(RegExp(r'\D'), '');
  return digits.isEmpty ? null : int.tryParse(digits);
}

/// Formatter input angka yang otomatis menyisipkan pemisah ribuan `.` saat diketik.
class ThousandsInputFormatter extends TextInputFormatter {
  ThousandsInputFormatter({this.maxDigits = 9});
  final int maxDigits;

  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    final rawDigits = newValue.text.replaceAll(RegExp(r'\D'), '');
    if (rawDigits.isEmpty) return const TextEditingValue();

    final digits = rawDigits.length > maxDigits ? rawDigits.substring(0, maxDigits) : rawDigits;
    final formatted = formatThousands(int.parse(digits));

    final cursorOffset = newValue.selection.end.clamp(0, newValue.text.length);
    final digitsBeforeCursor =
        newValue.text.substring(0, cursorOffset).replaceAll(RegExp(r'\D'), '').length;

    var newCursor = 0;
    var seenDigits = 0;
    while (newCursor < formatted.length && seenDigits < digitsBeforeCursor) {
      if (formatted[newCursor] != '.') seenDigits++;
      newCursor++;
    }

    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: newCursor),
    );
  }
}
