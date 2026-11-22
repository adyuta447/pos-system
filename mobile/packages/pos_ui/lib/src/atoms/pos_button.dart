import 'package:material_ui/material_ui.dart';

import '../tokens/pos_colors.dart';
import '../tokens/pos_text.dart';

enum PosButtonVariant { primary, secondary, danger, ghost }

/// Tinggi minimal 48dp (PRD: tap target).
enum PosButtonSize {
  sm(48, 14),
  md(52, 15),
  lg(56, 16);

  const PosButtonSize(this.height, this.fontSize);
  final double height;
  final double fontSize;
}

class PosButton extends StatelessWidget {
  const PosButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = PosButtonVariant.primary,
    this.size = PosButtonSize.lg,
    this.icon,
    this.expand = false,
  });

  const PosButton.primary({
    super.key,
    required this.label,
    required this.onPressed,
    this.size = PosButtonSize.lg,
    this.icon,
    this.expand = false,
  }) : variant = PosButtonVariant.primary;

  const PosButton.secondary({
    super.key,
    required this.label,
    required this.onPressed,
    this.size = PosButtonSize.lg,
    this.icon,
    this.expand = false,
  }) : variant = PosButtonVariant.secondary;

  const PosButton.danger({
    super.key,
    required this.label,
    required this.onPressed,
    this.size = PosButtonSize.lg,
    this.icon,
    this.expand = false,
  }) : variant = PosButtonVariant.danger;

  const PosButton.ghost({
    super.key,
    required this.label,
    required this.onPressed,
    this.size = PosButtonSize.lg,
    this.icon,
    this.expand = false,
  }) : variant = PosButtonVariant.ghost;

  final String label;
  final VoidCallback? onPressed;
  final PosButtonVariant variant;
  final PosButtonSize size;
  final IconData? icon;

  /// Isi lebar penuh parent.
  final bool expand;

  @override
  Widget build(BuildContext context) {
    final filled = variant == PosButtonVariant.primary || variant == PosButtonVariant.danger;
    final style = TextButton.styleFrom(
      backgroundColor: switch (variant) {
        PosButtonVariant.primary => PosColors.ink,
        PosButtonVariant.danger => PosColors.red,
        _ => Colors.transparent,
      },
      foregroundColor: filled ? Colors.white : PosColors.ink,
      disabledBackgroundColor: filled ? PosColors.disabled : Colors.transparent,
      disabledForegroundColor: filled ? Colors.white : PosColors.disabled,
      side: variant == PosButtonVariant.secondary ? const BorderSide(color: PosColors.line) : null,
      minimumSize: Size(size.height, size.height),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(size == PosButtonSize.sm ? 10 : 12),
      ),
      textStyle: PosText.button.copyWith(fontSize: size.fontSize),
    );
    final text = Text(label, maxLines: 1, overflow: TextOverflow.ellipsis);
    final button = icon == null
        ? TextButton(style: style, onPressed: onPressed, child: text)
        : TextButton.icon(
            style: style,
            onPressed: onPressed,
            icon: Icon(icon, size: 18),
            label: text,
          );
    return SizedBox(width: expand ? double.infinity : null, height: size.height, child: button);
  }
}
