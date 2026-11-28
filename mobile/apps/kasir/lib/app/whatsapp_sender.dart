import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';
import 'package:url_launcher/url_launcher.dart';

import 'providers.dart';
import 'receipt_printer.dart';

final whatsappSenderProvider = Provider<WhatsappSender>(WhatsappSender.new);

/// Satu pintu untuk membuka WhatsApp: struk, kirim ulang, dan pesan massal.
class WhatsappSender {
  WhatsappSender(this.ref);
  final Ref ref;

  /// Buka chat [phone] dengan [message] terisi. Bila berhasil dibuka dan [log] true,
  /// dicatat di riwayat kirim. false bila nomor tidak valid atau WhatsApp gagal dibuka.
  Future<bool> open(
    String phone,
    String message, {
    required WhatsappKind kind,
    String? transactionId,
    String? receiptNo,
    bool log = true,
  }) async {
    final to = normalizeWhatsappNumber(phone);
    final uri = to == null ? null : whatsappUri(to, message);
    var opened = false;
    if (uri != null) {
      try {
        opened = await launchUrl(uri, mode: LaunchMode.externalApplication);
      } on Exception {
        opened = false;
      }
    }
    if (opened && log) {
      await ref
          .read(whatsappRepositoryProvider)
          .log(
            phone: to!,
            kind: kind,
            message: message,
            transactionId: transactionId,
            receiptNo: receiptNo,
          );
    }
    final context = rootNavigatorKey.currentContext;
    if (!opened && context != null && context.mounted) {
      await showNotice(
        context,
        title: 'WhatsApp tidak bisa dibuka',
        message: uri == null
            ? 'Nomor ${displayPhone(phone)} tidak valid.'
            : 'Pastikan WhatsApp terpasang di perangkat ini.',
        error: true,
      );
    }
    return opened;
  }
}
