import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';

import '../tokens/pos_text.dart';

class PriceText extends StatelessWidget {
  const PriceText(this.amount, {super.key, this.style, this.textAlign});
  final int amount;
  final TextStyle? style;
  final TextAlign? textAlign;

  @override
  Widget build(BuildContext context) =>
      Text(formatRupiah(amount), style: style ?? PosText.price, textAlign: textAlign);
}
