import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

import '../../app/format.dart';
import '../../app/images.dart';
import '../../app/providers.dart';
import 'category_dialog.dart';

final _digits = FilteringTextInputFormatter.digitsOnly;

/// Tambah ([product] null) atau edit produk. Pop dengan id produk setelah tersimpan.
class ProductForm extends ConsumerStatefulWidget {
  const ProductForm({super.key, this.product});
  final ProductView? product;

  @override
  ConsumerState<ProductForm> createState() => _ProductFormState();
}

class _ProductFormState extends ConsumerState<ProductForm> {
  final _form = GlobalKey<FormState>();
  late final _p = widget.product;
  late final _name = TextEditingController(text: _p?.name);
  late final _price = TextEditingController(text: _p != null ? formatThousands(_p.price) : null);
  late final _sku = TextEditingController(text: _p?.sku);
  late final _stock = TextEditingController(text: _p?.stock.toString() ?? '0');
  late final _minStock = TextEditingController(text: _p?.minStock.toString() ?? '5');
  late String? _categoryId = _p?.categoryId;
  late String? _photo = _p?.photoPath;
  String? _nameError;
  var _saving = false;

  @override
  void dispose() {
    for (final c in [_name, _price, _sku, _stock, _minStock]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _save() async {
    setState(() => _nameError = null);
    if (!_form.currentState!.validate()) return;
    setState(() => _saving = true);
    final isNew = _p == null;
    final draft = (_p ?? ProductView(id: '', name: '', price: 0, categoryId: '')).copyWith(
      name: _name.text.trim(),
      price: parseFormattedInt(_price.text) ?? 0,
      categoryId: _categoryId!,
      sku: _sku.text.trim().isEmpty ? null : _sku.text.trim(),
      stock: isNew ? int.parse(_stock.text) : _p.stock,
      minStock: int.parse(_minStock.text),
      photoPath: _photo,
    );
    try {
      final id = await ref.read(catalogRepositoryProvider).saveProduct(draft, isNew: isNew);
      if (mounted) Navigator.pop(context, id);
    } on DuplicateNameException {
      setState(() => _nameError = 'Nama sudah dipakai produk lain');
      _form.currentState!.validate();
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _pickPhoto() async {
    final path = await pickAndStoreImage(maxWidth: 512);
    if (path != null) setState(() => _photo = path);
  }

  @override
  Widget build(BuildContext context) {
    final categories = (ref.watch(categoriesProvider).value ?? const <CategoryView>[])
        .where((c) => c.active || c.id == _categoryId)
        .toList();
    final isNew = _p == null;
    return PosFormDialog(
      title: isNew ? 'Tambah produk' : 'Edit produk',
      body: Form(
        key: _form,
        child: Column(
          spacing: 16,
          children: [
            TextFormField(
              controller: _name,
              autofocus: isNew,
              textCapitalization: TextCapitalization.words,
              decoration: const InputDecoration(labelText: 'Nama produk'),
              validator: (v) => (v ?? '').trim().isEmpty ? 'Nama wajib diisi' : _nameError,
            ),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 12,
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    initialValue: categories.any((c) => c.id == _categoryId) ? _categoryId : null,
                    decoration: const InputDecoration(labelText: 'Kategori'),
                    dropdownColor: PosColors.surface,
                    items: [
                      for (final c in categories)
                        DropdownMenuItem(value: c.id, child: Text(c.name)),
                    ],
                    onChanged: (c) => setState(() => _categoryId = c),
                    validator: (v) => v == null ? 'Pilih kategori' : null,
                  ),
                ),
                PosButton.secondary(
                  label: 'Baru',
                  icon: LucideIcons.plus,
                  size: PosButtonSize.sm,
                  onPressed: () async {
                    final id = await showDialog<String>(
                      context: context,
                      builder: (_) => const CategoryNameDialog(),
                    );
                    if (id != null) setState(() => _categoryId = id);
                  },
                ),
              ],
            ),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 12,
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _price,
                    keyboardType: TextInputType.number,
                    inputFormatters: [ThousandsInputFormatter()],
                    decoration: const InputDecoration(labelText: 'Harga', prefixText: 'Rp '),
                    validator: (v) =>
                        (parseFormattedInt(v) ?? 0) <= 0 ? 'Harga wajib diisi' : null,
                  ),
                ),
                Expanded(
                  child: TextFormField(
                    controller: _sku,
                    decoration: const InputDecoration(labelText: 'SKU (opsional)'),
                  ),
                ),
              ],
            ),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 12,
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _stock,
                    enabled: isNew,
                    keyboardType: TextInputType.number,
                    inputFormatters: [_digits, LengthLimitingTextInputFormatter(6)],
                    decoration: InputDecoration(
                      labelText: 'Stok awal',
                      helperText: isNew ? null : 'Ubah lewat tombol Ubah stok',
                    ),
                    validator: (v) => (v ?? '').isEmpty ? 'Stok wajib diisi' : null,
                  ),
                ),
                Expanded(
                  child: TextFormField(
                    controller: _minStock,
                    keyboardType: TextInputType.number,
                    inputFormatters: [_digits, LengthLimitingTextInputFormatter(6)],
                    decoration: const InputDecoration(labelText: 'Batas stok minimum'),
                    validator: (v) => (v ?? '').isEmpty ? 'Wajib diisi' : null,
                  ),
                ),
              ],
            ),
            Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: posOutlined(),
                  clipBehavior: Clip.antiAlias,
                  child: switch (fileImage(_photo)) {
                    final img? => Image(
                      image: img,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => const SizedBox.shrink(),
                    ),
                    null => const Icon(LucideIcons.image, color: PosColors.muted),
                  },
                ),
                const SizedBox(width: 12),
                Expanded(child: Text('Foto (opsional)', style: PosText.bodyMuted)),
                if (_photo != null)
                  PosButton.ghost(
                    label: 'Hapus',
                    size: PosButtonSize.sm,
                    onPressed: () => setState(() => _photo = null),
                  ),
                PosButton.secondary(
                  label: 'Pilih foto',
                  size: PosButtonSize.sm,
                  onPressed: _pickPhoto,
                ),
              ],
            ),
          ],
        ),
      ),
      actions: [
        PosButton.secondary(
          label: 'Batal',
          size: PosButtonSize.md,
          onPressed: () => Navigator.pop(context),
        ),
        PosButton.primary(
          label: 'Simpan',
          size: PosButtonSize.md,
          onPressed: _saving ? null : _save,
        ),
      ],
    );
  }
}
