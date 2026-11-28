import 'package:material_ui/material_ui.dart';

/// Daftar isian yang bisa digulir dan sadar keyboard: area gulir menyusut di atas
/// keyboard (halaman memakai resizeToAvoidBottomInset: false), jadi isian yang
/// sedang diketik otomatis digulir ke atas keyboard. Geser daftar untuk menutup keyboard.
class FormScrollView extends StatelessWidget {
  final EdgeInsets padding;
  final List<Widget> children;
  const FormScrollView({
    super.key,
    this.padding = const EdgeInsets.all(24),
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(context).bottom),
      child: ListView(
        padding: padding,
        keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
        children: children,
      ),
    );
  }
}
