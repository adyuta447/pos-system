import 'package:material_ui/material_ui.dart';

import '../tokens/pos_colors.dart';
import '../tokens/pos_text.dart';

/// Foto pengguna, atau inisial nama bila belum ada foto.
class PosAvatar extends StatelessWidget {
  const PosAvatar({super.key, required this.name, this.image, this.radius = 16});
  final String name;
  final ImageProvider? image;
  final double radius;

  static String initials(String name) {
    final words = name.trim().split(RegExp(r'\s+')).where((w) => w.isNotEmpty);
    return words.take(2).map((w) => w[0].toUpperCase()).join();
  }

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: radius,
      backgroundColor: PosColors.avatarBg,
      backgroundImage: image,
      child: image != null
          ? null
          : Text(
              initials(name),
              style: PosText.bodyStrong.copyWith(fontSize: radius * 0.7, color: PosColors.avatarFg),
            ),
    );
  }
}
