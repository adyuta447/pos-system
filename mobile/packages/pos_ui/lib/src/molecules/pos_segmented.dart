import 'package:material_ui/material_ui.dart';

import '../tokens/pos_colors.dart';
import '../tokens/pos_text.dart';

/// Pilihan tunggal bergaya pill, contoh Dine in / Take away / Delivery.
class PosSegmented extends StatelessWidget {
  const PosSegmented({
    super.key,
    required this.labels,
    required this.selected,
    required this.onChanged,
  });
  final List<String> labels;
  final int selected;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(color: PosColors.subtle, borderRadius: BorderRadius.circular(10)),
      child: Row(
        children: [
          for (final (i, label) in labels.indexed)
            Expanded(
              child: Semantics(
                button: true,
                selected: i == selected,
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => onChanged(i),
                  child: Container(
                    height: 40,
                    alignment: Alignment.center,
                    decoration: i == selected
                        ? BoxDecoration(
                            color: PosColors.surface,
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: const [
                              BoxShadow(
                                color: Color(0x14000000),
                                blurRadius: 3,
                                offset: Offset(0, 1),
                              ),
                            ],
                          )
                        : null,
                    child: Text(
                      label,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: PosText.body.copyWith(
                        fontWeight: FontWeight.w500,
                        color: i == selected ? PosColors.ink : PosColors.muted,
                      ),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
