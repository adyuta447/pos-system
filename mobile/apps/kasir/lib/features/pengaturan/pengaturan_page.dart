import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

import '../../app/permission_gate.dart';
import '../../app/providers.dart';
import 'settings_forms.dart';

class PengaturanPage extends ConsumerStatefulWidget {
  const PengaturanPage({super.key});

  @override
  ConsumerState<PengaturanPage> createState() => _PengaturanPageState();
}

class _PengaturanPageState extends ConsumerState<PengaturanPage> {
  final _form = GlobalKey<FormState>();
  var _tab = 0;
  StoreSettings? _draft;

  /// Naik saat perubahan dibatalkan, supaya field dibuat ulang dengan nilai tersimpan.
  var _rev = 0;

  Future<void> _save() async {
    if (!_form.currentState!.validate()) return;
    await ref.read(settingsRepositoryProvider).save(_draft!);
    if (mounted) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Pengaturan disimpan')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final saved = ref.watch(settingsProvider).value;
    if (saved == null) return const Center(child: CircularProgressIndicator());
    final draft = _draft ??= saved;
    final dirty = draft != saved;
    void set(StoreSettings s) => setState(() => _draft = s);

    return SettingsLayout(
      header: PageHeader(
        title: 'Pengaturan',
        subtitle: dirty ? 'Ada perubahan yang belum disimpan' : 'Semua perubahan tersimpan',
        trailing: [
          if (dirty)
            PosButton.ghost(
              label: 'Batalkan',
              size: PosButtonSize.sm,
              onPressed: () => setState(() {
                _draft = saved;
                _rev++;
              }),
            ),
          PermissionGate(
            permission: Permission.manageSettings,
            child: PosButton.primary(
              label: 'Simpan',
              size: PosButtonSize.sm,
              onPressed: dirty ? _save : null,
            ),
          ),
        ],
      ),
      tabs: const ['Profil', 'Toko', 'Pajak', 'Printer'],
      selected: _tab,
      onTab: (i) => setState(() => _tab = i),
      body: Form(
        key: _form,
        child: ListView(
          key: ValueKey((_tab, _rev)),
          padding: const EdgeInsets.all(24),
          children: [
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 480),
              child: switch (_tab) {
                0 => ProfileFields(draft: draft, onChanged: set),
                1 => Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SectionTitle('Data toko', subtitle: 'Tampil di bagian atas struk'),
                    StoreFields(draft: draft, onChanged: set),
                    const SizedBox(height: 28),
                    const SectionTitle('Nomor struk'),
                    ReceiptNumberFields(draft: draft, onChanged: set),
                  ],
                ),
                2 => TaxFields(draft: draft, onChanged: set),
                _ => PermissionGate(
                  permission: Permission.managePrinter,
                  child: PrinterFields(draft: draft, onChanged: set),
                ),
              },
            ),
          ],
        ),
      ),
      preview: ReceiptPreviewPanel(draft: draft),
    );
  }
}
