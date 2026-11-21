import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';

import '../molecules/product_tile.dart';

/// Grid produk 2 kolom di layar kasir.
class ProductGrid extends StatelessWidget {
  const ProductGrid({super.key, required this.products, required this.qtyOf, required this.onTap});
  final List<ProductView> products;
  final int Function(String productId) qtyOf;
  final ValueChanged<ProductView> onTap;

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.only(bottom: 24),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        mainAxisExtent: 104,
      ),
      itemCount: products.length,
      itemBuilder: (_, i) {
        final p = products[i];
        return ProductTile(product: p, qty: qtyOf(p.id), onTap: () => onTap(p));
      },
    );
  }
}
