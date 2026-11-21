import 'package:material_ui/material_ui.dart';

abstract final class PosBreakpoints {
  /// Lebar layar (dp) mulai tablet besar; di bawahnya panel samping dipersempit
  /// (contoh: Huawei BAH3 ~1000x600 dp).
  static const tablet = 1200.0;

  static bool isCompact(BuildContext context) => MediaQuery.sizeOf(context).width < tablet;

  /// Lebar panel kanan (keranjang, detail, preview).
  static double sidePanel(BuildContext context) => isCompact(context) ? 320 : 380;
}
