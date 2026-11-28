import 'models.dart';

/// "0812-3456-7890", "+62 812…", "812…" → "6281234567890". null bila kosong atau tidak valid.
String? normalizeWhatsappNumber(String input) {
  var d = input.replaceAll(RegExp(r'\D'), '');
  if (d.startsWith('0')) {
    d = '62${d.substring(1)}';
  } else if (d.startsWith('8')) {
    d = '62$d';
  }
  return d.length >= 10 && d.length <= 15 ? d : null;
}

/// Link wa.me dengan pesan terisi. null bila nomornya tidak valid.
Uri? whatsappUri(String phone, String text) {
  final n = normalizeWhatsappNumber(phone);
  // encodeComponent: spasi jadi %20 (bukan +) dan baris baru %0A, sesuai wa.me.
  return n == null
      ? null
      : Uri.parse('https://wa.me/$n?text=${Uri.encodeComponent(text)}');
}

/// "6281234567890" → "0812-3456-7890" untuk ditampilkan (dikelompokkan 4-4-sisa).
String displayPhone(String normalized) {
  final local = normalized.startsWith('62')
      ? '0${normalized.substring(2)}'
      : normalized;
  if (local.length <= 8) return local;
  return '${local.substring(0, 4)}-${local.substring(4, 8)}-${local.substring(8)}';
}

typedef WhatsappContact = ({String phone, DateTime lastSentAt, int receipts});

/// Pelanggan unik dari riwayat kirim, terbaru dulu. [receipts]: jumlah struk yang dikirim.
List<WhatsappContact> whatsappContacts(List<WhatsappMessageView> messages) {
  final byPhone = <String, WhatsappContact>{};
  for (final m in messages) {
    final c = byPhone[m.phone];
    byPhone[m.phone] = (
      phone: m.phone,
      lastSentAt: c == null || m.sentAt.isAfter(c.lastSentAt)
          ? m.sentAt
          : c.lastSentAt,
      receipts: (c?.receipts ?? 0) + (m.kind == WhatsappKind.receipt ? 1 : 0),
    );
  }
  return byPhone.values.toList()
    ..sort((a, b) => b.lastSentAt.compareTo(a.lastSentAt));
}
