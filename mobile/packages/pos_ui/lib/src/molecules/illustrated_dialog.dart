import 'package:flutter_svg/flutter_svg.dart';
import 'package:material_ui/material_ui.dart';

import '../tokens/pos_colors.dart';
import '../tokens/pos_text.dart';

/// Ilustrasi unDraw yang dibundel di pos_ui.
enum PosIllustration {
  paymentSuccess('payment_success'),
  paymentQris('payment_qris'),
  historyEmpty('history_empty'),
  warning('product_delete');

  const PosIllustration(this.file);
  final String file;
}

class PosIllustrationImage extends StatelessWidget {
  const PosIllustrationImage(this.illustration, {super.key, this.height = 130});
  final PosIllustration illustration;
  final double height;

  @override
  Widget build(BuildContext context) => SvgPicture.asset(
    'assets/illustrations/${illustration.file}.svg',
    package: 'pos_ui',
    height: height,
    excludeFromSemantics: true,
  );
}

/// Dialog dengan ilustrasi di atas, judul, isi, dan tombol aksi berjajar.
class IllustratedDialog extends StatelessWidget {
  const IllustratedDialog({
    super.key,
    required this.illustration,
    required this.title,
    required this.body,
    required this.actions,
  });
  final PosIllustration illustration;
  final String title;
  final Widget body;
  final List<Widget> actions;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 440),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              PosIllustrationImage(illustration),
              const SizedBox(height: 20),
              Text(title, textAlign: TextAlign.center, style: PosText.dialogTitle),
              const SizedBox(height: 8),
              DefaultTextStyle.merge(
                textAlign: TextAlign.center,
                style: PosText.body.copyWith(fontSize: 15, color: PosColors.muted, height: 1.5),
                child: body,
              ),
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
