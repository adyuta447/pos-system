import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

import '../../app/providers.dart';

/// Penyesuaian stok manual dengan alasan; tercatat di log mutasi.
class StockDialog extends ConsumerStatefulWidget {
  const StockDialog({super.key, required this.product});
  final ProductView product;

  @override
  ConsumerState<StockDialog> createState() => _StockDialogState();
}

class _StockDialogState extends ConsumerState<StockDialog> {
  final _form = GlobalKey<FormState>();
  late final _stock = TextEditingController(text: '${widget.product.stock}');
  final _note = TextEditingController();
  var _reason = StockMovementType.restock;

  @override
  void dispose() {
    _stock.dispose();
    _note.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_form.currentState!.validate()) return;
    await ref
        .read(catalogRepositoryProvider)
        .adjustStock(
          widget.product.id,
          newStock: int.parse(_stock.text),
          reason: _reason,
          note: _note.text,
        );
    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.product;
    final next = int.tryParse(_stock.text);
    final diff = next == null ? 0 : next - p.stock;
    return PosFormDialog(
      title: 'Ubah stok ${p.name}',
      maxWidth: 440,
      body: Form(
        key: _form,
        child: Column(
          spacing: 16,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Stok sekarang ${p.stock}${diff == 0 ? '' : ' → ${diff > 0 ? '+' : ''}$diff'}',
              style: PosText.bodyMuted,
            ),
            TextFormField(
              controller: _stock,
              autofocus: true,
              keyboardType: TextInputType.number,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(6),
              ],
              decoration: const InputDecoration(labelText: 'Jumlah stok baru'),
              onChanged: (_) => setState(() {}),
              validator: (v) {
                if ((v ?? '').isEmpty) return 'Wajib diisi';
                return int.parse(v!) == p.stock ? 'Stok tidak berubah' : null;
              },
            ),
            DropdownButtonFormField<StockMovementType>(
              initialValue: _reason,
              decoration: const InputDecoration(labelText: 'Alasan'),
              dropdownColor: PosColors.surface,
              items: [
                for (final r in StockMovementType.manual)
                  DropdownMenuItem(value: r, child: Text(r.label)),
              ],
              onChanged: (r) => setState(() => _reason = r!),
            ),
            TextFormField(
              controller: _note,
              decoration: const InputDecoration(labelText: 'Catatan (opsional)'),
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
        PosButton.primary(label: 'Simpan', size: PosButtonSize.md, onPressed: _save),
      ],
    );
  }
}
