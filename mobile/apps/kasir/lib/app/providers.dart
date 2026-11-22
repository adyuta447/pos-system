import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_data/pos_data.dart';
import 'package:pos_printer/pos_printer.dart';

final databaseProvider = Provider<PosDatabase>((ref) {
  final db = PosDatabase();
  ref.onDispose(db.close);
  return db;
});

// Repository: satu-satunya titik yang diganti saat sumber data pindah ke API (v1.0).
final settingsRepositoryProvider = Provider<SettingsRepository>(
  (ref) => LocalSettingsRepository(ref.watch(databaseProvider)),
);
final catalogRepositoryProvider = Provider<CatalogRepository>(
  (ref) => LocalCatalogRepository(ref.watch(databaseProvider)),
);
final transactionRepositoryProvider = Provider<TransactionRepository>(
  (ref) => LocalTransactionRepository(ref.watch(databaseProvider)),
);

final printerServiceProvider = Provider<PrinterService>((ref) => const UnavailablePrinterService());

final settingsProvider = StreamProvider<StoreSettings>(
  (ref) => ref.watch(settingsRepositoryProvider).watch(),
);

/// Semua produk yang belum dihapus (aktif dan nonaktif).
final productsProvider = StreamProvider<List<ProductView>>(
  (ref) => ref.watch(catalogRepositoryProvider).watchProducts(),
);

final categoriesProvider = StreamProvider<List<CategoryView>>(
  (ref) => ref.watch(catalogRepositoryProvider).watchCategories(),
);

final transactionsByDateProvider = StreamProvider.family<List<TransactionView>, DateTime>(
  (ref, day) => ref.watch(transactionRepositoryProvider).watchByDate(day),
);

final movementsProvider = StreamProvider.family<List<StockMovementView>, String>(
  (ref, productId) => ref.watch(catalogRepositoryProvider).watchMovements(productId),
);

/// Pre-launch: satu pengguna dengan akses penuh. v1.2: mapping role ke daftar permission.
final permissionsProvider = Provider<Set<Permission>>((ref) => Permission.values.toSet());
