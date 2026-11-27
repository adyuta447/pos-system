import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

import '../../app/format.dart';
import '../../app/providers.dart';
import '../pengaturan/settings_forms.dart';

const _steps = [
  ('Data toko', 'Nama, alamat, dan teks di struk'),
  ('Nomor struk', 'Format nomor setiap transaksi'),
  ('Pajak', 'Bisa diubah nanti di Pengaturan'),
  ('Printer', 'Boleh dilewati dan diatur nanti'),
  ('Produk pertama', 'Boleh dikosongkan, tambah nanti di menu Produk'),
];

/// Wizard pertama kali app dibuka. Setelah selesai tidak tampil lagi (setupDone).
class SetupPage extends ConsumerStatefulWidget {
  const SetupPage({super.key});

  @override
  ConsumerState<SetupPage> createState() => _SetupPageState();
}

class _SetupPageState extends ConsumerState<SetupPage> {
  final _form = GlobalKey<FormState>();
  var _step = 0;
  StoreSettings? _draft;
  var _first = (category: '', product: '', price: '', stock: '');
  var _saving = false;

  Future<void> _next() async {
    if (!_form.currentState!.validate()) return;
    if (_step < _steps.length - 1) return setState(() => _step++);
    setState(() => _saving = true);
    try {
      final catalog = ref.read(catalogRepositoryProvider);
      final f = _first;
      if (f.category.trim().isNotEmpty) {
        final categoryId = await catalog.saveCategory(name: f.category);
        if (f.product.trim().isNotEmpty) {
          await catalog.saveProduct(
            ProductView(
              id: '',
              name: f.product,
              price: parseFormattedInt(f.price) ?? 0,
              categoryId: categoryId,
              stock: int.tryParse(f.stock) ?? 0,
              minStock: 5,
            ),
            isNew: true,
          );
        }
      }
      // Router pindah ke kasir begitu setupDone tersimpan.
      await ref.read(settingsRepositoryProvider).save(_draft!.copyWith(setupDone: true));
    } catch (e) {
      if (!mounted) return;
      setState(() => _saving = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal menyimpan: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final saved = ref.watch(settingsProvider).value;
    if (saved == null) return const Scaffold(body: Center(child: CircularProgressIndicator()));
    final draft = _draft ??= saved;
    void set(StoreSettings s) => setState(() => _draft = s);
    final (title, subtitle) = _steps[_step];
    final last = _step == _steps.length - 1;

    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: SafeArea(
        child: SplitLayout(
          header: PageHeader(
            title: 'Setup awal',
            subtitle: 'Langkah ${_step + 1} dari ${_steps.length}',
          ),
          left: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 16, 24, 0),
                child: Row(
                  spacing: 6,
                  children: [
                    for (var i = 0; i < _steps.length; i++)
                      Expanded(
                        child: Container(
                          height: 4,
                          decoration: BoxDecoration(
                            color: i <= _step ? PosColors.ink : PosColors.line,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              Expanded(
                child: Form(
                  key: _form,
                  child: ListView(
                    key: ValueKey(_step),
                    padding: const EdgeInsets.all(24),
                    children: [
                      ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 480),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SectionTitle(title, subtitle: subtitle),
                            switch (_step) {
                              0 => StoreFields(draft: draft, onChanged: set, showLogo: false),
                              1 => ReceiptNumberFields(draft: draft, onChanged: set),
                              2 => TaxFields(draft: draft, onChanged: set),
                              3 => PrinterFields(draft: draft, onChanged: set),
                              _ => _FirstProductFields(
                                value: _first,
                                onChanged: (v) => setState(() => _first = v),
                              ),
                            },
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const Divider(),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  spacing: 12,
                  children: [
                    if (_step > 0)
                      PosButton.secondary(
                        label: 'Kembali',
                        size: PosButtonSize.md,
                        onPressed: () => setState(() => _step--),
                      ),
                    const Spacer(),
                    if (_step == 3)
                      PosButton.ghost(
                        label: 'Lewati',
                        size: PosButtonSize.md,
                        onPressed: () => setState(() => _step++),
                      ),
                    PosButton.primary(
                      label: last ? 'Selesai, mulai berjualan' : 'Lanjut',
                      size: PosButtonSize.md,
                      onPressed: _saving ? null : _next,
                    ),
                  ],
                ),
              ),
            ],
          ),
          right: ReceiptPreviewPanel(draft: draft),
        ),
      ),
    );
  }
}

typedef _FirstProduct = ({String category, String product, String price, String stock});

class _FirstProductFields extends StatelessWidget {
  const _FirstProductFields({required this.value, required this.onChanged});
  final _FirstProduct value;
  final ValueChanged<_FirstProduct> onChanged;

  @override
  Widget build(BuildContext context) {
    final v = value;
    final digits = [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(9)];
    bool hasProduct() => v.product.trim().isNotEmpty;
    return Column(
      spacing: 16,
      children: [
        TextFormField(
          initialValue: v.category,
          textCapitalization: TextCapitalization.words,
          decoration: const InputDecoration(labelText: 'Kategori', hintText: 'Contoh: Minuman'),
          validator: (s) =>
              hasProduct() && (s ?? '').trim().isEmpty ? 'Kategori wajib untuk produk' : null,
          onChanged: (s) =>
              onChanged((category: s, product: v.product, price: v.price, stock: v.stock)),
        ),
        TextFormField(
          initialValue: v.product,
          textCapitalization: TextCapitalization.words,
          decoration: const InputDecoration(
            labelText: 'Nama produk',
            hintText: 'Contoh: Kopi Susu',
          ),
          onChanged: (s) =>
              onChanged((category: v.category, product: s, price: v.price, stock: v.stock)),
        ),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 12,
          children: [
            Expanded(
              child: TextFormField(
                initialValue: v.price,
                keyboardType: TextInputType.number,
                inputFormatters: [ThousandsInputFormatter()],
                decoration: const InputDecoration(labelText: 'Harga', prefixText: 'Rp '),
                validator: (s) =>
                    hasProduct() && (parseFormattedInt(s) ?? 0) <= 0 ? 'Harga wajib diisi' : null,
                onChanged: (s) =>
                    onChanged((category: v.category, product: v.product, price: s, stock: v.stock)),
              ),
            ),
            Expanded(
              child: TextFormField(
                initialValue: v.stock,
                keyboardType: TextInputType.number,
                inputFormatters: digits,
                decoration: const InputDecoration(labelText: 'Stok awal'),
                onChanged: (s) =>
                    onChanged((category: v.category, product: v.product, price: v.price, stock: s)),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
