import 'package:drift/drift.dart';

/// PRD: setiap tabel punya created_at, updated_at, deleted_at (soft delete), synced_at
/// (null selama pre-launch). Primary key UUID v7 string.
mixin SyncColumns on Table {
  TextColumn get id => text()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get deletedAt => dateTime().nullable()();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

@DataClassName('SettingsRow')
class StoreSettingsTable extends Table with SyncColumns {
  @override
  String get tableName => 'store_settings';

  BoolColumn get setupDone => boolean().withDefault(const Constant(false))();
  TextColumn get storeName => text().withDefault(const Constant(''))();
  TextColumn get address => text().withDefault(const Constant(''))();
  TextColumn get phone => text().withDefault(const Constant(''))();
  TextColumn get receiptHeader => text().withDefault(const Constant(''))();
  TextColumn get receiptFooter => text().withDefault(const Constant(''))();
  TextColumn get logoPath => text().nullable()();
  TextColumn get receiptPrefix => text().withDefault(const Constant('INV'))();
  BoolColumn get dailyReset => boolean().withDefault(const Constant(true))();
  BoolColumn get taxEnabled => boolean().withDefault(const Constant(false))();
  TextColumn get taxName => text().withDefault(const Constant('PPN'))();
  IntColumn get taxRateBp => integer().withDefault(const Constant(1100))();
  BoolColumn get taxInclusive => boolean().withDefault(const Constant(false))();
  TextColumn get paper => text().withDefault(const Constant('mm58'))();
  TextColumn get printerAddress => text().nullable()();
  TextColumn get printerName => text().nullable()();
}

/// Satu pengguna default di pre-launch; kolom role disiapkan untuk v1.0.
@DataClassName('UserRow')
class Users extends Table with SyncColumns {
  TextColumn get name => text()();
  TextColumn get photoPath => text().nullable()();
  TextColumn get role => text().withDefault(const Constant('owner'))();
}

@DataClassName('CategoryRow')
class Categories extends Table with SyncColumns {
  TextColumn get name => text()();
  BoolColumn get active => boolean().withDefault(const Constant(true))();
}

@TableIndex(name: 'idx_products_name', columns: {#name})
@DataClassName('ProductRow')
class Products extends Table with SyncColumns {
  TextColumn get categoryId => text().references(Categories, #id)();
  TextColumn get name => text()();
  TextColumn get sku => text().nullable()();
  IntColumn get price => integer()();
  IntColumn get stock => integer().withDefault(const Constant(0))();
  IntColumn get minStock => integer().withDefault(const Constant(0))();
  TextColumn get photoPath => text().nullable()();
  BoolColumn get active => boolean().withDefault(const Constant(true))();
}

@DataClassName('StockMovementRow')
class StockMovements extends Table with SyncColumns {
  TextColumn get productId => text().references(Products, #id)();
  TextColumn get type => text()();
  IntColumn get qtyChange => integer()();
  IntColumn get stockAfter => integer()();
  TextColumn get note => text().nullable()();
  TextColumn get transactionId => text().nullable()();
}

@TableIndex(name: 'idx_transactions_created_at', columns: {#createdAt})
@TableIndex(name: 'idx_transactions_business_date', columns: {#businessDate})
@DataClassName('TransactionRow')
class Transactions extends Table with SyncColumns {
  TextColumn get receiptNo => text().unique()();
  /// Tanggal lokal yyyy-MM-dd, dipakai untuk nomor struk harian dan filter riwayat.
  TextColumn get businessDate => text()();
  TextColumn get orderType => text().withDefault(const Constant('Dine in'))();
  TextColumn get paymentMethod => text()();
  IntColumn get subtotal => integer()();
  TextColumn get taxName => text()();
  IntColumn get taxRateBp => integer()();
  BoolColumn get taxInclusive => boolean()();
  IntColumn get taxAmount => integer()();
  IntColumn get total => integer()();
  IntColumn get received => integer()();
  IntColumn get changeAmount => integer()();
  TextColumn get status => text().withDefault(const Constant('completed'))();
  TextColumn get voidReason => text().nullable()();
  DateTimeColumn get voidedAt => dateTime().nullable()();
}

/// Snapshot nama dan harga saat transaksi, bukan hanya product_id.
@TableIndex(name: 'idx_transaction_items_transaction_id', columns: {#transactionId})
@DataClassName('TransactionItemRow')
class TransactionItems extends Table with SyncColumns {
  TextColumn get transactionId => text().references(Transactions, #id)();
  TextColumn get productId => text().references(Products, #id)();
  TextColumn get productName => text()();
  IntColumn get price => integer()();
  IntColumn get qty => integer()();
  IntColumn get lineTotal => integer()();
}
