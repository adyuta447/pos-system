import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';

import '../atoms/pos_button.dart';
import '../molecules/amount_key.dart';
import '../molecules/pos_segmented.dart';
import '../tokens/pos_colors.dart';
import '../tokens/pos_text.dart';

/// Input pembayaran Tunai (nominal cepat + keypad) atau QRIS konfirmasi manual.
class PaymentSheet extends StatelessWidget {
  const PaymentSheet({
    super.key,
    required this.total,
    required this.method,
    required this.onMethodChanged,
    required this.received,
    required this.onReceivedChanged,
    required this.onConfirm,
    this.busy = false,
  });
  final int total;
  final PaymentMethod method;
  final ValueChanged<PaymentMethod> onMethodChanged;
  final int received;
  final ValueChanged<int> onReceivedChanged;
  final VoidCallback onConfirm;
  final bool busy;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 320,
          child: PosSegmented(
            labels: [for (final m in PaymentMethod.values) m.label],
            selected: method.index,
            onChanged: (i) => onMethodChanged(PaymentMethod.values[i]),
          ),
        ),
        const SizedBox(height: 20),
        Expanded(
          child: method == PaymentMethod.cash
              ? _CashInput(total: total, received: received, onChanged: onReceivedChanged)
              : _QrisInfo(total: total),
        ),
        const SizedBox(height: 16),
        PosButton.primary(
          label: busy ? 'Menyimpan…' : 'Konfirmasi pembayaran',
          expand: true,
          onPressed: busy || (method == PaymentMethod.cash && received < total) ? null : onConfirm,
        ),
      ],
    );
  }
}

class _CashInput extends StatelessWidget {
  const _CashInput({required this.total, required this.received, required this.onChanged});
  final int total;
  final int received;
  final ValueChanged<int> onChanged;

  static const _keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['000', '0', '⌫'],
  ];

  void _key(String k) {
    if (k == '⌫') return onChanged(received ~/ 10);
    final next = int.parse('$received$k');
    if (next < 1000000000) onChanged(next);
  }

  @override
  Widget build(BuildContext context) {
    final enough = received >= total;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Uang diterima', style: PosText.bodyMuted),
                const SizedBox(height: 4),
                FittedBox(child: Text(formatRupiah(received), style: PosText.amount)),
                const SizedBox(height: 6),
                Text(
                  enough
                      ? 'Kembalian ${formatRupiah(calculateChange(received: received, total: total))}'
                      : 'Kurang ${formatRupiah(total - received)}',
                  style: PosText.button.copyWith(color: enough ? PosColors.green : PosColors.red),
                ),
                const SizedBox(height: 20),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    for (final amount in quickCashAmounts)
                      _QuickCash(
                        label: amount == null ? 'Uang pas' : formatRupiah(amount),
                        selected: received == (amount ?? total),
                        onTap: () => onChanged(amount ?? total),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 16),
        SizedBox(
          width: 270,
          child: Column(
            children: [
              for (final row in _keys)
                Expanded(
                  child: Row(
                    children: [
                      for (final k in row)
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.all(4),
                            child: AmountKey(k, onTap: () => _key(k)),
                          ),
                        ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class _QuickCash extends StatelessWidget {
  const _QuickCash({required this.label, required this.selected, required this.onTap});
  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? PosColors.ink : PosColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
        side: BorderSide(color: selected ? PosColors.ink : PosColors.line),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(10),
        onTap: onTap,
        child: SizedBox(
          height: 48,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(
              widthFactor: 1,
              child: Text(
                label,
                style: PosText.bodyStrong.copyWith(color: selected ? Colors.white : PosColors.ink),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _QrisInfo extends StatelessWidget {
  const _QrisInfo({required this.total});
  final int total;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Total yang harus dibayar', style: PosText.bodyMuted),
          const SizedBox(height: 4),
          Text(formatRupiah(total), style: PosText.amount),
          const SizedBox(height: 12),
          Text(
            'Minta pelanggan scan QRIS toko (stiker atau standee di meja kasir) dan bayar sejumlah total. '
            'Cek notifikasi dana masuk di HP atau aplikasi bank, lalu tap Konfirmasi pembayaran.',
            style: PosText.bodyMuted.copyWith(fontSize: 15, height: 1.5),
          ),
        ],
      ),
    );
  }
}
