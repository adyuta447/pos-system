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
