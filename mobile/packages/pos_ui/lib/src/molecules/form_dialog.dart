import 'package:material_ui/material_ui.dart';

import '../tokens/pos_text.dart';

/// Dialog form: judul, [body] (field), dan tombol aksi berjajar di bawah.
class PosFormDialog extends StatelessWidget {
  const PosFormDialog({
    super.key,
    required this.title,
    required this.body,
    required this.actions,
    this.maxWidth = 480,
  });
  final String title;
  final Widget body;
  final List<Widget> actions;
  final double maxWidth;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: PosText.dialogTitle),
              const SizedBox(height: 20),
              body,
              const SizedBox(height: 24),
              Row(
                children: [
                  for (final (i, action) in actions.indexed) ...[
                    if (i > 0) const SizedBox(width: 12),
                    Expanded(child: action),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
