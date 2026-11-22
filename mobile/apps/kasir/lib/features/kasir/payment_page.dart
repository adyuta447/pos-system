import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

import 'cart_controller.dart';
import 'checkout_controller.dart';

class PaymentPage extends ConsumerStatefulWidget {
  const PaymentPage({super.key});

  @override
  ConsumerState<PaymentPage> createState() => _PaymentPageState();
}

class _PaymentPageState extends ConsumerState<PaymentPage> {
  var _method = PaymentMethod.cash;
  var _received = 0;

  /// Keranjang yang sedang dibayar; tetap tampil setelah keranjang dikosongkan oleh checkout.
  Cart? _paid;

  Future<void> _confirm() async {
    final cart = ref.read(cartProvider);
    if (_method == PaymentMethod.qrisManual && !await _askQrisPaid(cart.total)) {
      // Belum dibayar: kembali ke keranjang, tidak ada yang disimpan.
      if (mounted) context.pop();
      return;
    }
    setState(() => _paid = cart);
    try {
      final trx = await ref
          .read(checkoutProvider.notifier)
          .pay(_method, received: _method == PaymentMethod.cash ? _received : null);
      if (!mounted) return;
      await showDialog<void>(
        context: context,
        barrierDismissible: false,
        builder: (_) => _SuccessDialog(trx: trx),
      );
      if (mounted) context.pop();
    } on OutOfStockException catch (e) {
      if (!mounted) return;
      final name =
          cart.items.where((i) => i.productId == e.productId).firstOrNull?.name ?? 'Produk';
      final messenger = ScaffoldMessenger.of(context);
      context.pop();
      messenger.showSnackBar(
        SnackBar(
          content: Text(
            'Stok $name tidak cukup. Transaksi dibatalkan, item ditandai di keranjang.',
          ),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() => _paid = null);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Transaksi gagal disimpan: $e')));
    }
  }

  Future<bool> _askQrisPaid(int total) async {
    final paid = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (c) => IllustratedDialog(
        illustration: PosIllustration.paymentQris,
        title: 'Sudah dibayar?',
        body: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Pastikan dana sudah masuk ke rekening toko sejumlah'),
            const SizedBox(height: 8),
            PriceText(total, style: PosText.total),
          ],
        ),
        actions: [
          PosButton.secondary(label: 'Belum', onPressed: () => Navigator.pop(c, false)),
          PosButton.primary(label: 'Sudah', onPressed: () => Navigator.pop(c, true)),
        ],
      ),
    );
    return paid ?? false;
  }

  @override
  Widget build(BuildContext context) {
    final Cart cart = _paid ?? ref.watch(cartProvider);
    final busy = _paid != null;
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: SafeArea(
        child: SplitLayout(
          header: PageHeader(
            leading: IconButton(
              onPressed: busy ? null : () => context.pop(),
              icon: const Icon(LucideIcons.arrowLeft),
              color: PosColors.ink,
              tooltip: 'Kembali ke keranjang',
            ),
            title: 'Pembayaran',
            subtitle: '${cart.orderType} · ${cart.itemCount} item',
          ),
          left: Padding(
            padding: const EdgeInsets.all(24),
            child: PaymentSheet(
              total: cart.total,
              method: _method,
              onMethodChanged: (m) => setState(() => _method = m),
              received: _received,
              onReceivedChanged: (v) => setState(() => _received = v),
              onConfirm: _confirm,
              busy: busy,
            ),
          ),
          right: _Summary(cart: cart),
        ),
      ),
    );
  }
}

class _Summary extends StatelessWidget {
  const _Summary({required this.cart});
  final Cart cart;

  @override
  Widget build(BuildContext context) {
    final totals = cart.totals;
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
          child: Row(
            children: [
              Text('Ringkasan', style: PosText.heading),
              const Spacer(),
              Text('${cart.itemCount} item', style: PosText.subtitle),
            ],
          ),
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            children: [
              for (final i in cart.items) LineItem(name: i.name, price: i.price, qty: i.qty),
            ],
          ),
        ),
        const Divider(),
        Padding(
          padding: const EdgeInsets.all(20),
          child: TotalsSummary(
            subtotal: totals.subtotal,
            taxLabel: cart.taxLabel,
            tax: totals.tax,
            total: totals.total,
          ),
        ),
      ],
    );
  }
}

class _SuccessDialog extends StatelessWidget {
  const _SuccessDialog({required this.trx});
  final TransactionView trx;

  @override
  Widget build(BuildContext context) {
    return IllustratedDialog(
      illustration: PosIllustration.paymentSuccess,
      title: 'Pembayaran berhasil',
      body: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('${formatRupiah(trx.total)} dibayar dengan ${trx.method.label}'),
          Text('No. struk ${trx.receiptNo}', style: PosText.caption),
          if (trx.method == PaymentMethod.cash) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: PosColors.subtle,
                borderRadius: BorderRadius.circular(12),
              ),
              child: SummaryRow('Kembalian', formatRupiah(trx.change), strong: true),
            ),
          ],
        ],
      ),
      actions: [
        PosButton.primary(label: 'Transaksi baru', onPressed: () => Navigator.pop(context)),
      ],
    );
  }
}
