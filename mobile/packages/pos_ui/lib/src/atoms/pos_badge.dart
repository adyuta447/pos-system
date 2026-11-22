import 'package:material_ui/material_ui.dart';

import '../tokens/pos_colors.dart';
import '../tokens/pos_text.dart';
import '../tokens/pos_theme.dart';

enum PosBadgeTone { neutral, success, warning, danger }

class PosBadge extends StatelessWidget {
  const PosBadge(this.label, {super.key, this.tone = PosBadgeTone.neutral});
  final String label;
  final PosBadgeTone tone;

  @override
  Widget build(BuildContext context) {
    final (fg, bg) = switch (tone) {
      PosBadgeTone.neutral => (PosColors.ink, null),
      PosBadgeTone.success => (PosColors.green, PosColors.greenBg),
      PosBadgeTone.warning => (PosColors.amber, PosColors.amberBg),
      PosBadgeTone.danger => (PosColors.red, PosColors.redBg),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: bg == null
          ? posOutlined(6)
          : BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
      child: Text(
        label,
        maxLines: 1,
        style: PosText.caption.copyWith(
          fontSize: 12,
          color: fg,
          fontWeight: bg == null ? FontWeight.w500 : FontWeight.w600,
        ),
      ),
    );
  }
}
