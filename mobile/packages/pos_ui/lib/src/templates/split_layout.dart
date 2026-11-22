import 'package:material_ui/material_ui.dart';

import '../tokens/pos_breakpoints.dart';

/// [header] di atas; [left] mengisi sisa lebar, [right] panel samping selebar [PosBreakpoints.sidePanel].
class SplitLayout extends StatelessWidget {
  const SplitLayout({super.key, this.header, required this.left, required this.right});
  final Widget? header;
  final Widget left;
  final Widget right;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (header case final h?) ...[h, const Divider()],
        Expanded(
          child: Row(
            children: [
              Expanded(child: left),
              const VerticalDivider(width: 1),
              SizedBox(width: PosBreakpoints.sidePanel(context), child: right),
            ],
          ),
        ),
      ],
    );
  }
}
