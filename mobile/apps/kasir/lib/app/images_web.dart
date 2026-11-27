import 'dart:convert';

import 'package:image_picker/image_picker.dart';
import 'package:material_ui/material_ui.dart';

Future<String?> pickAndStoreImage({double maxWidth = 1024}) async {
  final picked = await ImagePicker().pickImage(source: ImageSource.gallery, maxWidth: maxWidth);
  if (picked == null) return null;
  final bytes = await picked.readAsBytes();
  return 'data:image/png;base64,${base64Encode(bytes)}';
}

ImageProvider? fileImage(String? path) =>
    (path != null && path.startsWith('data:')) ? NetworkImage(path) : null;
