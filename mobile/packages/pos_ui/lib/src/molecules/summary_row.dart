import 'package:material_ui/material_ui.dart';

import '../tokens/pos_text.dart';

/// Label kiri, nilai kanan. [strong] untuk baris Total (angka 28sp).
class SummaryRow extends StatelessWidget {
  const SummaryRow(this.label, this.value, {super.key, this.strong = false, this.valueColor});
  final String label;
  final String value;
  final bool strong;
  final Color? valueColor;

  @override
  Widget build(BuildContext context) {
    final valueStyle = strong ? PosText.total : PosText.body.copyWith(fontWeight: FontWeight.w500);
    return Row(
      children: [
        Expanded(
          child: Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: strong ? PosText.totalLabel : PosText.bodyMuted,
          ),
        ),
        const SizedBox(width: 12),
        Text(value, style: valueStyle.copyWith(color: valueColor)),
      ],
    );
  }
}
