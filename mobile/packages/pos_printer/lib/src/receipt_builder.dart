import 'dart:typed_data';

import 'package:esc_pos_utils_plus/esc_pos_utils_plus.dart';
import 'package:image/image.dart' as img;
import 'package:pos_core/pos_core.dart';

/// Mengubah baris [ReceiptLayout] (dan logo opsional) menjadi byte ESC/POS.
class ReceiptBuilder {
  const ReceiptBuilder({required this.paper});
  final PaperWidth paper;

  /// Lebar area cetak dalam dot (203 dpi): 58mm = 384, 80mm = 576.
  int get dots => paper == PaperWidth.mm58 ? 384 : 576;

  Future<List<int>> build(List<ReceiptLine> lines, {Uint8List? logo}) async {
    final profile = await CapabilityProfile.load();
    final g = Generator(paper == PaperWidth.mm58 ? PaperSize.mm58 : PaperSize.mm80, profile);
    final bytes = <int>[...g.reset()];
    final image = logo == null ? null : printableLogo(logo, dots);
    if (image != null) bytes.addAll(g.image(image));
    for (final l in lines) {
      bytes.addAll(g.text(_latin1(l.text), styles: PosStyles(bold: l.bold)));
    }
    bytes
      ..addAll(g.feed(3))
      ..addAll(g.cut());
    return bytes;
  }

  /// PRD: logo terlalu besar dikecilkan ke lebar kertas dan diubah ke hitam putih.
  static img.Image? printableLogo(Uint8List data, int maxWidth) {
    final decoded = img.decodeImage(data);
    if (decoded == null) return null;
    final sized = decoded.width > maxWidth ~/ 2
        ? img.copyResize(decoded, width: maxWidth ~/ 2)
        : decoded;
    return img.grayscale(sized);
  }

  /// Printer thermal murah hanya kenal code page Latin-1.
  static String _latin1(String s) => String.fromCharCodes(s.runes.map((c) => c < 256 ? c : 0x3F));
}
