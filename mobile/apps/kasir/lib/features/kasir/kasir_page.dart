import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

import '../../app/format.dart';
import '../../app/images.dart';
import '../../app/permission_gate.dart';
import '../../app/providers.dart';
import 'cart_controller.dart';

/// Layar kasir landscape: grid produk kiri, keranjang kanan.
class KasirPage extends ConsumerStatefulWidget {
  const KasirPage({super.key});

  @override
  ConsumerState<KasirPage> createState() => _KasirPageState();
}

class _KasirPageState extends ConsumerState<KasirPage> {
  String? _categoryId; // null = semua
  String _query = '';

  @override
  Widget build(BuildContext context) {
    return SplitLayout(
      header: _KasirHeader(onSearch: (v) => setState(() => _query = v)),
      left: _Catalog(
        categoryId: _categoryId,
        query: _query,
        onCategory: (id) => setState(() => _categoryId = id),
      ),
      right: const ConnectedCartPanel(),
    );
  }
}

class _KasirHeader extends ConsumerWidget {
  const _KasirHeader({required this.onSearch});
  final ValueChanged<String> onSearch;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final s = ref.watch(settingsProvider).value ?? const StoreSettings();
    return PageHeader(
      title: s.storeName.isEmpty ? 'Kasir' : s.storeName,
      subtitle: formatDate(DateTime.now()),
      trailing: [
        SearchField(hint: 'Cari produk atau SKU…', onChanged: onSearch),
        PosAvatar(name: s.userName, image: fileImage(s.userPhotoPath), radius: 18),
      ],
    );
  }
}

class _Catalog extends ConsumerWidget {
  const _Catalog({required this.categoryId, required this.query, required this.onCategory});
  final String? categoryId;
  final String query;
  final ValueChanged<String?> onCategory;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final all = ref.watch(productsProvider).value ?? const <ProductView>[];
    final categories = (ref.watch(categoriesProvider).value ?? const <CategoryView>[])
        .where((c) => c.active)
        .toList();
    final activeIds = {for (final c in categories) c.id};
    final sellable = all.where((p) => p.active && activeIds.contains(p.categoryId)).toList();
    final q = query.trim().toLowerCase();
    final visible = sellable
        .where(
          (p) =>
              (categoryId == null || p.categoryId == categoryId) &&
              (p.name.toLowerCase().contains(q) || (p.sku?.toLowerCase().contains(q) ?? false)),
        )
        .toList();
    final current = categories.where((c) => c.id == categoryId).firstOrNull;

    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              spacing: 8,
              children: [
                CategoryChip(
                  label: 'Semua',
                  count: sellable.length,
                  selected: current == null,
                  onTap: () => onCategory(null),
                ),
                for (final c in categories)
                  CategoryChip(
                    label: c.name,
                    count: sellable.where((p) => p.categoryId == c.id).length,
                    selected: c.id == current?.id,
                    onTap: () => onCategory(c.id),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Text(current?.name ?? 'Semua produk', style: PosText.heading),
              const SizedBox(width: 8),
              Text('${visible.length} item', style: PosText.bodyMuted),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: visible.isEmpty
                ? EmptyState(
                    title: all.isEmpty ? 'Belum ada produk' : 'Produk tidak ditemukan',
                    message: all.isEmpty
                        ? 'Tambahkan produk di menu Produk.'
                        : 'Coba kata kunci atau kategori lain.',
                  )
                : _Grid(products: visible),
          ),
        ],
      ),
    );
  }
}

/// Terpisah supaya hanya grid yang membaca jumlah per produk dari keranjang.
class _Grid extends ConsumerWidget {
  const _Grid({required this.products});
  final List<ProductView> products;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartProvider);
    return ProductGrid(
      products: products,
      qtyOf: cart.qtyOf,
      onTap: ref.read(cartProvider.notifier).add,
    );
  }
}

/// Menghubungkan [CartPanel] ke [cartProvider].
class ConnectedCartPanel extends ConsumerWidget {
  const ConnectedCartPanel({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.watch(cartProvider);
    final notifier = ref.read(cartProvider.notifier);
    final blocked = cart.items.any((i) => i.outOfStock);
    return CartPanel(
      cart: cart,
      onQtyChanged: notifier.setQty,
      onRemove: notifier.remove,
      header: Padding(
        padding: const EdgeInsets.fromLTRB(20, 16, 12, 8),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Pesanan baru', style: PosText.title),
                      const SizedBox(height: 2),
                      Text('${cart.itemCount} item', style: PosText.subtitle),
                    ],
                  ),
                ),
                if (!cart.isEmpty)
                  PosButton.ghost(
                    label: 'Kosongkan',
                    size: PosButtonSize.sm,
                    onPressed: notifier.clear,
                  ),
              ],
            ),
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: PosSegmented(
                labels: orderTypes,
                selected: orderTypes.indexOf(cart.orderType),
                onChanged: (i) => notifier.setOrderType(orderTypes[i]),
              ),
            ),
          ],
        ),
      ),
      actions: [
        PermissionGate(
          permission: Permission.processSale,
          child: PosButton.primary(
            label: cart.isEmpty ? 'Bayar' : 'Bayar ${formatRupiah(cart.total)}',
            expand: true,
            onPressed: cart.isEmpty || blocked ? null : () => context.push('/bayar'),
          ),
        ),
      ],
    );
  }
}
