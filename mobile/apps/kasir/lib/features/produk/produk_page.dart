import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:pos_core/pos_core.dart';
import 'package:pos_ui/pos_ui.dart';

import '../../app/format.dart';
import '../../app/images.dart';
import '../../app/permission_gate.dart';
import '../../app/providers.dart';
import 'category_dialog.dart';
import 'product_form.dart';
import 'stock_dialog.dart';

class ProdukPage extends ConsumerStatefulWidget {
  const ProdukPage({super.key});

  @override
  ConsumerState<ProdukPage> createState() => _ProdukPageState();
}

class _ProdukPageState extends ConsumerState<ProdukPage> {
  String _query = '';
  String? _selectedId;

  Future<void> _add() async {
    final id = await showDialog<String>(context: context, builder: (_) => const ProductForm());
    if (id != null) setState(() => _selectedId = id);
  }

  @override
  Widget build(BuildContext context) {
    final products = ref.watch(productsProvider).value ?? const <ProductView>[];
    final q = _query.trim().toLowerCase();
    final visible = products
        .where(
          (p) =>
              p.name.toLowerCase().contains(q) ||
              p.categoryName.toLowerCase().contains(q) ||
              (p.sku?.toLowerCase().contains(q) ?? false),
        )
        .toList();
    final selected = products.where((p) => p.id == _selectedId).firstOrNull ?? visible.firstOrNull;
    final active = products.where((p) => p.active);
    final low = active.where((p) => p.lowStock).length;
    final out = active.where((p) => p.soldOut).length;

    final header = PageHeader(
      title: 'Produk',
      subtitle: '${products.length} produk · $low menipis · $out habis',
      trailing: [
        SearchField(
          hint: 'Cari nama, kategori, SKU…',
          width: 220,
          onChanged: (v) => setState(() => _query = v),
        ),
        PermissionGate(
          permission: Permission.manageProducts,
          child: PosButton.secondary(
            label: 'Kategori',
            size: PosButtonSize.sm,
            onPressed: () =>
                showDialog<void>(context: context, builder: (_) => const CategoryDialog()),
          ),
        ),
        PermissionGate(
          permission: Permission.manageProducts,
          child: PosButton.primary(
            label: 'Tambah produk',
            icon: LucideIcons.plus,
            size: PosButtonSize.sm,
            onPressed: _add,
          ),
        ),
      ],
    );

    if (products.isEmpty) {
      return Column(
        children: [
          header,
          const Divider(),
          const Expanded(
            child: EmptyState(
              title: 'Belum ada produk',
              message: 'Tap Tambah produk untuk mulai berjualan.',
            ),
          ),
        ],
      );
    }
    return ListDetailLayout(
      header: header,
      list: Padding(
        padding: const EdgeInsets.fromLTRB(24, 12, 24, 0),
        child: DataTableCard(
          columns: const [
            PosColumn('Nama'),
            PosColumn('Kategori', width: 100),
            PosColumn('Harga', width: 92, alignEnd: true),
            PosColumn('Stok', width: 60, alignEnd: true),
            PosColumn('', width: 16),
            PosColumn('Status', width: 84),
          ],
          rowCount: visible.length,
          empty: const EmptyState(
            title: 'Produk tidak ditemukan',
            message: 'Coba kata kunci lain.',
          ),
          rowBuilder: (i) {
            final p = visible[i];
            return PosRow(
              selected: p.id == selected?.id,
              onTap: () => setState(() => _selectedId = p.id),
              cells: [
                Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(p.name, style: PosText.body.copyWith(fontWeight: FontWeight.w500)),
                    if (p.sku != null) Text('SKU ${p.sku}', style: PosText.caption),
                  ],
                ),
                Text(p.categoryName, style: PosText.bodyMuted),
                Text(formatRupiah(p.price), style: PosText.bodyStrong),
                Text('${p.stock}', style: PosText.bodyStrong),
                const SizedBox.shrink(),
                StockBadge(product: p),
              ],
            );
          },
        ),
      ),
      detail: selected == null ? const SizedBox.shrink() : _ProductDetail(product: selected),
    );
  }
}

class StockBadge extends StatelessWidget {
  const StockBadge({super.key, required this.product});
  final ProductView product;

  @override
  Widget build(BuildContext context) {
    final p = product;
    if (!p.active) return const PosBadge('Nonaktif');
    if (p.soldOut) return const PosBadge('Habis', tone: PosBadgeTone.danger);
    if (p.lowStock) return const PosBadge('Menipis', tone: PosBadgeTone.warning);
    return const PosBadge('Aman', tone: PosBadgeTone.success);
  }
}

class _ProductDetail extends ConsumerWidget {
  const _ProductDetail({required this.product});
  final ProductView product;

  Future<void> _delete(BuildContext context, WidgetRef ref) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (c) => IllustratedDialog(
        illustration: PosIllustration.warning,
        title: 'Hapus ${product.name}?',
        body: const Text('Produk belum pernah terjual, jadi bisa dihapus dari daftar.'),
        actions: [
          PosButton.secondary(
            label: 'Batal',
            size: PosButtonSize.md,
            onPressed: () => Navigator.pop(c, false),
          ),
          PosButton.danger(
            label: 'Hapus',
            size: PosButtonSize.md,
            onPressed: () => Navigator.pop(c, true),
          ),
        ],
      ),
    );
    if (ok != true) return;
    try {
      await ref.read(catalogRepositoryProvider).deleteProduct(product.id);
    } on StateError catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final p = product;
    final movements = ref.watch(movementsProvider(p.id)).value ?? const <StockMovementView>[];
    final repo = ref.read(catalogRepositoryProvider);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
          child: Row(
            children: [
              if (fileImage(p.photoPath) case final img?) ...[
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Image(
                    image: img,
                    width: 56,
                    height: 56,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => const SizedBox.shrink(),
                  ),
                ),
                const SizedBox(width: 12),
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(p.name, style: PosText.title),
                    const SizedBox(height: 2),
                    Text(
                      [p.categoryName, if (p.sku != null) 'SKU ${p.sku}'].join(' · '),
                      style: PosText.subtitle,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
          child: Column(
            spacing: 8,
            children: [
              SummaryRow('Harga', formatRupiah(p.price)),
              SummaryRow('Stok', '${p.stock}'),
              SummaryRow('Batas minimum', '${p.minStock}'),
              Row(
                children: [
                  Text('Status', style: PosText.bodyMuted),
                  const Spacer(),
                  StockBadge(product: p),
                ],
              ),
            ],
          ),
        ),
        const Divider(),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 4),
          child: Text('Riwayat stok', style: PosText.heading),
        ),
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            itemCount: movements.length,
            separatorBuilder: (_, _) => const Divider(),
            itemBuilder: (_, i) => _MovementRow(movement: movements[i]),
          ),
        ),
        const Divider(),
        PermissionGate(
          permission: Permission.manageProducts,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              spacing: 8,
              children: [
                Row(
                  spacing: 8,
                  children: [
                    Expanded(
                      child: PosButton.secondary(
                        label: 'Edit',
                        size: PosButtonSize.sm,
                        onPressed: () => showDialog<String>(
                          context: context,
                          builder: (_) => ProductForm(product: p),
                        ),
                      ),
                    ),
                    Expanded(
                      child: PermissionGate(
                        permission: Permission.manageStock,
                        child: PosButton.secondary(
                          label: 'Ubah stok',
                          size: PosButtonSize.sm,
                          expand: true,
                          onPressed: () => showDialog<void>(
                            context: context,
                            builder: (_) => StockDialog(product: p),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                Row(
                  spacing: 8,
                  children: [
                    Expanded(
                      child: PosButton.ghost(
                        label: p.active ? 'Nonaktifkan' : 'Aktifkan',
                        size: PosButtonSize.sm,
                        onPressed: () => repo.setProductActive(p.id, !p.active),
                      ),
                    ),
                    // PRD: produk yang sudah terjual hanya bisa dinonaktifkan.
                    if (!p.hasSales)
                      Expanded(
                        child: PosButton.danger(
                          label: 'Hapus',
                          size: PosButtonSize.sm,
                          onPressed: () => _delete(context, ref),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _MovementRow extends StatelessWidget {
  const _MovementRow({required this.movement});
  final StockMovementView movement;

  @override
  Widget build(BuildContext context) {
    final m = movement;
    final change = m.qtyChange > 0 ? '+${m.qtyChange}' : '${m.qtyChange}';
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(m.type.label, style: PosText.body.copyWith(fontWeight: FontWeight.w500)),
                Text(
                  [formatDate(m.createdAt), formatTime(m.createdAt), ?m.note].join(' · '),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: PosText.caption,
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                change,
                style: PosText.bodyStrong.copyWith(
                  color: m.qtyChange < 0 ? PosColors.red : PosColors.green,
                ),
              ),
              Text('sisa ${m.stockAfter}', style: PosText.caption),
            ],
          ),
        ],
      ),
    );
  }
}
