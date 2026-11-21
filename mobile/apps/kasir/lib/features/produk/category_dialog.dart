import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

import '../../app/providers.dart';

/// Daftar kategori: tambah, ubah nama, aktif/nonaktif.
class CategoryDialog extends ConsumerWidget {
  const CategoryDialog({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final categories = ref.watch(categoriesProvider).value ?? const <CategoryView>[];
    final repo = ref.read(catalogRepositoryProvider);
    return PosFormDialog(
      title: 'Kategori',
      maxWidth: 440,
      body: Column(
        children: [
          if (categories.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Text('Belum ada kategori.', style: PosText.bodyMuted),
            ),
          for (final c in categories)
            Row(
              children: [
                Expanded(
                  child: Text(
                    c.name,
                    style: PosText.body.copyWith(color: c.active ? PosColors.ink : PosColors.muted),
                  ),
                ),
                IconButton(
                  tooltip: 'Ubah nama ${c.name}',
                  icon: const Icon(LucideIcons.pencil, size: 20),
                  onPressed: () => showDialog<String>(
                    context: context,
                    builder: (_) => CategoryNameDialog(category: c),
                  ),
                ),
                Switch(
                  value: c.active,
                  onChanged: (v) => repo.saveCategory(id: c.id, name: c.name, active: v),
                ),
              ],
            ),
        ],
      ),
      actions: [
        PosButton.secondary(
          label: 'Tutup',
          size: PosButtonSize.md,
          onPressed: () => Navigator.pop(context),
        ),
        PosButton.primary(
          label: 'Tambah kategori',
          size: PosButtonSize.md,
          onPressed: () =>
              showDialog<String>(context: context, builder: (_) => const CategoryNameDialog()),
        ),
      ],
    );
  }
}

/// Tambah ([category] null) atau ubah nama kategori. Pop dengan id kategori.
class CategoryNameDialog extends ConsumerStatefulWidget {
  const CategoryNameDialog({super.key, this.category});
  final CategoryView? category;

  @override
  ConsumerState<CategoryNameDialog> createState() => _CategoryNameDialogState();
}

class _CategoryNameDialogState extends ConsumerState<CategoryNameDialog> {
  final _form = GlobalKey<FormState>();
  late final _name = TextEditingController(text: widget.category?.name);
  String? _error;

  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() => _error = null);
    if (!_form.currentState!.validate()) return;
    final c = widget.category;
    try {
      final id = await ref
          .read(catalogRepositoryProvider)
          .saveCategory(id: c?.id, name: _name.text, active: c?.active ?? true);
      if (mounted) Navigator.pop(context, id);
    } on DuplicateNameException {
      setState(() => _error = 'Nama kategori sudah dipakai');
      _form.currentState!.validate();
    }
  }

  @override
  Widget build(BuildContext context) {
    return PosFormDialog(
      title: widget.category == null ? 'Kategori baru' : 'Ubah kategori',
      maxWidth: 400,
      body: Form(
        key: _form,
        child: TextFormField(
          controller: _name,
          autofocus: true,
          textCapitalization: TextCapitalization.words,
          decoration: const InputDecoration(labelText: 'Nama kategori'),
          validator: (v) => (v ?? '').trim().isEmpty ? 'Nama wajib diisi' : _error,
          onFieldSubmitted: (_) => _save(),
        ),
      ),
      actions: [
        PosButton.secondary(
          label: 'Batal',
          size: PosButtonSize.md,
          onPressed: () => Navigator.pop(context),
        ),
        PosButton.primary(label: 'Simpan', size: PosButtonSize.md, onPressed: _save),
      ],
    );
  }
}
