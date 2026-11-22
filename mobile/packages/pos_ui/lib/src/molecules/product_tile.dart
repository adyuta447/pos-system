import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';

import '../atoms/price_text.dart';
import '../tokens/pos_colors.dart';
import '../tokens/pos_text.dart';

/// Kartu produk di grid kasir, tanpa gambar. Produk stok 0 tidak bisa ditap.
class ProductTile extends StatelessWidget {
  const ProductTile({super.key, required this.product, this.qty = 0, required this.onTap});
  final ProductView product;
  final int qty;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = product;
    final selected = qty > 0;
    final fg = p.soldOut ? PosColors.muted : PosColors.ink;
    final radius = BorderRadius.circular(12);
    return Material(
      color: p.soldOut ? const Color(0xFFFAFAFA) : PosColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: radius,
        side: BorderSide(
          color: selected ? PosColors.ink : PosColors.line,
          width: selected ? 1.5 : 1,
        ),
      ),
      child: InkWell(
        borderRadius: radius,
        onTap: p.soldOut ? null : onTap,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      p.name,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: PosText.itemName.copyWith(color: fg),
                    ),
                  ),
                  if (selected) _QtyDot(qty),
                ],
              ),
              const Spacer(),
              Row(
                children: [
                  PriceText(p.price, style: PosText.price.copyWith(color: fg)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      p.soldOut
                          ? 'Habis'
                          : p.lowStock
                          ? 'Sisa ${p.stock}'
                          : 'Stok ${p.stock}',
                      textAlign: TextAlign.right,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: PosText.caption.copyWith(
                        color: p.soldOut
                            ? PosColors.red
                            : p.lowStock
                            ? PosColors.amber
                            : PosColors.muted,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _QtyDot extends StatelessWidget {
  const _QtyDot(this.qty);
  final int qty;

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minWidth: 22),
      height: 22,
      margin: const EdgeInsets.only(left: 8),
      padding: const EdgeInsets.symmetric(horizontal: 6),
      alignment: Alignment.center,
      decoration: BoxDecoration(color: PosColors.ink, borderRadius: BorderRadius.circular(11)),
      child: Text(
        '$qty',
        style: PosText.caption.copyWith(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
      ),
    );
  }
}
