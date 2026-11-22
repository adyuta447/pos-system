import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';

import 'providers.dart';

/// Menampilkan [child] hanya bila pengguna punya [permission].
class PermissionGate extends ConsumerWidget {
  const PermissionGate({super.key, required this.permission, required this.child, this.fallback});
  final Permission permission;
  final Widget child;
  final Widget? fallback;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final allowed = ref.watch(permissionsProvider.select((p) => p.contains(permission)));
    return allowed ? child : fallback ?? const SizedBox.shrink();
  }
}
