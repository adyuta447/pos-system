import 'package:material_ui/material_ui.dart';

import '../tokens/pos_colors.dart';
import '../tokens/pos_text.dart';

/// Kolom tabel. [width] null = mengisi sisa ruang.
class PosColumn {
  const PosColumn(this.label, {this.width, this.alignEnd = false});
  final String label;
  final double? width;
  final bool alignEnd;
}

class PosRow {
  const PosRow({required this.cells, this.onTap, this.selected = false});
  final List<Widget> cells;
  final VoidCallback? onTap;
  final bool selected;
}

/// Tabel dengan header dan baris yang dibangun lazily.
class DataTableCard extends StatelessWidget {
  const DataTableCard({
    super.key,
    required this.columns,
    required this.rowCount,
    required this.rowBuilder,
    this.empty,
  });
  final List<PosColumn> columns;
  final int rowCount;
  final PosRow Function(int index) rowBuilder;
  final Widget? empty;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: _Cells(
            columns: columns,
            cells: [for (final c in columns) Text(c.label, maxLines: 1, style: PosText.label)],
          ),
        ),
        const Divider(),
        Expanded(
          child: rowCount == 0 && empty != null
              ? empty!
              : ListView.separated(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  itemCount: rowCount,
                  separatorBuilder: (_, _) => const SizedBox(height: 2),
                  itemBuilder: (_, i) => _TableRow(columns: columns, row: rowBuilder(i)),
                ),
        ),
      ],
    );
  }
}

class _TableRow extends StatelessWidget {
  const _TableRow({required this.columns, required this.row});
  final List<PosColumn> columns;
  final PosRow row;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: row.selected ? PosColors.subtle : PosColors.surface,
      borderRadius: BorderRadius.circular(10),
      child: InkWell(
        borderRadius: BorderRadius.circular(10),
        onTap: row.onTap,
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 52),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            child: DefaultTextStyle.merge(
              style: PosText.body,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              child: _Cells(columns: columns, cells: row.cells),
            ),
          ),
        ),
      ),
    );
  }
}

class _Cells extends StatelessWidget {
  const _Cells({required this.columns, required this.cells});
  final List<PosColumn> columns;
  final List<Widget> cells;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        for (final (i, c) in columns.indexed)
          if (c.width case final w?)
            SizedBox(
              width: w,
              child: Align(
                alignment: c.alignEnd ? Alignment.centerRight : Alignment.centerLeft,
                child: cells[i],
              ),
            )
          else
            Expanded(
              child: Align(
                alignment: c.alignEnd ? Alignment.centerRight : Alignment.centerLeft,
                child: cells[i],
              ),
            ),
      ],
    );
  }
}
