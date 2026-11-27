import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';

import '../features/kasir/kasir_page.dart';
import '../features/kasir/payment_page.dart';
import '../features/pengaturan/pengaturan_page.dart';
import '../features/pengeluaran/pengeluaran_page.dart';
import '../features/produk/produk_page.dart';
import '../features/riwayat/riwayat_page.dart';
import '../features/setup/setup_page.dart';
import 'home_shell.dart';
import 'providers.dart';

final routerProvider = Provider<GoRouter>((ref) {
  // Router dibuat sekali; perubahan setupDone hanya memicu redirect ulang.
  final setupDone = ValueNotifier<bool?>(ref.read(settingsProvider).value?.setupDone);
  ref
    ..listen(settingsProvider, (_, next) => setupDone.value = next.value?.setupDone)
    ..onDispose(setupDone.dispose);

  final router = GoRouter(
    initialLocation: '/kasir',
    refreshListenable: setupDone,
    redirect: (_, state) {
      final done = setupDone.value;
      final atSetup = state.matchedLocation == '/setup';
      if (done == false && !atSetup) return '/setup';
      if (done == true && atSetup) return '/kasir';
      return null;
    },
    routes: [
      GoRoute(path: '/setup', builder: (_, _) => const SetupPage()),
      GoRoute(path: '/bayar', builder: (_, _) => const PaymentPage()),
      StatefulShellRoute.indexedStack(
        builder: (_, _, shell) => HomeShell(shell: shell),
        branches: [
          StatefulShellBranch(
            routes: [GoRoute(path: '/kasir', builder: (_, _) => const KasirPage())],
          ),
          StatefulShellBranch(
            routes: [GoRoute(path: '/riwayat', builder: (_, _) => const RiwayatPage())],
          ),
          StatefulShellBranch(
            routes: [GoRoute(path: '/pengeluaran', builder: (_, _) => const PengeluaranPage())],
          ),
          StatefulShellBranch(
            routes: [GoRoute(path: '/produk', builder: (_, _) => const ProdukPage())],
          ),
          StatefulShellBranch(
            routes: [GoRoute(path: '/pengaturan', builder: (_, _) => const PengaturanPage())],
          ),
        ],
      ),
    ],
  );
  ref.onDispose(router.dispose);
  return router;
});
