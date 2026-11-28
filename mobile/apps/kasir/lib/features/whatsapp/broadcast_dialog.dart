import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

import '../../app/whatsapp_sender.dart';

/// Antrean pesan massal yang berjalan sendiri.
///
/// WhatsApp tidak mengizinkan app mengirim ke banyak nomor sekaligus tanpa WhatsApp
/// Business API (berbayar, butuh server), dan link wa.me selalu membuka satu chat.
/// Jadi: chat pertama dibuka, kasir menekan Kirim di WhatsApp lalu kembali ke app,
/// dan chat berikutnya terbuka otomatis setelah hitung mundur, sampai semua selesai.
class BroadcastDialog extends ConsumerStatefulWidget {
  const BroadcastDialog({
    super.key,
    required this.phones,
    required this.message,
  });
  final List<String> phones;
  final String message;

  /// Jeda sebelum chat berikutnya dibuka otomatis setelah kembali dari WhatsApp.
  static const countdown = 3;

  @override
  ConsumerState<BroadcastDialog> createState() => _BroadcastDialogState();
}

class _BroadcastDialogState extends ConsumerState<BroadcastDialog>
    with WidgetsBindingObserver {
  var _index = 0;
  var _opened = 0;
  var _busy = false;

  /// true setelah [_start]: lanjut sendiri tiap kali kembali dari WhatsApp.
  var _running = false;

  /// WhatsApp sudah dibuka untuk nomor sebelumnya; menunggu kasir kembali ke app.
  var _awaitingReturn = false;

  /// Detik tersisa sebelum chat berikutnya dibuka; null = tidak sedang hitung mundur.
  int? _left;
  Timer? _timer;

  bool get _done => _index >= widget.phones.length;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    _timer?.cancel();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state != AppLifecycleState.resumed || !_awaitingReturn) return;
    _awaitingReturn = false;
    if (_running && !_done) _startCountdown();
    setState(() {});
  }

  void _start() {
    setState(() => _running = true);
    _open();
  }

  void _startCountdown() {
    _left = BroadcastDialog.countdown;
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) return t.cancel();
      setState(() => _left = _left! - 1);
      if (_left! <= 0) {
        t.cancel();
        _left = null;
        _open();
      }
    });
  }

  /// Hentikan jalan otomatis; lanjutkan per nomor dengan tombol.
  void _pause() {
    _timer?.cancel();
    setState(() {
      _left = null;
      _running = false;
    });
  }

  void _skip() {
    _timer?.cancel();
    setState(() {
      _left = null;
      _index++;
    });
    if (_running && !_done) _startCountdown();
  }

  Future<void> _open() async {
    setState(() => _busy = true);
    final ok = await ref
        .read(whatsappSenderProvider)
        .open(
          widget.phones[_index],
          widget.message,
          kind: WhatsappKind.broadcast,
        );
    if (!mounted) return;
    setState(() {
      _busy = false;
      _index++;
      if (ok) {
        _opened++;
        _awaitingReturn = true;
      } else {
        // Gagal dibuka (sudah ada notifikasinya): jangan lanjut sendiri.
        _running = false;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final total = widget.phones.length;
    if (_done && !_awaitingReturn) {
      return PosFormDialog(
        title: 'Pesan selesai',
        body: Text(
          '$_opened dari $total chat dibuka di WhatsApp. '
          '${total - _opened} dilewati.',
          style: PosText.bodyMuted.copyWith(height: 1.5),
        ),
        actions: [
          PosButton.primary(
            label: 'Tutup',
            size: PosButtonSize.md,
            onPressed: () => Navigator.pop(context),
          ),
        ],
      );
    }

    final status = _awaitingReturn
        ? 'Tekan Kirim di WhatsApp, lalu kembali ke aplikasi ini.'
        : _left != null
        ? 'Membuka chat berikutnya dalam $_left detik…'
        : _running
        ? 'Membuka WhatsApp…'
        : 'Chat dibuka satu per satu. Setelah menekan Kirim di WhatsApp, kembali ke '
              'aplikasi ini dan chat berikutnya terbuka sendiri.';
    final current = _done ? widget.phones.last : widget.phones[_index];
    return PosFormDialog(
      title: _running || _awaitingReturn || _index > 0
          ? 'Mengirim pesan ($_opened/$total)'
          : 'Kirim ke $total pelanggan',
      maxWidth: 560,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: _opened / total,
              minHeight: 8,
              color: PosColors.ink,
              backgroundColor: PosColors.subtle,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            '${_awaitingReturn ? 'Terakhir dibuka' : 'Berikutnya'}: ${displayPhone(current)}',
            style: PosText.bodyStrong,
          ),
          const SizedBox(height: 8),
          Text(
            widget.message,
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
            style: PosText.bodyMuted,
          ),
          const SizedBox(height: 16),
          Text(status, style: PosText.caption),
        ],
      ),
      actions: [
        PosButton.ghost(
          label: 'Berhenti',
          size: PosButtonSize.md,
          onPressed: () {
            _timer?.cancel();
            setState(() {
              _left = null;
              _running = false;
              _awaitingReturn = false;
              _index = total;
            });
          },
        ),
        if (_left != null)
          PosButton.secondary(
            label: 'Jeda',
            size: PosButtonSize.md,
            onPressed: _pause,
          )
        else
          PosButton.secondary(
            label: 'Lewati',
            size: PosButtonSize.md,
            onPressed: _busy || _done || _awaitingReturn ? null : _skip,
          ),
        PosButton.primary(
          label: _running || _awaitingReturn || _index > 0
              ? 'Buka sekarang'
              : 'Kirim ke semua',
          size: PosButtonSize.md,
          onPressed: _busy || _done
              ? null
              : () {
                  _timer?.cancel();
                  _left = null;
                  _awaitingReturn = false;
                  _running ? _open() : _start();
                },
        ),
      ],
    );
  }
}
