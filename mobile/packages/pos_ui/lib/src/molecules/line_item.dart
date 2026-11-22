import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';

import '../tokens/pos_text.dart';

/// Satu produk terjual: nama, "qty × harga", dan total baris.
class LineItem extends StatelessWidget {
  const LineItem({super.key, required this.name, required this.price, required this.qty});
  final String name;
  final int price;
  final int qty;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: PosText.body.copyWith(fontWeight: FontWeight.w500)),
                const SizedBox(height: 2),
                Text('$qty × ${formatRupiah(price)}', style: PosText.caption),
              ],
            ),
          ),
          Text(formatRupiah(price * qty), style: PosText.bodyStrong),
        ],
      ),
    );
  }
}
