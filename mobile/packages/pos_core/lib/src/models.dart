import 'package:freezed_annotation/freezed_annotation.dart';

import 'tax.dart';

part 'models.freezed.dart';

enum PaymentMethod {
  cash('cash', 'Tunai'),
  qrisManual('qris_manual', 'QRIS');

  const PaymentMethod(this.dbValue, this.label);
  final String dbValue;
  final String label;

  static PaymentMethod fromDb(String v) => values.firstWhere((m) => m.dbValue == v);
}

enum TransactionStatus { completed, voided }

/// Lebar kertas thermal dan jumlah karakter per baris (font A).
enum PaperWidth {
  mm58(32),
  mm80(48);

  const PaperWidth(this.chars);
  final int chars;
}

enum StockMovementType {
  initial('Stok awal'),
  sale('Penjualan'),
  voided('Void'),
  restock('Barang masuk'),
  damaged('Rusak'),
  opname('Selisih opname'),
  other('Lainnya');

  const StockMovementType(this.label);
  final String label;

  /// Alasan yang bisa dipilih saat penyesuaian manual.
  static const manual = [restock, damaged, opname, other];
}

const orderTypes = ['Dine in', 'Take away', 'Delivery'];

@freezed
abstract class CategoryView with _$CategoryView {
  const factory CategoryView({
    required String id,
    required String name,
    @Default(true) bool active,
  }) = _CategoryView;
}

@freezed
abstract class ProductView with _$ProductView {
  const ProductView._();
  const factory ProductView({
    required String id,
    required String name,
    required int price,
    required String categoryId,
    @Default('') String categoryName,
    String? sku,
    String? photoPath,
    @Default(0) int stock,
    @Default(0) int minStock,
    @Default(true) bool active,
    /// Produk yang sudah pernah terjual hanya bisa dinonaktifkan, tidak dihapus.
    @Default(false) bool hasSales,
  }) = _ProductView;

  bool get soldOut => stock <= 0;
  bool get lowStock => !soldOut && stock <= minStock;
}

@freezed
abstract class CartItem with _$CartItem {
  const CartItem._();
  const factory CartItem({
    required String productId,
    required String name,
    required int price,
    required int qty,
    required int stock,
    /// Ditandai saat checkout ditolak karena stok tidak cukup.
    @Default(false) bool outOfStock,
  }) = _CartItem;

  int get lineTotal => price * qty;
}

@freezed
abstract class Cart with _$Cart {
  const Cart._();
  const factory Cart({
    @Default(<CartItem>[]) List<CartItem> items,
    @Default(TaxSettings()) TaxSettings tax,
    @Default('Dine in') String orderType,
  }) = _Cart;

  bool get isEmpty => items.isEmpty;
  int get itemCount => items.fold(0, (s, i) => s + i.qty);
  int get subtotal => items.fold(0, (s, i) => s + i.lineTotal);
  TaxResult get totals => calculateTax(subtotal, tax);
  int get total => totals.total;

  /// Null saat pajak nonaktif: baris pajak disembunyikan.
  String? get taxLabel =>
      tax.enabled ? formatTaxLabel(tax.name, tax.rateBp, inclusive: tax.inclusive) : null;
  int qtyOf(String productId) =>
      items.where((i) => i.productId == productId).fold(0, (s, i) => s + i.qty);
}

@freezed
abstract class TransactionItemView with _$TransactionItemView {
  const TransactionItemView._();
  const factory TransactionItemView({
    required String productId,
    required String name,
    required int price,
    required int qty,
  }) = _TransactionItemView;

  int get lineTotal => price * qty;
}

@freezed
abstract class TransactionView with _$TransactionView {
  const TransactionView._();
  const factory TransactionView({
    required String id,
    required String receiptNo,
    required DateTime createdAt,
    required PaymentMethod method,
    required String orderType,
    required List<TransactionItemView> items,
    required int subtotal,
    required String taxName,
    required int taxRateBp,
    required bool taxInclusive,
    required int taxAmount,
    required int total,
    required int received,
    @Default(TransactionStatus.completed) TransactionStatus status,
    String? voidReason,
  }) = _TransactionView;

  int get change => received - total;
  int get itemCount => items.fold(0, (s, i) => s + i.qty);
  bool get isVoid => status == TransactionStatus.voided;
  String? get taxLabel => formatTaxLabel(taxName, taxRateBp, inclusive: taxInclusive);
}

@freezed
abstract class StockMovementView with _$StockMovementView {
  const factory StockMovementView({
    required String id,
    required String productId,
    required StockMovementType type,
    required int qtyChange,
    required int stockAfter,
    required DateTime createdAt,
    String? note,
  }) = _StockMovementView;
}

@freezed
abstract class StoreSettings with _$StoreSettings {
  const factory StoreSettings({
    @Default(false) bool setupDone,
    @Default('') String storeName,
    @Default('') String address,
    @Default('') String phone,
    @Default('') String receiptHeader,
    @Default('Terima kasih atas kunjungan Anda') String receiptFooter,
    String? logoPath,
    @Default('INV') String receiptPrefix,
    /// true: nomor struk mulai dari 1 setiap hari (INV-261121-0001).
    @Default(true) bool dailyReset,
    @Default(TaxSettings()) TaxSettings tax,
    @Default(PaperWidth.mm58) PaperWidth paper,
    String? printerAddress,
    String? printerName,
    @Default('Pengguna') String userName,
    String? userPhotoPath,
  }) = _StoreSettings;
}

/// Satu baris struk yang sudah dipotong sesuai lebar kertas.
/// Preview dan printer membaca daftar yang sama, jadi hasilnya identik.
@freezed
abstract class ReceiptLine with _$ReceiptLine {
  const factory ReceiptLine(String text, {@Default(false) bool bold}) = _ReceiptLine;
}

enum ExpensePaymentSource {
  cash('cash', 'Tunai (Laci)'),
  nonCash('non_cash', 'Non-tunai');

  const ExpensePaymentSource(this.dbValue, this.label);
  final String dbValue;
  final String label;

  static ExpensePaymentSource fromDb(String v) =>
      values.firstWhere((s) => s.dbValue == v, orElse: () => ExpensePaymentSource.cash);
}

const expenseCategoryPresets = [
  'Bahan baku',
  'Logistik',
  'Operasional',
  'Kemasan',
  'Lainnya',
];

@freezed
abstract class ExpenseView with _$ExpenseView {
  const factory ExpenseView({
    required String id,
    required String category,
    required int amount,
    required ExpensePaymentSource source,
    required DateTime createdAt,
    String? item,
    String? note,
  }) = _ExpenseView;
}
