import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';

import '../molecules/qty_stepper.dart';
import '../molecules/totals_summary.dart';
import '../tokens/pos_colors.dart';
import '../tokens/pos_text.dart';

/// Keranjang: [header], daftar item dengan stepper, ringkasan total, lalu [actions].
class CartPanel extends StatelessWidget {
  const CartPanel({
    super.key,
    required this.cart,
    required this.onQtyChanged,
    required this.onRemove,
    this.header,
    this.actions = const [],
  });
  final Cart cart;
  final void Function(String productId, int qty) onQtyChanged;
  final ValueChanged<String> onRemove;
  final Widget? header;
  final List<Widget> actions;

  @override
  Widget build(BuildContext context) {
    final totals = cart.totals;
    return Column(
      children: [
        ?header,
        Expanded(
          child: cart.isEmpty
              ? Center(
                  child: Text(
                    'Belum ada item.\nKetuk produk untuk menambahkan.',
                    textAlign: TextAlign.center,
                    style: PosText.bodyMuted.copyWith(height: 1.5),
                  ),
                )
              : ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: cart.items.length,
                  separatorBuilder: (_, _) => const Divider(),
                  itemBuilder: (_, i) {
                    final item = cart.items[i];
                    return _CartLine(
                      item: item,
                      onMinus: () => item.qty <= 1
                          ? onRemove(item.productId)
                          : onQtyChanged(item.productId, item.qty - 1),
                      onPlus: item.qty < item.stock
                          ? () => onQtyChanged(item.productId, item.qty + 1)
                          : null,
                    );
                  },
                ),
        ),
        const Divider(),
        Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              TotalsSummary(
                subtotal: totals.subtotal,
                taxLabel: cart.taxLabel,
                tax: totals.tax,
                total: totals.total,
              ),
              for (final a in actions) ...[const SizedBox(height: 12), a],
            ],
          ),
        ),
      ],
    );
  }
}

class _CartLine extends StatelessWidget {
  const _CartLine({required this.item, required this.onMinus, required this.onPlus});
  final CartItem item;
  final VoidCallback onMinus;
  final VoidCallback? onPlus;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(child: Text(item.name, style: PosText.itemName)),
              Text(
                formatRupiah(item.lineTotal),
                style: PosText.price.copyWith(fontWeight: FontWeight.w600),
              ),
            ],
          ),
          if (item.outOfStock)
            Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Text(
                'Stok tidak cukup, sisa ${item.stock}',
                style: PosText.caption.copyWith(color: PosColors.red, fontWeight: FontWeight.w600),
              ),
            ),
          const SizedBox(height: 4),
          Row(
            children: [
              Text('${item.qty} × ${formatRupiah(item.price)}', style: PosText.subtitle),
              const Spacer(),
              QtyStepper(qty: item.qty, onMinus: onMinus, onPlus: onPlus),
            ],
          ),
        ],
      ),
    );
  }
}
