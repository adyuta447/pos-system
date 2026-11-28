import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

const whatsappFormatHint =
    'Format 08xx, +62 8xx, atau 628xx. Contoh: 081234567890';

class WhatsappReceiptDialog extends StatefulWidget {
  final String storePhone;
  const WhatsappReceiptDialog({super.key, required this.storePhone});

  @override
  State<WhatsappReceiptDialog> createState() => _WhatsappReceiptDialogState();
}

class _WhatsappReceiptDialogState extends State<WhatsappReceiptDialog> {
  final _form = GlobalKey<FormState>();
  final _phone = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final hasStore = normalizeWhatsappNumber(widget.storePhone) != null;
    return PosFormDialog(
      title: 'Kirim struk lewat WhatsApp',
      body: Form(
        key: _form,
        child: TextFormField(
          controller: _phone,
          autofocus: true,
          keyboardType: TextInputType.phone,
          onFieldSubmitted: (_) => _submit(),
          decoration: InputDecoration(
            labelText: 'Nomor WhatsApp pelanggan',
            hintText: '0812xxxxxxxx',
            helperText: hasStore
                ? '$whatsappFormatHint\nKosongkan untuk kirim ke nomor toko ${widget.storePhone}.'
                : whatsappFormatHint,
            helperMaxLines: 3,
            errorMaxLines: 2,
          ),
          validator: (v) {
            final text = (v ?? '').trim();
            if (text.isEmpty) {
              return hasStore
                  ? null
                  : 'Isi nomor pelanggan. Nomor toko belum diisi di Pengaturan.';
            }
            return normalizeWhatsappNumber(text) == null
                ? 'Nomor tidak valid. $whatsappFormatHint'
                : null;
          },
        ),
      ),
      actions: [
        PosButton.secondary(
          label: 'Batal',
          size: PosButtonSize.md,
          onPressed: () => Navigator.pop(context),
        ),
        PosButton.primary(
          label: 'Kirim',
          icon: LucideIcons.messageCircle,
          size: PosButtonSize.md,
          onPressed: _submit,
        ),
      ],
    );
  }

  @override
  void dispose() {
    _phone.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_form.currentState!.validate()) return;
    Navigator.pop(
      context,
      normalizeWhatsappNumber(_phone.text) ??
          normalizeWhatsappNumber(widget.storePhone),
    );
  }
}
