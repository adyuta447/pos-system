import 'package:material_ui/material_ui.dart';

import '../tokens/pos_colors.dart';
import '../tokens/pos_text.dart';

class CategoryChip extends StatelessWidget {
  const CategoryChip({
    super.key,
    required this.label,
    required this.count,
    required this.selected,
    required this.onTap,
  });
  final String label;
  final int count;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final fg = selected ? Colors.white : PosColors.ink;
    return Material(
      color: selected ? PosColors.ink : PosColors.surface,
      shape: StadiumBorder(side: BorderSide(color: selected ? PosColors.ink : PosColors.line)),
      child: InkWell(
        customBorder: const StadiumBorder(),
        onTap: onTap,
        child: Container(
          constraints: const BoxConstraints(minHeight: 48),
          padding: const EdgeInsets.fromLTRB(18, 0, 12, 0),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(label, style: PosText.itemName.copyWith(color: fg)),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                decoration: BoxDecoration(
                  color: selected ? const Color(0xFF3A3A3A) : PosColors.subtle,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '$count',
                  style: PosText.label.copyWith(
                    fontSize: 12,
                    color: selected ? Colors.white : PosColors.muted,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
