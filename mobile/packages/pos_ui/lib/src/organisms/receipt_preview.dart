import 'dart:math' as math;

import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';

import '../tokens/pos_colors.dart';

/// Struk dengan font monospace dari baris yang sama dengan yang dikirim ke printer,
/// jadi lebarnya ([chars] karakter) dan pemotongan barisnya sama dengan hasil cetak.
class ReceiptPreview extends StatelessWidget {
  const ReceiptPreview({super.key, required this.lines, required this.chars, this.logo});
  final List<ReceiptLine> lines;
  final int chars;
  final ImageProvider? logo;

  static const _pad = 16.0;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, c) {
        const base = TextStyle(
          fontFamily: 'monospace',
          fontFamilyFallback: ['Menlo', 'Courier New', 'Courier'],
          fontSize: 10,
          height: 1.35,
          letterSpacing: 0, // tema Material menambah letterSpacing; struk harus pas per karakter
          color: PosColors.ink,
        );
        // Ukur lebar karakter font monospace di perangkat ini (bisa beda per Android).
        final probe = TextPainter(
          text: TextSpan(text: 'M' * chars, style: base),
          textDirection: TextDirection.ltr,
        )..layout();
        final ratio = probe.width / (chars * 10);
        probe.dispose();
        final fontSize = math.min(13.0, (c.maxWidth - 2 * _pad - 8) / (chars * ratio));
        // +1: sisa pembulatan subpixel supaya baris penuh tidak terpotong.
        final paperWidth = chars * fontSize * ratio + 2 * _pad + 1;
        final style = base.copyWith(fontSize: fontSize);
        return SingleChildScrollView(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Center(
            child: Container(
              width: paperWidth,
              padding: const EdgeInsets.all(_pad),
              decoration: BoxDecoration(
                color: PosColors.surface,
                borderRadius: BorderRadius.circular(4),
                boxShadow: const [
                  BoxShadow(color: Color(0x1F000000), blurRadius: 8, offset: Offset(0, 2)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (logo case final image?)
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: ColorFiltered(
                          // Printer thermal hanya hitam putih.
                          colorFilter: const ColorFilter.matrix([
                            0.299, 0.587, 0.114, 0, 0, //
                            0.299, 0.587, 0.114, 0, 0,
                            0.299, 0.587, 0.114, 0, 0,
                            0, 0, 0, 1, 0,
                          ]),
                          child: Image(
                            image: image,
                            width: (paperWidth - 2 * _pad) / 2,
                            height: 64,
                            fit: BoxFit.contain,
                            errorBuilder: (_, _, _) => const SizedBox.shrink(),
                          ),
                        ),
                      ),
                    ),
                  for (final l in lines)
                    Text(
                      l.text,
                      maxLines: 1,
                      softWrap: false,
                      overflow: TextOverflow.clip,
                      style: l.bold ? style.copyWith(fontWeight: FontWeight.w700) : style,
                    ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
