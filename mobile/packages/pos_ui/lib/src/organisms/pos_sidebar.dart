import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:material_ui/material_ui.dart';

import '../tokens/pos_colors.dart';
import '../tokens/pos_text.dart';

class PosNavItem {
  const PosNavItem(this.icon, this.label);
  final IconData icon;
  final String label;
}

/// Navigasi samping 88dp: logo, menu utama, lalu [bottomItems] dan [footer] di bawah.
class PosSidebar extends StatelessWidget {
  const PosSidebar({
    super.key,
    required this.items,
    this.bottomItems = const [],
    required this.selected,
    required this.onSelect,
    this.footer,
  });
  final List<PosNavItem> items;
  final List<PosNavItem> bottomItems;

  /// Index gabungan [items] lalu [bottomItems].
  final int selected;
  final ValueChanged<int> onSelect;
  final Widget? footer;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 88,
      child: Column(
        children: [
          const SizedBox(height: 16),
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: PosColors.ink,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(LucideIcons.store, color: Colors.white, size: 24),
          ),
          const SizedBox(height: 20),
          for (final (i, item) in items.indexed)
            _NavButton(item: item, active: i == selected, onTap: () => onSelect(i)),
          const Spacer(),
          for (final (i, item) in bottomItems.indexed)
            _NavButton(
              item: item,
              active: items.length + i == selected,
              onTap: () => onSelect(items.length + i),
            ),
          if (footer case final f?) ...[const SizedBox(height: 8), f],
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _NavButton extends StatelessWidget {
  const _NavButton({required this.item, required this.active, required this.onTap});
  final PosNavItem item;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = active ? Colors.white : PosColors.muted;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
      child: Material(
        color: active ? PosColors.ink : Colors.transparent,
        borderRadius: BorderRadius.circular(10),
        child: InkWell(
          borderRadius: BorderRadius.circular(10),
          onTap: onTap,
          child: Semantics(
            selected: active,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Column(
                children: [
                  Icon(item.icon, size: 22, color: color),
                  const SizedBox(height: 4),
                  Text(
                    item.label,
                    maxLines: 1,
                    overflow: TextOverflow.fade,
                    softWrap: false,
                    style: PosText.label.copyWith(fontSize: 11, color: color),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
