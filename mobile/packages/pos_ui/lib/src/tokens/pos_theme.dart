import 'package:material_ui/material_ui.dart';

import 'pos_colors.dart';
import 'pos_spacing.dart';
import 'pos_text.dart';

ThemeData posTheme() => ThemeData(
  fontFamily: 'packages/${PosText.package}/${PosText.family}',
  colorScheme: ColorScheme.fromSeed(
    seedColor: PosColors.ink,
    primary: PosColors.ink,
    surface: PosColors.surface,
    onSurface: PosColors.ink,
    error: PosColors.red,
  ),
  scaffoldBackgroundColor: PosColors.surface,
  dividerTheme: const DividerThemeData(color: PosColors.line, space: 1, thickness: 1),
  snackBarTheme: const SnackBarThemeData(behavior: SnackBarBehavior.floating),
  dialogTheme: DialogThemeData(
    backgroundColor: PosColors.surface,
    surfaceTintColor: PosColors.surface,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(PosRadius.xl)),
  ),
  inputDecorationTheme: InputDecorationTheme(
    labelStyle: const TextStyle(color: PosColors.muted),
    floatingLabelStyle: const TextStyle(color: PosColors.ink),
    hintStyle: const TextStyle(color: PosColors.muted, fontSize: 14),
    enabledBorder: _border(PosColors.line),
    focusedBorder: _border(PosColors.ink),
    errorBorder: _border(PosColors.red),
    focusedErrorBorder: _border(PosColors.red),
    disabledBorder: _border(PosColors.line),
  ),
  switchTheme: SwitchThemeData(
    trackColor: WidgetStateProperty.resolveWith(
      (s) => s.contains(WidgetState.selected) ? PosColors.ink : PosColors.subtle,
    ),
  ),
);

OutlineInputBorder _border(Color c) => OutlineInputBorder(
  borderRadius: BorderRadius.circular(PosRadius.md),
  borderSide: BorderSide(color: c),
);

/// Kotak putih dengan garis tipis, dipakai kartu, tombol ikon, dan input.
BoxDecoration posOutlined([double radius = PosRadius.md]) => BoxDecoration(
  color: PosColors.surface,
  border: Border.all(color: PosColors.line),
  borderRadius: BorderRadius.circular(radius),
);
