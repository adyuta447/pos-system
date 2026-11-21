import 'package:material_ui/material_ui.dart';

import 'pos_colors.dart';

abstract final class PosText {
  static const family = 'Inter';
  static const package = 'pos_ui';

  static const _base = TextStyle(fontFamily: family, package: package, color: PosColors.ink);

  static final heading = _base.copyWith(fontSize: 16, fontWeight: FontWeight.w600);
  static final title = _base.copyWith(fontSize: 18, fontWeight: FontWeight.w600);
  static final subtitle = _base.copyWith(fontSize: 13, color: PosColors.muted);
  static final body = _base.copyWith(fontSize: 14);
  static final bodyStrong = _base.copyWith(fontSize: 14, fontWeight: FontWeight.w600);
  static final bodyMuted = _base.copyWith(fontSize: 14, color: PosColors.muted);
  static final label = _base.copyWith(
    fontSize: 12.5,
    color: PosColors.muted,
    fontWeight: FontWeight.w500,
  );
  static final caption = _base.copyWith(fontSize: 12.5, color: PosColors.muted);
  static final itemName = _base.copyWith(fontSize: 15, fontWeight: FontWeight.w500, height: 1.3);
  static final price = _base.copyWith(fontSize: 15, fontWeight: FontWeight.w700);
  static final button = _base.copyWith(fontSize: 16, fontWeight: FontWeight.w600);

  /// PRD: angka total minimal 28sp.
  static final total = _base.copyWith(fontSize: 28, fontWeight: FontWeight.w700);
  static final totalLabel = _base.copyWith(fontSize: 17, fontWeight: FontWeight.w600);
  static final dialogTitle = _base.copyWith(fontSize: 20, fontWeight: FontWeight.w700);
  static final amount = _base.copyWith(fontSize: 32, fontWeight: FontWeight.w700);
}
