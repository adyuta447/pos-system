import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';

import '../atoms/pos_badge.dart';

class WhatsappKindBadge extends StatelessWidget {
  final WhatsappKind kind;
  const WhatsappKindBadge(this.kind, {super.key});

  @override
  Widget build(BuildContext context) => PosBadge(
    kind.label,
    icon: switch (kind) {
      WhatsappKind.receipt => LucideIcons.receipt,
      WhatsappKind.broadcast => LucideIcons.megaphone,
    },
  );
}
