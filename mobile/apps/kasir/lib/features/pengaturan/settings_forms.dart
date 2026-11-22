import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_printer/pos_printer.dart';
import 'package:pos_ui/pos_ui.dart';

import '../../app/images.dart';
import '../../app/providers.dart';
import '../../app/receipt_printer.dart';

// Bagian form pengaturan, dipakai halaman Pengaturan dan wizard Setup Awal.
// Setiap bagian menerima draft dan melaporkan draft baru lewat onChanged.

typedef SettingsChanged = ValueChanged<StoreSettings>;

class ProfileFields extends StatelessWidget {
  const ProfileFields({super.key, required this.draft, required this.onChanged});
  final StoreSettings draft;
  final SettingsChanged onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      spacing: 16,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _ImagePickerRow(
          label: 'Foto profil',
          preview: PosAvatar(
            name: draft.userName,
            image: fileImage(draft.userPhotoPath),
            radius: 28,
          ),
          hasImage: draft.userPhotoPath != null,
          onPicked: (path) => onChanged(draft.copyWith(userPhotoPath: path)),
        ),
        TextFormField(
          initialValue: draft.userName,
          textCapitalization: TextCapitalization.words,
          decoration: const InputDecoration(labelText: 'Nama pengguna'),
          validator: _required('Nama'),
          onChanged: (v) => onChanged(draft.copyWith(userName: v.trim())),
        ),
      ],
    );
  }
}

class StoreFields extends StatelessWidget {
  const StoreFields({
    super.key,
    required this.draft,
    required this.onChanged,
    this.showLogo = true,
  });
  final StoreSettings draft;
  final SettingsChanged onChanged;
  final bool showLogo;

  @override
  Widget build(BuildContext context) {
    return Column(
      spacing: 16,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextFormField(
          initialValue: draft.storeName,
          textCapitalization: TextCapitalization.words,
          decoration: const InputDecoration(labelText: 'Nama toko'),
          validator: _required('Nama toko'),
          onChanged: (v) => onChanged(draft.copyWith(storeName: v.trim())),
        ),
        TextFormField(
          initialValue: draft.address,
          decoration: const InputDecoration(labelText: 'Alamat'),
          onChanged: (v) => onChanged(draft.copyWith(address: v.trim())),
        ),
        TextFormField(
          initialValue: draft.phone,
          keyboardType: TextInputType.phone,
          decoration: const InputDecoration(labelText: 'Nomor telepon'),
          onChanged: (v) => onChanged(draft.copyWith(phone: v.trim())),
        ),
        if (showLogo)
          _ImagePickerRow(
            label: 'Logo struk',
            hint: 'Dikecilkan otomatis dan dicetak hitam putih',
            preview: Container(
              width: 56,
              height: 56,
              decoration: posOutlined(),
              clipBehavior: Clip.antiAlias,
              child: switch (fileImage(draft.logoPath)) {
                final img? => Image(
                  image: img,
                  fit: BoxFit.contain,
                  errorBuilder: (_, _, _) => const SizedBox.shrink(),
                ),
                null => const Icon(LucideIcons.store, color: PosColors.muted),
              },
            ),
            hasImage: draft.logoPath != null,
            onPicked: (path) => onChanged(draft.copyWith(logoPath: path)),
          ),
        TextFormField(
          initialValue: draft.receiptHeader,
          decoration: const InputDecoration(labelText: 'Header struk (opsional)'),
          onChanged: (v) => onChanged(draft.copyWith(receiptHeader: v.trim())),
        ),
        TextFormField(
          initialValue: draft.receiptFooter,
          decoration: const InputDecoration(labelText: 'Footer struk'),
          onChanged: (v) => onChanged(draft.copyWith(receiptFooter: v.trim())),
        ),
      ],
    );
  }
}

class ReceiptNumberFields extends StatelessWidget {
  const ReceiptNumberFields({super.key, required this.draft, required this.onChanged});
  final StoreSettings draft;
  final SettingsChanged onChanged;

  @override
  Widget build(BuildContext context) {
    final prefix = draft.receiptPrefix.isEmpty ? 'INV' : draft.receiptPrefix;
    final example = draft.dailyReset ? '$prefix-${_yymmdd(DateTime.now())}-0001' : '$prefix-000001';
    return Column(
      spacing: 12,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextFormField(
          initialValue: draft.receiptPrefix,
          textCapitalization: TextCapitalization.characters,
          maxLength: 6,
          decoration: const InputDecoration(labelText: 'Prefix nomor struk', counterText: ''),
          validator: (v) => RegExp(r'^[A-Za-z0-9]{1,6}$').hasMatch(v ?? '')
              ? null
              : 'Huruf atau angka, 1–6 karakter',
          onChanged: (v) => onChanged(draft.copyWith(receiptPrefix: v.trim().toUpperCase())),
        ),
        _SwitchRow(
          label: 'Reset nomor setiap hari',
          subtitle: 'Contoh nomor struk: $example',
          value: draft.dailyReset,
          onChanged: (v) => onChanged(draft.copyWith(dailyReset: v)),
        ),
      ],
    );
  }

  static String _yymmdd(DateTime d) =>
      [d.year % 100, d.month, d.day].map((n) => n.toString().padLeft(2, '0')).join();
}

class TaxFields extends StatelessWidget {
  const TaxFields({super.key, required this.draft, required this.onChanged});
  final StoreSettings draft;
  final SettingsChanged onChanged;

  @override
  Widget build(BuildContext context) {
    final tax = draft.tax;
    void set(TaxSettings t) => onChanged(draft.copyWith(tax: t));
    return Column(
      spacing: 16,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SwitchRow(
          label: 'Aktifkan pajak',
          subtitle: 'Bila mati, baris pajak tidak tampil di keranjang dan struk',
          value: tax.enabled,
          onChanged: (v) => set(tax.copyWith(enabled: v)),
        ),
        if (tax.enabled) ...[
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 12,
            children: [
              Expanded(
                child: TextFormField(
                  initialValue: tax.name,
                  decoration: const InputDecoration(
                    labelText: 'Nama pajak',
                    hintText: 'PPN, PB1, …',
                  ),
                  validator: _required('Nama pajak'),
                  onChanged: (v) => set(tax.copyWith(name: v.trim())),
                ),
              ),
              Expanded(
                child: TextFormField(
                  initialValue: formatRate(tax.rateBp),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(labelText: 'Persentase', suffixText: '%'),
                  autovalidateMode: AutovalidateMode.onUserInteraction,
                  validator: (v) => parseRate(v ?? '') == null ? '0–100, maks 2 desimal' : null,
                  onChanged: (v) {
                    if (parseRate(v) case final bp?) set(tax.copyWith(rateBp: bp));
                  },
                ),
              ),
            ],
          ),
          Text('Harga produk', style: PosText.label),
          PosSegmented(
            labels: const ['Pajak ditambahkan', 'Sudah termasuk pajak'],
            selected: tax.inclusive ? 1 : 0,
            onChanged: (i) => set(tax.copyWith(inclusive: i == 1)),
          ),
        ],
      ],
    );
  }
}

/// Scan dan pilih printer Bluetooth, lebar kertas, dan tes cetak.
class PrinterFields extends ConsumerStatefulWidget {
  const PrinterFields({super.key, required this.draft, required this.onChanged});
  final StoreSettings draft;
  final SettingsChanged onChanged;

  @override
  ConsumerState<PrinterFields> createState() => _PrinterFieldsState();
}

class _PrinterFieldsState extends ConsumerState<PrinterFields> {
  List<PrinterDevice>? _devices;
  var _scanning = false;

  Future<void> _scan() async {
    setState(() => _scanning = true);
    try {
      final found = await ref.read(printerServiceProvider).scan();
      setState(() => _devices = found);
    } on Exception catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Gagal mencari printer: $e')));
      }
    } finally {
      if (mounted) setState(() => _scanning = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final d = widget.draft;
    final devices = _devices;
    return Column(
      spacing: 12,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Lebar kertas', style: PosText.label),
        PosSegmented(
          labels: const ['58 mm', '80 mm'],
          selected: d.paper.index,
          onChanged: (i) => widget.onChanged(d.copyWith(paper: PaperWidth.values[i])),
        ),
        const SizedBox(height: 4),
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Printer', style: PosText.label),
                  Text(d.printerName ?? 'Belum dipilih', style: PosText.bodyStrong),
                ],
              ),
            ),
            PosButton.secondary(
              label: _scanning ? 'Mencari…' : 'Cari printer',
              icon: LucideIcons.bluetoothSearching,
              size: PosButtonSize.sm,
              onPressed: _scanning ? null : _scan,
            ),
          ],
        ),
        if (devices != null && devices.isEmpty)
          Text(
            'Tidak ada printer ditemukan. Pastikan printer menyala, Bluetooth aktif, dan sudah di-pair di pengaturan Android.',
            style: PosText.caption.copyWith(height: 1.5),
          ),
        for (final dev in devices ?? const <PrinterDevice>[])
          PosButton(
            label: '${dev.name} · ${dev.address}',
            variant: dev.address == d.printerAddress
                ? PosButtonVariant.primary
                : PosButtonVariant.secondary,
            size: PosButtonSize.sm,
            expand: true,
            onPressed: () =>
                widget.onChanged(d.copyWith(printerAddress: dev.address, printerName: dev.name)),
          ),
      ],
    );
  }
}

/// Preview struk dengan data contoh, mengikuti draft dan lebar kertas; plus tombol Tes Cetak.
class ReceiptPreviewPanel extends ConsumerWidget {
  const ReceiptPreviewPanel({super.key, required this.draft});
  final StoreSettings draft;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lines = ReceiptLayout.build(trx: ReceiptLayout.sample(draft), store: draft);
    return ColoredBox(
      color: PosColors.subtle,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
            child: Row(
              children: [
                Text('Preview struk', style: PosText.heading),
                const Spacer(),
                Text(draft.paper == PaperWidth.mm58 ? '58 mm' : '80 mm', style: PosText.subtitle),
              ],
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ReceiptPreview(
                lines: lines,
                chars: draft.paper.chars,
                logo: fileImage(draft.logoPath),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: PosButton.secondary(
              label: 'Tes cetak',
              icon: LucideIcons.printer,
              size: PosButtonSize.md,
              expand: true,
              onPressed: () async {
                final ok = await ref.read(receiptPrinterProvider).printTest(draft);
                if (ok && context.mounted) {
                  ScaffoldMessenger.of(context)
                      .showSnackBar(const SnackBar(content: Text('Tes cetak terkirim ke printer')));
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}

class SectionTitle extends StatelessWidget {
  const SectionTitle(this.title, {super.key, this.subtitle});
  final String title;
  final String? subtitle;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: PosText.heading),
        if (subtitle case final s?) ...[
          const SizedBox(height: 2),
          Text(s, style: PosText.subtitle),
        ],
        const SizedBox(height: 16),
      ],
    );
  }
}

FormFieldValidator<String> _required(String field) =>
    (v) => (v ?? '').trim().isEmpty ? '$field wajib diisi' : null;

class _SwitchRow extends StatelessWidget {
  const _SwitchRow({
    required this.label,
    required this.subtitle,
    required this.value,
    required this.onChanged,
  });
  final String label;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => onChanged(!value),
      borderRadius: BorderRadius.circular(10),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: PosText.body.copyWith(fontWeight: FontWeight.w500)),
                  Text(subtitle, style: PosText.caption),
                ],
              ),
            ),
            Switch(value: value, onChanged: onChanged),
          ],
        ),
      ),
    );
  }
}

class _ImagePickerRow extends StatelessWidget {
  const _ImagePickerRow({
    required this.label,
    required this.preview,
    required this.hasImage,
    required this.onPicked,
    this.hint,
  });
  final String label;
  final String? hint;
  final Widget preview;
  final bool hasImage;
  final ValueChanged<String?> onPicked;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        preview,
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: PosText.body.copyWith(fontWeight: FontWeight.w500)),
              if (hint case final h?) Text(h, style: PosText.caption),
            ],
          ),
        ),
        if (hasImage)
          PosButton.ghost(label: 'Hapus', size: PosButtonSize.sm, onPressed: () => onPicked(null)),
        PosButton.secondary(
          label: 'Pilih',
          size: PosButtonSize.sm,
          onPressed: () async {
            final path = await pickAndStoreImage(maxWidth: 1024);
            if (path != null) onPicked(path);
          },
        ),
      ],
    );
  }
}
