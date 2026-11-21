import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';

import 'summary_row.dart';

/// Subtotal, pajak (disembunyikan bila [taxLabel] null), dan total.
class TotalsSummary extends StatelessWidget {
  const TotalsSummary({
    super.key,
    required this.subtotal,
    required this.taxLabel,
    required this.tax,
    required this.total,
  });
  final int subtotal;
  final String? taxLabel;
  final int tax;
  final int total;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SummaryRow('Subtotal', formatRupiah(subtotal)),
        if (taxLabel case final label?) ...[
          const SizedBox(height: 8),
          SummaryRow(label, formatRupiah(tax)),
        ],
        const Padding(padding: EdgeInsets.symmetric(vertical: 12), child: Divider()),
        SummaryRow('Total', formatRupiah(total), strong: true),
      ],
    );
  }
}
