import 'dart:io';
import 'dart:typed_data';

Future<Uint8List?> readLogoBytes(String? logoPath) async {
  if (logoPath == null) return null;
  final file = File(logoPath);
  return file.existsSync() ? file.readAsBytes() : null;
}
