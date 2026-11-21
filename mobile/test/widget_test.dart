import 'package:flutter_test/flutter_test.dart';

import 'package:pos_kasir/main.dart';

void main() {
  testWidgets('app opens on the Kasir home screen', (tester) async {
    await tester.pumpWidget(const KasirApp());
    expect(find.text('Kasir'), findsOneWidget);
    expect(find.text('Template app kasir siap.'), findsOneWidget);
  });
}
