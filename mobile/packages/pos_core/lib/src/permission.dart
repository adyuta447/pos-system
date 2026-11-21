/// Hak akses per aksi. Pre-launch: satu pengguna mendapat [Permission.values];
/// v1.2 tinggal memetakan role ke daftar permission.
enum Permission {
  processSale,
  voidSale,
  manageProducts,
  manageStock,
  viewReports,
  manageSettings,
  managePrinter,
}
