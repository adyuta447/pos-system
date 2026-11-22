import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

import 'images.dart';
import 'providers.dart';
import 'receipt_printer.dart';

/// Sidebar plus halaman terpilih; tiap halaman menyimpan state-nya saat berpindah.
class HomeShell extends ConsumerStatefulWidget {
  const HomeShell({super.key, required this.shell});
  final StatefulNavigationShell shell;

  @override
  ConsumerState<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends ConsumerState<HomeShell> {
  @override
  void initState() {
    super.initState();
    ref.read(receiptPrinterProvider).autoConnect();
  }

  @override
  Widget build(BuildContext context) {
    final s = ref.watch(settingsProvider).value ?? const StoreSettings();
    return Scaffold(
      resizeToAvoidBottomInset: false, // keyboard menimpa layout; dialog menyesuaikan sendiri
      body: SafeArea(
        child: Row(
          children: [
            PosSidebar(
              items: const [
                PosNavItem(LucideIcons.shoppingCart, 'Kasir'),
                PosNavItem(LucideIcons.history, 'Riwayat'),
                PosNavItem(LucideIcons.package, 'Produk'),
              ],
              bottomItems: const [PosNavItem(LucideIcons.settings, 'Pengaturan')],
              selected: widget.shell.currentIndex,
              onSelect: (i) =>
                  widget.shell.goBranch(i, initialLocation: i == widget.shell.currentIndex),
              footer: PosAvatar(name: s.userName, image: fileImage(s.userPhotoPath)),
            ),
            const VerticalDivider(width: 1),
            Expanded(child: widget.shell),
          ],
        ),
      ),
    );
  }
}
