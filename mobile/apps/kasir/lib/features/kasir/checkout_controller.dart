import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pos_core/pos_core.dart';

import '../../app/providers.dart';
import '../../app/receipt_printer.dart';
import 'cart_controller.dart';

final checkoutProvider = AsyncNotifierProvider<CheckoutController, TransactionView?>(
  CheckoutController.new,
);

/// Simpan transaksi secara atomik, kosongkan keranjang, lalu cetak struk di background.
class CheckoutController extends AsyncNotifier<TransactionView?> {
  @override
  TransactionView? build() => null;

  /// Throws [OutOfStockException] (item ditandai di keranjang) atau error penyimpanan lain.
  Future<TransactionView> pay(PaymentMethod method, {int? received}) async {
    state = const AsyncLoading();
    final cart = ref.read(cartProvider);
    try {
      final trx = await ref
          .read(transactionRepositoryProvider)
          .checkout(cart, method, received: received);
      ref.read(cartProvider.notifier).clear();
      state = AsyncData(trx);
      // UI tidak menunggu printer; gagal cetak tidak membatalkan transaksi.
      unawaited(ref.read(receiptPrinterProvider).printTransaction(trx));
      return trx;
    } catch (e, st) {
      if (e is OutOfStockException) ref.read(cartProvider.notifier).markOutOfStock(e.productId);
      state = AsyncError(e, st);
      rethrow;
    }
  }
}
