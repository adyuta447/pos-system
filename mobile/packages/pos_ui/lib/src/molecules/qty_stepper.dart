import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:material_ui/material_ui.dart';

import '../tokens/pos_colors.dart';
import '../tokens/pos_text.dart';
import '../tokens/pos_theme.dart';

/// Tombol - jumlah +. Callback null = tombol nonaktif.
class QtyStepper extends StatelessWidget {
  const QtyStepper({super.key, required this.qty, required this.onMinus, required this.onPlus});
  final int qty;
  final VoidCallback? onMinus;
  final VoidCallback? onPlus;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: posOutlined(8),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _StepButton(LucideIcons.minus, onMinus, 'Kurangi'),
          SizedBox(
            width: 32,
            child: Text(
              '$qty',
              textAlign: TextAlign.center,
              style: PosText.price.copyWith(fontWeight: FontWeight.w600),
            ),
          ),
          _StepButton(LucideIcons.plus, onPlus, 'Tambah'),
        ],
      ),
    );
  }
}

class _StepButton extends StatelessWidget {
  const _StepButton(this.icon, this.onTap, this.label);
  final IconData icon;
  final VoidCallback? onTap;
  final String label;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: SizedBox(
        width: 48,
        height: 44,
        child: Icon(
          icon,
          size: 18,
          semanticLabel: label,
          color: onTap == null ? const Color(0xFFBDBDBD) : PosColors.ink,
        ),
      ),
    );
  }
}
