import 'package:flutter/services.dart';
import 'package:material_ui/material_ui.dart';

// Brand colors, same as the Expo app's palette.
const brandRed = Color(0xFFE00000);
const brandPeach = Color(0xFFFFECCB);
const brandInk = Color(0xFF2B1408);

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // PRD: full-screen landscape cashier UI on tablets.
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);
  runApp(const KasirApp());
}

class KasirApp extends StatelessWidget {
  const KasirApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aplikasi Kasir',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: .fromSeed(
          seedColor: brandRed,
          primary: brandRed,
          surface: brandPeach,
          onSurface: brandInk,
        ),
        scaffoldBackgroundColor: brandPeach,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Kasir'),
        backgroundColor: brandRed,
        foregroundColor: Colors.white,
      ),
      body: const Center(child: Text('Template app kasir siap.')),
    );
  }
}
