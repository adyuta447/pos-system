import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

import '../../app/format.dart';
import '../../app/permission_gate.dart';
import '../../app/providers.dart';
import '../../app/receipt_printer.dart';

class RiwayatPage extends ConsumerStatefulWidget {
  const RiwayatPage({super.key});

  @override
  ConsumerState<RiwayatPage> createState() => _RiwayatPageState();
}

class _RiwayatPageState extends ConsumerState<RiwayatPage> {
  var _day = dateOnly(DateTime.now());
  String? _selectedId;

  Future<void> _pickDay() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _day,
      firstDate: DateTime(2024),
      lastDate: DateTime.now(),
      helpText: 'Pilih tanggal',
      cancelText: 'Batal',
    );
    if (picked == null) return;
    setState(() {
      _day = dateOnly(picked);
      _selectedId = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final today = dateOnly(DateTime.now());
    final list = ref.watch(transactionsByDateProvider(_day));
    final expenseList = ref.watch(expensesByDateProvider(_day));
    final trxs = list.value ?? const <TransactionView>[];
    final expenses = expenseList.value ?? const <ExpenseView>[];
    final selected = trxs.where((t) => t.id == _selectedId).firstOrNull ?? trxs.firstOrNull;
    final header = PageHeader(
      title: 'Riwayat & laporan',
      subtitle: '${_day == today ? 'Hari ini · ' : ''}${formatDate(_day)}',
      trailing: [
        PosButton.secondary(
          label: 'Ganti tanggal',
          icon: LucideIcons.calendar,
          size: PosButtonSize.sm,
          onPressed: _pickDay,
        ),
      ],
    );
    if (trxs.isEmpty && expenses.isEmpty) {
      return Column(
        children: [
          header,
          const Divider(),
          Expanded(
            child: (list.isLoading || expenseList.isLoading)
                ? const Center(child: CircularProgressIndicator())
                : const EmptyState(
                    illustration: PosIllustration.historyEmpty,
                    title: 'Belum ada transaksi',
                    message: 'Transaksi dan pengeluaran pada tanggal ini akan muncul di sini.',
                  ),
          ),
        ],
      );
    }
    if (trxs.isEmpty) {
      return Column(
        children: [
          header,
          const Divider(),
          Expanded(
            child: _TransactionList(
              transactions: trxs,
              expenses: expenses,
              selectedId: null,
              onSelect: (_) {},
            ),
          ),
        ],
      );
    }
    return ListDetailLayout(
      header: header,
      list: _TransactionList(
        transactions: trxs,
        expenses: expenses,
        selectedId: selected?.id,
        onSelect: (id) => setState(() => _selectedId = id),
      ),
      detail: _Detail(trx: selected!),
    );
  }
}

class _TransactionList extends StatelessWidget {
  const _TransactionList({
    required this.transactions,
    required this.expenses,
    required this.selectedId,
    required this.onSelect,
  });
  final List<TransactionView> transactions;
  final List<ExpenseView> expenses;
  final String? selectedId;
  final ValueChanged<String> onSelect;

  @override
  Widget build(BuildContext context) {
    // PRD: transaksi void tidak dihitung di total.
    final valid = transactions.where((t) => !t.isVoid);
    int sumTrx(Iterable<TransactionView> ts) => ts.fold(0, (s, t) => s + t.total);
    int sumExp(Iterable<ExpenseView> es) => es.fold(0, (s, e) => s + e.amount);

    final pemasukan = sumTrx(valid);
    final pengeluaran = sumExp(expenses);
    final selisihBersih = pemasukan - pengeluaran;
    final tunaiMasuk = sumTrx(valid.where((t) => t.method == PaymentMethod.cash));
    final tunaiKeluar = sumExp(expenses.where((e) => e.source == ExpensePaymentSource.cash));
    final sisaTunaiLaci = tunaiMasuk - tunaiKeluar;
    final qrisMasuk = sumTrx(valid.where((t) => t.method == PaymentMethod.qrisManual));

    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
      child: Column(
        children: [
          Row(
            spacing: 12,
            children: [
              Expanded(
                child: StatCard(label: 'Pemasukan', value: formatRupiah(pemasukan)),
              ),
              Expanded(
                child: StatCard(label: 'Pengeluaran', value: formatRupiah(pengeluaran)),
              ),
              Expanded(
                child: StatCard(label: 'Selisih bersih', value: formatRupiah(selisihBersih)),
              ),
              Expanded(
                child: StatCard(label: 'Tunai laci', value: formatRupiah(sisaTunaiLaci)),
              ),
              Expanded(
                child: StatCard(label: 'QRIS', value: formatRupiah(qrisMasuk)),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Expanded(
            child: transactions.isEmpty
                ? const EmptyState(
                    illustration: PosIllustration.historyEmpty,
                    title: 'Belum ada penjualan',
                    message: 'Ringkasan pengeluaran tanggal ini sudah terhitung di atas.',
                  )
                : DataTableCard(
              columns: const [
                PosColumn('No. struk', width: 150),
                PosColumn('Waktu', width: 56),
                PosColumn('Item'),
                PosColumn('Metode', width: 64),
                PosColumn('Total', width: 96, alignEnd: true),
              ],
              rowCount: transactions.length,
              rowBuilder: (i) {
                final t = transactions[i];
                return PosRow(
                  selected: t.id == selectedId,
                  onTap: () => onSelect(t.id),
                  cells: [
                    Text(t.receiptNo, style: PosText.bodyStrong),
                    Text(formatTime(t.createdAt), style: PosText.bodyMuted),
                    Text('${t.itemCount} item · ${t.items.map((i) => i.name).join(', ')}'),
                    t.isVoid
                        ? const PosBadge('Void', tone: PosBadgeTone.danger)
                        : PosBadge(t.method.label),
                    Text(
                      formatRupiah(t.total),
                      style: PosText.bodyStrong.copyWith(
                        decoration: t.isVoid ? TextDecoration.lineThrough : null,
                        color: t.isVoid ? PosColors.muted : null,
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _Detail extends ConsumerWidget {
  const _Detail({required this.trx});
  final TransactionView trx;

  Future<void> _void(BuildContext context, WidgetRef ref) async {
    final reason = await showDialog<String>(
      context: context,
      builder: (_) => _VoidDialog(trx: trx),
    );
    if (reason == null) return;
    await ref.read(transactionRepositoryProvider).voidTransaction(trx.id, reason);
    if (context.mounted) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('${trx.receiptNo} di-void. Stok dikembalikan.')));
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final t = trx;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(t.receiptNo, style: PosText.title),
              const SizedBox(height: 2),
              Text(
                '${formatDate(t.createdAt)} · ${formatTime(t.createdAt)}',
                style: PosText.subtitle,
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: [
                  PosBadge(t.orderType),
                  PosBadge(t.method.label),
                  if (t.isVoid) const PosBadge('Void', tone: PosBadgeTone.danger),
                ],
              ),
              if (t.isVoid && t.voidReason != null) ...[
                const SizedBox(height: 8),
                Text(
                  'Alasan void: ${t.voidReason}',
                  style: PosText.caption.copyWith(color: PosColors.red),
                ),
              ],
            ],
          ),
        ),
        const Divider(),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            children: [for (final i in t.items) LineItem(name: i.name, price: i.price, qty: i.qty)],
          ),
        ),
        const Divider(),
        Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              TotalsSummary(
                subtotal: t.subtotal,
                taxLabel: t.taxLabel,
                tax: t.taxAmount,
                total: t.total,
              ),
              if (t.method == PaymentMethod.cash) ...[
                const SizedBox(height: 12),
                SummaryRow('Tunai diterima', formatRupiah(t.received)),
                const SizedBox(height: 8),
                SummaryRow('Kembalian', formatRupiah(t.change)),
              ],
              const SizedBox(height: 16),
              Row(
                spacing: 12,
                children: [
                  Expanded(
                    child: PosButton.secondary(
                      label: 'Cetak ulang',
                      icon: LucideIcons.printer,
                      size: PosButtonSize.md,
                      onPressed: () =>
                          ref.read(receiptPrinterProvider).printTransaction(t, copy: true),
                    ),
                  ),
                  if (!t.isVoid)
                    Expanded(
                      child: PermissionGate(
                        permission: Permission.voidSale,
                        child: PosButton.danger(
                          label: 'Void',
                          size: PosButtonSize.md,
                          expand: true,
                          onPressed: () => _void(context, ref),
                        ),
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

/// Pop dengan alasan void, atau null bila batal.
class _VoidDialog extends StatefulWidget {
  const _VoidDialog({required this.trx});
  final TransactionView trx;

  @override
  State<_VoidDialog> createState() => _VoidDialogState();
}

class _VoidDialogState extends State<_VoidDialog> {
  final _form = GlobalKey<FormState>();
  final _reason = TextEditingController();

  @override
  void dispose() {
    _reason.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PosFormDialog(
      title: 'Void ${widget.trx.receiptNo}?',
      body: Form(
        key: _form,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Transaksi ${formatRupiah(widget.trx.total)} tetap tersimpan dengan status void, '
              'stok dikembalikan, dan tidak dihitung di total penjualan.',
              style: PosText.bodyMuted.copyWith(height: 1.5),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _reason,
              autofocus: true,
              decoration: const InputDecoration(labelText: 'Alasan void'),
              validator: (v) => (v ?? '').trim().isEmpty ? 'Alasan wajib diisi' : null,
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
        PosButton.danger(
          label: 'Void transaksi',
          size: PosButtonSize.md,
          onPressed: () {
            if (_form.currentState!.validate()) Navigator.pop(context, _reason.text.trim());
          },
        ),
      ],
    );
  }
}
