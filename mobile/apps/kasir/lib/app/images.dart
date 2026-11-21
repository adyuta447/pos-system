import 'dart:io';

import 'package:image_picker/image_picker.dart';
import 'package:material_ui/material_ui.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pos_data/pos_data.dart';

/// Pilih gambar dari galeri dan salin ke folder app, supaya tetap ada walau file asli dihapus.
/// Null bila dibatalkan.
Future<String?> pickAndStoreImage({double maxWidth = 1024}) async {
  final picked = await ImagePicker().pickImage(source: ImageSource.gallery, maxWidth: maxWidth);
  if (picked == null) return null;
  final dir = Directory('${(await getApplicationDocumentsDirectory()).path}/images');
  await dir.create(recursive: true);
  final ext = picked.path.contains('.')
      ? picked.path.substring(picked.path.lastIndexOf('.'))
      : '.jpg';
  final saved = await File(picked.path).copy('${dir.path}/${newId()}$ext');
  return saved.path;
}

ImageProvider? fileImage(String? path) => path == null ? null : FileImage(File(path));
