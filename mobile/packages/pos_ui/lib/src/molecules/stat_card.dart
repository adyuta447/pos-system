import 'package:material_ui/material_ui.dart';

import '../tokens/pos_text.dart';
import '../tokens/pos_theme.dart';

class StatCard extends StatelessWidget {
  const StatCard({super.key, required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: posOutlined(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: PosText.subtitle),
          const SizedBox(height: 6),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(value, style: PosText.title.copyWith(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }
}
