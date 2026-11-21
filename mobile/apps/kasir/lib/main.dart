import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_ui/pos_ui.dart';

import 'app/providers.dart';
import 'app/receipt_printer.dart';
import 'app/router.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // PRD: layar kasir landscape penuh di tablet.
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);
  runApp(const ProviderScope(child: KasirApp()));
}

class KasirApp extends ConsumerWidget {
  const KasirApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Tunggu pengaturan pertama supaya redirect setup tidak berkedip.
    final ready = ref.watch(settingsProvider.select((s) => s.hasValue));
    if (!ready) {
      return MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: posTheme(),
        home: const Scaffold(body: Center(child: CircularProgressIndicator())),
      );
    }
    return MaterialApp.router(
      title: 'Kasir',
      debugShowCheckedModeBanner: false,
      theme: posTheme(),
      scaffoldMessengerKey: messengerKey,
      routerConfig: ref.watch(routerProvider),
    );
  }
}
