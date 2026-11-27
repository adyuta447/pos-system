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
    Expenses,
  ],
)
class PosDatabase extends _$PosDatabase {
  /// Tanpa [executor]: file SQLite `pos` di perangkat. Test memakai NativeDatabase.memory().
  PosDatabase([QueryExecutor? executor])
      : super(
          executor ??
              driftDatabase(
                name: 'pos',
                web: DriftWebOptions(
                  sqlite3Wasm: Uri.parse('sqlite3.wasm'),
                  driftWorker: Uri.parse('drift_worker.js'),
                ),
              ),
        );

  /// Naikkan setiap ada perubahan skema, tambah langkah di [migration], dan uji sebelum rilis.
  @override
  int get schemaVersion => 4;

  Future<void> _ensureExpenseItemColumn() async {
    final cols = await customSelect("PRAGMA table_info('expenses')").get();
    final hasItem = cols.any((r) => r.read<String>('name') == 'item');
    if (!hasItem) {
      await customStatement('ALTER TABLE expenses ADD COLUMN item TEXT');
    }
  }

  @override
  MigrationStrategy get migration => MigrationStrategy(
    onCreate: (m) => m.createAll(),
    onUpgrade: (m, from, to) async {
      if (from < 2) {
        await m.createTable(expenses);
      }
      if (from < 4) {
        await _ensureExpenseItemColumn();
      }
    },
    beforeOpen: (_) async {
      await customStatement('PRAGMA foreign_keys = ON');
      await _ensureExpenseItemColumn();
    },
  );
}
