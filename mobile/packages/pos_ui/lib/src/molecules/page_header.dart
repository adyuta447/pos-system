import 'package:material_ui/material_ui.dart';

import '../tokens/pos_text.dart';

/// Bar judul 72dp di atas setiap halaman.
class PageHeader extends StatelessWidget {
  const PageHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.leading,
    this.trailing = const [],
  });
  final String title;
  final String? subtitle;
  final Widget? leading;
  final List<Widget> trailing;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 72,
      child: Padding(
        padding: EdgeInsets.only(left: leading == null ? 24 : 12, right: 24),
        child: Row(
          children: [
            if (leading case final w?) ...[w, const SizedBox(width: 8)],
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, maxLines: 1, overflow: TextOverflow.ellipsis, style: PosText.title),
                  if (subtitle case final s?) ...[
                    const SizedBox(height: 2),
                    Text(s, maxLines: 1, overflow: TextOverflow.ellipsis, style: PosText.subtitle),
                  ],
                ],
              ),
            ),
            for (final (i, w) in trailing.indexed) ...[
              if (i > 0) const SizedBox(width: 12) else const SizedBox(width: 16),
              w,
            ],
          ],
        ),
      ),
    );
  }
}
