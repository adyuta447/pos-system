/// `Rp1.250.000`. Semua nominal uang adalah int rupiah.
String formatRupiah(int amount) {
  final digits = amount.abs().toString().replaceAllMapped(
    RegExp(r'\B(?=(\d{3})+(?!\d))'),
    (_) => '.',
  );
  return '${amount < 0 ? '-' : ''}Rp$digits';
}

int calculateChange({required int received, required int total}) => received - total;

/// PRD: tombol Uang Pas, 20rb, 50rb, 100rb. `null` = uang pas.
const quickCashAmounts = <int?>[null, 20000, 50000, 100000];
