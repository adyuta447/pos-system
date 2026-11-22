import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pos_core/pos_core.dart';

import '../../app/providers.dart';

final cartProvider = NotifierProvider<CartController, Cart>(CartController.new);

class CartController extends Notifier<Cart> {
  @override
  Cart build() {
    // listen, bukan watch: perubahan pajak atau stok tidak boleh mengosongkan keranjang.
    ref.listen(settingsProvider, (_, next) {
      if (next.value case final s?) state = state.copyWith(tax: s.tax);
    });
    ref.listen(productsProvider, (_, next) {
      if (next.value case final products?) _sync(products);
    });
    return Cart(tax: ref.read(settingsProvider).value?.tax ?? const TaxSettings());
  }

  void add(ProductView p) {
    if (!p.active || p.soldOut) return;
    final qty = state.qtyOf(p.id);
    if (qty >= p.stock) return;
    if (qty == 0) {
      state = state.copyWith(
        items: [
          ...state.items,
          CartItem(productId: p.id, name: p.name, price: p.price, qty: 1, stock: p.stock),
        ],
      );
    } else {
      setQty(p.id, qty + 1);
    }
  }

  void setQty(String productId, int qty) {
    if (qty <= 0) return remove(productId);
    state = state.copyWith(
      items: [
        for (final i in state.items)
          if (i.productId == productId) i.copyWith(qty: qty, outOfStock: qty > i.stock) else i,
      ],
    );
  }

  void remove(String productId) =>
      state = state.copyWith(items: [...state.items.where((i) => i.productId != productId)]);

  void setOrderType(String type) => state = state.copyWith(orderType: type);

  void clear() => state = state.copyWith(items: const []);

  /// Dipanggil saat checkout ditolak karena stok tidak cukup.
  void markOutOfStock(String productId) => state = state.copyWith(
    items: [
      for (final i in state.items) i.productId == productId ? i.copyWith(outOfStock: true) : i,
    ],
  );

  /// Produk diubah di halaman Produk: perbarui nama, harga, stok; buang yang dihapus atau nonaktif.
  void _sync(List<ProductView> products) {
    if (state.isEmpty) return;
    final byId = {for (final p in products) p.id: p};
    state = state.copyWith(
      items: [
        for (final i in state.items)
          if (byId[i.productId] case final p? when p.active)
            i.copyWith(name: p.name, price: p.price, stock: p.stock, outOfStock: i.qty > p.stock),
      ],
    );
  }
}
