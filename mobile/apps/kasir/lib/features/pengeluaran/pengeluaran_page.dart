import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

import '../../app/format.dart';
import '../../app/providers.dart';

class PengeluaranPage extends ConsumerStatefulWidget {
  const PengeluaranPage({super.key});

  @override
  ConsumerState<PengeluaranPage> createState() => _PengeluaranPageState();
}

class _PengeluaranPageState extends ConsumerState<PengeluaranPage> {
  var _day = dateOnly(DateTime.now());

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
    setState(() => _day = dateOnly(picked));
  }

  Future<void> _openForm([ExpenseView? existing]) async {
    final saved = await showDialog<bool>(
      context: context,
      builder: (_) => _ExpenseFormDialog(day: _day, existing: existing),
    );
    if (saved == true && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(existing == null ? 'Pengeluaran dicatat.' : 'Pengeluaran diperbarui.'),
        ),
      );
    }
  }

  Future<void> _confirmDelete(ExpenseView expense) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => _DeleteExpenseDialog(expense: expense),
    );
    if (confirmed != true) return;
    await ref.read(expenseRepositoryProvider).delete(expense.id);
    if (mounted) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Pengeluaran dihapus.')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final today = dateOnly(DateTime.now());
    final list = ref.watch(expensesByDateProvider(_day));
    final expenses = list.value ?? const <ExpenseView>[];

    final header = PageHeader(
      title: 'Pengeluaran',
      subtitle: '${_day == today ? 'Hari ini · ' : ''}${formatDate(_day)}',
      trailing: [
        PosButton.secondary(
          label: 'Ganti tanggal',
          icon: LucideIcons.calendar,
          size: PosButtonSize.sm,
          onPressed: _pickDay,
        ),
        PosButton.primary(
          label: 'Tambah pengeluaran',
          icon: LucideIcons.plus,
          size: PosButtonSize.sm,
          onPressed: () => _openForm(),
        ),
      ],
    );

    if (expenses.isEmpty) {
      return Column(
        children: [
          header,
          const Divider(),
          Expanded(
            child: list.isLoading
                ? const Center(child: CircularProgressIndicator())
                : const EmptyState(
                    illustration: PosIllustration.historyEmpty,
                    title: 'Belum ada pengeluaran',
                    message: 'Catat belanja bahan, ongkos logistik, atau biaya operasional harian di sini.',
                  ),
          ),
        ],
      );
    }

    int sum(Iterable<ExpenseView> items) => items.fold(0, (s, e) => s + e.amount);
    final total = sum(expenses);
    final totalCash = sum(expenses.where((e) => e.source == ExpensePaymentSource.cash));
    final totalNonCash = sum(expenses.where((e) => e.source == ExpensePaymentSource.nonCash));

    return Column(
      children: [
        header,
        const Divider(),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 20, 24, 20),
            child: Column(
              children: [
                Row(
                  spacing: 12,
                  children: [
                    Expanded(
                      child: StatCard(label: 'Total pengeluaran', value: formatRupiah(total)),
                    ),
                    Expanded(
                      child: StatCard(label: 'Tunai (Laci)', value: formatRupiah(totalCash)),
                    ),
                    Expanded(
                      child: StatCard(label: 'Non-tunai', value: formatRupiah(totalNonCash)),
                    ),
                    Expanded(
                      child: StatCard(label: 'Jumlah catatan', value: '${expenses.length}'),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Expanded(
                  child: DataTableCard(
                    columns: const [
                      PosColumn('Waktu', width: 64),
                      PosColumn('Kategori / Variabel', width: 150),
                      PosColumn('Item / Rincian', width: 170),
                      PosColumn('Catatan'),
                      PosColumn('Sumber kas', width: 120),
                      PosColumn('Nominal', width: 120, alignEnd: true),
                      PosColumn('Aksi', width: 96, alignEnd: true),
                    ],
                    rowCount: expenses.length,
                    rowBuilder: (i) {
                      final e = expenses[i];
                      return PosRow(
                        onTap: () => _openForm(e),
                        cells: [
                          Text(formatTime(e.createdAt), style: PosText.bodyMuted),
                          Text(e.category, style: PosText.bodyStrong),
                          Text(
                            e.item ?? '—',
                            style: e.item == null ? PosText.bodyMuted : PosText.bodyStrong,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            e.note ?? '—',
                            style: e.note == null ? PosText.bodyMuted : PosText.body,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          PosBadge(
                            e.source.label,
                            tone: e.source == ExpensePaymentSource.cash
                                ? PosBadgeTone.warning
                                : PosBadgeTone.neutral,
                          ),
                          Text(formatRupiah(e.amount), style: PosText.bodyStrong),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              IconButton(
                                tooltip: 'Ubah',
                                icon: const Icon(LucideIcons.pencil, size: 16),
                                onPressed: () => _openForm(e),
                              ),
                              IconButton(
                                tooltip: 'Hapus',
                                icon: const Icon(LucideIcons.trash2, size: 16, color: PosColors.red),
                                onPressed: () => _confirmDelete(e),
                              ),
                            ],
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
      ],
    );
  }
}

class _ExpenseFormDialog extends ConsumerStatefulWidget {
  const _ExpenseFormDialog({required this.day, this.existing});
  final DateTime day;
  final ExpenseView? existing;

  @override
  ConsumerState<_ExpenseFormDialog> createState() => _ExpenseFormDialogState();
}

class _ExpenseFormDialogState extends ConsumerState<_ExpenseFormDialog> {
  final _form = GlobalKey<FormState>();
  late String _category;
  late final TextEditingController _item;
  late final TextEditingController _amount;
  late final TextEditingController _note;
  late ExpensePaymentSource _source;
  List<String> _recentItems = const [];
  var _saving = false;

  static (String label, String hint) _itemMeta(String category) => switch (category) {
    'Bahan baku' => ('Nama bahan baku', 'Contoh: Susu UHT, Gula aren, Biji kopi'),
    'Logistik' => ('Keperluan logistik', 'Contoh: Ongkir, Bensin, Kurir'),
    'Operasional' => ('Keperluan operasional', 'Contoh: Listrik, Air, Internet'),
    'Kemasan' => ('Jenis kemasan', 'Contoh: Cup 16oz, Sedotan, Plastik'),
    _ => ('Keterangan item', 'Contoh: Peralatan, Biaya lain'),
  };

  @override
  void initState() {
    super.initState();
    final e = widget.existing;
    _category = e?.category ?? expenseCategoryPresets.first;
    _item = TextEditingController(text: e?.item ?? '');
    _note = TextEditingController(text: e?.note ?? '');
    _amount = TextEditingController(text: e != null ? formatThousands(e.amount) : '');
    _source = e?.source ?? ExpensePaymentSource.cash;
    _loadRecentItems(_category);
  }

  Future<void> _loadRecentItems(String category) async {
    final items = await ref.read(expenseRepositoryProvider).recentItemsByCategory(category);
    if (!mounted || _category != category) return;
    setState(() => _recentItems = items);
  }

  @override
  void dispose() {
    _item.dispose();
    _amount.dispose();
    _note.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_form.currentState!.validate() || _saving) return;
    setState(() => _saving = true);
    try {
      await ref.read(expenseRepositoryProvider).save(
            id: widget.existing?.id,
            category: _category,
            amount: parseFormattedInt(_amount.text) ?? 0,
            source: _source,
            date: widget.day,
            item: _item.text.trim(),
            note: _note.text.trim(),
          );
      if (mounted) Navigator.pop(context, true);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  List<String> _buildSuggestions() {
    final seen = <String>{};
    final result = <String>[];
    void addAll(Iterable<String> source) {
      for (final s in source) {
        final trimmed = s.trim();
        if (trimmed.isEmpty) continue;
        if (seen.add(trimmed.toLowerCase())) result.add(trimmed);
      }
    }

    if (_category == 'Bahan baku') {
      final products = ref.watch(productsProvider).value ?? const <ProductView>[];
      addAll(products.where((p) => p.active).map((p) => p.name));
    }
    addAll(_recentItems);

    final query = _item.text.trim().toLowerCase();
    if (query.isEmpty) return result;
    return [
      for (final s in result)
        if (s.toLowerCase().contains(query)) s,
    ];
  }

  @override
  Widget build(BuildContext context) {
    final categories = [
      ...expenseCategoryPresets,
      if (!expenseCategoryPresets.contains(_category)) _category,
    ];
    final (itemLabel, itemHint) = _itemMeta(_category);
    final suggestions = _buildSuggestions();
    return PosFormDialog(
      title: widget.existing == null ? 'Tambah pengeluaran' : 'Ubah pengeluaran',
      body: Form(
        key: _form,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            DropdownButtonFormField<String>(
              initialValue: _category,
              decoration: const InputDecoration(
                labelText: 'Kategori / variabel pengeluaran',
              ),
              dropdownColor: PosColors.surface,
              items: [
                for (final preset in categories)
                  DropdownMenuItem(value: preset, child: Text(preset)),
              ],
              onChanged: (v) {
                if (v == null || v == _category) return;
                setState(() {
                  _category = v;
                  _recentItems = const [];
                });
                _loadRecentItems(v);
              },
              validator: (v) => (v ?? '').trim().isEmpty ? 'Kategori wajib diisi' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _item,
              autofocus: widget.existing == null,
              textCapitalization: TextCapitalization.words,
              decoration: InputDecoration(
                labelText: itemLabel,
                hintText: itemHint,
              ),
              onChanged: (_) => setState(() {}),
              validator: (v) => (v ?? '').trim().isEmpty ? '$itemLabel wajib diisi' : null,
            ),
            if (suggestions.isNotEmpty) ...[
              const SizedBox(height: 10),
              SizedBox(
                height: 38,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: suggestions.length,
                  separatorBuilder: (_, _) => const SizedBox(width: 8),
                  itemBuilder: (_, i) {
                    final suggestion = suggestions[i];
                    return ChoiceChip(
                      label: Text(suggestion),
                      selected: _item.text.trim().toLowerCase() == suggestion.toLowerCase(),
                      onSelected: (_) => setState(() => _item.text = suggestion),
                    );
                  },
                ),
              ),
            ],
            const SizedBox(height: 16),
            TextFormField(
              controller: _amount,
              keyboardType: TextInputType.number,
              inputFormatters: [ThousandsInputFormatter()],
              decoration: const InputDecoration(
                labelText: 'Nominal (Rp)',
                prefixText: 'Rp ',
              ),
              validator: (v) {
                final n = parseFormattedInt(v) ?? 0;
                return n <= 0 ? 'Nominal harus lebih dari 0' : null;
              },
            ),
            const SizedBox(height: 16),
            Text('Sumber kas', style: PosText.subtitle),
            const SizedBox(height: 8),
            PosSegmented(
              labels: [for (final s in ExpensePaymentSource.values) s.label],
              selected: ExpensePaymentSource.values.indexOf(_source),
              onChanged: (i) => setState(() => _source = ExpensePaymentSource.values[i]),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _note,
              maxLines: 2,
              decoration: const InputDecoration(
                labelText: 'Catatan (opsional)',
                hintText: 'Contoh: Beli es batu 2 bal',
              ),
            ),
          ],
        ),
      ),
      actions: [
        PosButton.secondary(
          label: 'Batal',
          size: PosButtonSize.md,
          onPressed: () => Navigator.pop(context, false),
        ),
        PosButton.primary(
          label: _saving ? 'Menyimpan...' : 'Simpan',
          size: PosButtonSize.md,
          onPressed: _saving ? null : _submit,
        ),
      ],
    );
  }
}

class _DeleteExpenseDialog extends StatelessWidget {
  const _DeleteExpenseDialog({required this.expense});
  final ExpenseView expense;

  @override
  Widget build(BuildContext context) {
    return PosFormDialog(
      title: 'Hapus pengeluaran?',
      body: Text(
        'Catatan "${expense.category}" sebesar ${formatRupiah(expense.amount)} '
        'akan dihapus dari laporan tanggal ini.',
        style: PosText.bodyMuted.copyWith(height: 1.5),
      ),
      actions: [
        PosButton.secondary(
          label: 'Batal',
          size: PosButtonSize.md,
          onPressed: () => Navigator.pop(context, false),
        ),
        PosButton.danger(
          label: 'Hapus',
          size: PosButtonSize.md,
          onPressed: () => Navigator.pop(context, true),
        ),
      ],
    );
  }
}
