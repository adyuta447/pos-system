import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';

import 'tables.dart';

part 'database.g.dart';

@DriftDatabase(
  tables: [
    StoreSettingsTable,
    Users,
    Categories,
    Products,
    StockMovements,
    Transactions,
    TransactionItems,
  ],
)
class PosDatabase extends _$PosDatabase {
  /// Tanpa [executor]: file SQLite `pos` di perangkat. Test memakai NativeDatabase.memory().
  PosDatabase([QueryExecutor? executor]) : super(executor ?? driftDatabase(name: 'pos'));

  /// Naikkan setiap ada perubahan skema, tambah langkah di [migration], dan uji sebelum rilis.
  @override
  int get schemaVersion => 1;

  @override
  MigrationStrategy get migration => MigrationStrategy(
    onCreate: (m) => m.createAll(),
    beforeOpen: (_) => customStatement('PRAGMA foreign_keys = ON'),
  );
}
