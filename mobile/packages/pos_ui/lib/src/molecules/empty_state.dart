import 'package:material_ui/material_ui.dart';

import '../tokens/pos_text.dart';
import 'illustrated_dialog.dart';

class EmptyState extends StatelessWidget {
  const EmptyState({super.key, required this.title, required this.message, this.illustration});
  final String title;
  final String message;
  final PosIllustration? illustration;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (illustration case final i?) ...[
              PosIllustrationImage(i, height: 150),
              const SizedBox(height: 20),
            ],
            Text(title, textAlign: TextAlign.center, style: PosText.title),
            const SizedBox(height: 6),
            Text(message, textAlign: TextAlign.center, style: PosText.bodyMuted),
          ],
        ),
      ),
    );
  }
}
