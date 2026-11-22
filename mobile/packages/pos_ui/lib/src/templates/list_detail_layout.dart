import 'package:material_ui/material_ui.dart';

import 'split_layout.dart';

/// Daftar di kiri, detail item terpilih di kanan (riwayat, produk).
class ListDetailLayout extends SplitLayout {
  const ListDetailLayout({super.key, super.header, required Widget list, required Widget detail})
    : super(left: list, right: detail);
}
