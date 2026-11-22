import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:material_ui/material_ui.dart';

import '../tokens/pos_colors.dart';
import '../tokens/pos_text.dart';

/// Satu tombol keypad nominal. [label] '⌫' tampil sebagai ikon hapus.
class AmountKey extends StatelessWidget {
  const AmountKey(this.label, {super.key, required this.onTap});
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: PosColors.subtle,
      borderRadius: BorderRadius.circular(10),
      child: InkWell(
        borderRadius: BorderRadius.circular(10),
        onTap: onTap,
        child: Center(
          child: label == '⌫'
              ? const Icon(
                  LucideIcons.delete,
                  size: 22,
                  color: PosColors.ink,
                  semanticLabel: 'Hapus',
                )
              : Text(label, style: PosText.title.copyWith(fontSize: 22)),
        ),
      ),
    );
  }
}
