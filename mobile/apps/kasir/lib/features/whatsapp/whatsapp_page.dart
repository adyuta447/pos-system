import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

import '../../app/format.dart';
import '../../app/providers.dart';
import '../../app/whatsapp_sender.dart';
import 'broadcast_dialog.dart';

/// Riwayat struk yang dikirim lewat WhatsApp, kirim ulang, dan pesan massal ke pelanggan.
class WhatsappPage extends ConsumerStatefulWidget {
  const WhatsappPage({super.key});

  @override
  ConsumerState<WhatsappPage> createState() => _WhatsappPageState();
}

class _WhatsappPageState extends ConsumerState<WhatsappPage> {
  var _tab = 0;

  @override
  Widget build(BuildContext context) {
    final messages =
        ref.watch(whatsappMessagesProvider).value ??
        const <WhatsappMessageView>[];
    final contacts = whatsappContacts(messages);
    return Column(
      children: [
        PageHeader(
          title: 'WhatsApp',
          subtitle: '${contacts.length} pelanggan, ${messages.length} pesan',
          trailing: [
            SizedBox(
              width: 320,
              child: PosSegmented(
                labels: const ['Riwayat kirim', 'Kirim pesan'],
                icons: const [LucideIcons.history, LucideIcons.megaphone],
                selected: _tab,
                onChanged: (i) => setState(() => _tab = i),
              ),
            ),
          ],
        ),
        const Divider(),
        Expanded(
          child: messages.isEmpty
              ? const EmptyState(
                  title: 'Belum ada pesan',
                  message: 'Struk yang dikirim ke nomor pelanggan lewat WhatsApp tercatat di sini.',
                )
              : _tab == 0
              ? _SentList(messages: messages)
              : _Broadcast(contacts: contacts),
        ),
      ],
    );
  }
}

class _SentList extends ConsumerWidget {
  const _SentList({required this.messages});
  final List<WhatsappMessageView> messages;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
      child: DataTableCard(
        columns: const [
          PosColumn('Tanggal', width: 110),
          PosColumn('Waktu', width: 56),
          PosColumn('Nomor', width: 140),
          PosColumn('Jenis', width: 90),
          PosColumn('Keterangan'),
          PosColumn('', width: 130),
        ],
        rowCount: messages.length,
        rowBuilder: (i) {
          final m = messages[i];
          return PosRow(
            cells: [
              Text(formatShortDate(m.sentAt), style: PosText.bodyMuted),
              Text(formatTime(m.sentAt), style: PosText.bodyMuted),
              Text(displayPhone(m.phone), style: PosText.bodyStrong),
              WhatsappKindBadge(m.kind),
              Text(
                m.receiptNo ?? m.message.split('\n').first,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              PosButton.secondary(
                label: 'Kirim ulang',
                size: PosButtonSize.sm,
                onPressed: () => ref
                    .read(whatsappSenderProvider)
                    .open(
                      m.phone,
                      m.message,
                      kind: m.kind,
                      receiptNo: m.receiptNo,
                    ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _Broadcast extends StatefulWidget {
  const _Broadcast({required this.contacts});
  final List<WhatsappContact> contacts;

  @override
  State<_Broadcast> createState() => _BroadcastState();
}

class _BroadcastState extends State<_Broadcast> {
  final _selected = <String>{};
  final _message = TextEditingController();

  @override
  void dispose() {
    _message.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final contacts = widget.contacts;
    final allSelected =
        contacts.isNotEmpty && _selected.length == contacts.length;
    final canSend = _selected.isNotEmpty && _message.text.trim().isNotEmpty;
    return Row(
      children: [
        Expanded(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 16, 24, 0),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        '${_selected.length} dari ${contacts.length} pelanggan dipilih',
                        style: PosText.bodyMuted,
                      ),
                    ),
                    PosButton.ghost(
                      label: allSelected ? 'Batal pilih' : 'Pilih semua',
                      size: PosButtonSize.sm,
                      onPressed: () => setState(
                        () => allSelected
                            ? _selected.clear()
                            : _selected.addAll(contacts.map((c) => c.phone)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Expanded(
                  child: DataTableCard(
                    columns: const [
                      PosColumn('', width: 40),
                      PosColumn('Nomor'),
                      PosColumn('Jumlah struk', width: 100, alignEnd: true),
                      PosColumn('Terakhir dikirim', width: 120),
                      PosColumn('Waktu', width: 56),
                    ],
                    rowCount: contacts.length,
                    rowBuilder: (i) {
                      final c = contacts[i];
                      final on = _selected.contains(c.phone);
                      void toggle() => setState(
                        () => on
                            ? _selected.remove(c.phone)
                            : _selected.add(c.phone),
                      );
                      return PosRow(
                        selected: on,
                        onTap: toggle,
                        cells: [
                          Checkbox(
                            value: on,
                            onChanged: (_) => toggle(),
                          ),
                          Text(
                            displayPhone(c.phone),
                            style: PosText.bodyStrong,
                          ),
                          Text('${c.receipts}'),
                          Text(
                            formatShortDate(c.lastSentAt),
                            style: PosText.bodyMuted,
                          ),
                          Text(
                            formatTime(c.lastSentAt),
                            style: PosText.bodyMuted,
                          ),
                        ],
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
        // Sama seperti detail Riwayat/Produk: panel baru muncul setelah ada yang dipilih.
        if (_selected.isNotEmpty) ...[
          const VerticalDivider(width: 1),
          SizedBox(
            width: PosBreakpoints.sidePanel(context),
            child: FormScrollView(
              padding: const EdgeInsets.all(20),
              children: [
                Row(
                  children: [
                    Expanded(child: Text('Pesan', style: PosText.heading)),
                    IconButton(
                      tooltip: 'Tutup',
                      onPressed: () => setState(_selected.clear),
                      icon: const Icon(LucideIcons.x, size: 20),
                      color: PosColors.ink,
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _message,
                  minLines: 6,
                  maxLines: 10,
                  onChanged: (_) => setState(() {}),
                  decoration: const InputDecoration(
                    hintText:
                        'Contoh: Halo! Minggu ini ada promo beli 2 gratis 1.',
                    helperText:
                        'Bisa pakai *tebal* dan _miring_ seperti di WhatsApp.',
                    helperMaxLines: 2,
                  ),
                ),
                const SizedBox(height: 16),
                PosButton.primary(
                  label: 'Mulai kirim (${_selected.length})',
                  icon: LucideIcons.send,
                  size: PosButtonSize.md,
                  expand: true,
                  onPressed: canSend
                      ? () => showDialog<void>(
                          context: context,
                          barrierDismissible: false,
                          builder: (_) => BroadcastDialog(
                            phones: [
                              for (final c in contacts)
                                if (_selected.contains(c.phone)) c.phone,
                            ],
                            message: _message.text.trim(),
                          ),
                        )
                      : null,
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}
