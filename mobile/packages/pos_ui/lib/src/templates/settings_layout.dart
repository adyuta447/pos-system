import 'package:material_ui/material_ui.dart';

import '../molecules/pos_segmented.dart';
import 'split_layout.dart';

/// Tab pengaturan di atas form, dan panel preview di kanan.
class SettingsLayout extends StatelessWidget {
  const SettingsLayout({
    super.key,
    this.header,
    required this.tabs,
    required this.selected,
    required this.onTab,
    required this.body,
    required this.preview,
  });
  final Widget? header;
  final List<String> tabs;
  final int selected;
  final ValueChanged<int> onTab;
  final Widget body;
  final Widget preview;

  @override
  Widget build(BuildContext context) {
    return SplitLayout(
      header: header,
      left: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 480),
              child: PosSegmented(labels: tabs, selected: selected, onChanged: onTab),
            ),
          ),
          Expanded(child: body),
        ],
      ),
      right: preview,
    );
  }
}
