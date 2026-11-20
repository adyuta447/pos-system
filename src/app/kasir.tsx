import { Redirect, router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CartBar from '@/components/kasir/cart-bar';
import CartPanel from '@/components/kasir/cart-panel';
import DiscountSheet from '@/components/kasir/discount-sheet';
import KasirHeader from '@/components/kasir/kasir-header';
import LastOrderCard, { type CompletedOrder } from '@/components/kasir/last-order-card';
import MenuPanel from '@/components/kasir/menu-panel';
import ModifierSheet from '@/components/kasir/modifier-sheet';
import PaySheet from '@/components/kasir/pay-sheet';
import ReceiptPaper from '@/components/ui/receipt-paper';
import Sheet from '@/components/ui/sheet';
import Toast from '@/components/ui/toast';
import { type ModifierGroup, type Product, type ProductInfo, setProductAvailable } from '@/db/catalog';
import { getReceiptLines, saveOrder } from '@/db/orders';
import useCart from '@/hooks/use-cart';
import useCatalog from '@/hooks/use-catalog';
import useFocusedStore from '@/hooks/use-focused-store';
import useToast from '@/hooks/use-toast';
import type { CartLine, CartModifier, PaymentMethod } from '@/lib/cart';
import { isPrinterReady, printLines, shareReceipt } from '@/lib/printer';
import { useSession } from '@/providers/session-provider';

const CART_WIDTH = 400;
const TABLET_MIN_WIDTH = 768;

interface ModifierEditor {
  product: ProductInfo;
  groups: ModifierGroup[];
  /** Set when editing an existing cart line. */
  line?: CartLine;
}

export default function KasirScreen() {
  const db = useSQLiteContext();
  const { user, shift } = useSession();
  const { width } = useWindowDimensions();
  const store = useFocusedStore();
  const { catalog, refresh: refreshCatalog } = useCatalog();
  const cart = useCart(store.taxPercent);
  const [toast, showToast] = useToast();

  const [modifierEditor, setModifierEditor] = useState<ModifierEditor | null>(null);
  const [isPayOpen, setPayOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isDiscountOpen, setDiscountOpen] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<string[] | null>(null);
  const [lastOrder, setLastOrder] = useState<CompletedOrder | null>(null);
  const isSaving = useRef(false);

  if (!user || !shift) return <Redirect href="/" />;

  const isTablet = width >= TABLET_MIN_WIDTH;
  const groupsOf = (productId: string) => catalog.modifiersByProduct.get(productId) ?? [];

  const handleProductPress = (product: Product) => {
    if (!product.isAvailable) return showToast(`${product.name} habis. Tekan lama untuk tersedia lagi.`);
    const groups = groupsOf(product.id);
    // Popup only for required modifiers (spec 3.1); optional ones are set by tapping the cart line.
    if (groups.some((g) => g.required)) setModifierEditor({ product, groups });
    else cart.addItem(product);
  };

  const handleProductLongPress = (product: Product) => {
    setProductAvailable(db, product.id, !product.isAvailable);
    refreshCatalog();
    showToast(product.isAvailable ? `${product.name} ditandai habis` : `${product.name} tersedia lagi`);
  };

  const handleEditLine = (line: CartLine) => {
    const product = catalog.products.find((p) => p.id === line.productId) ?? { id: line.productId, name: line.name, price: line.unitPrice };
    setModifierEditor({ product, groups: groupsOf(line.productId), line });
  };

  const handleModifierSubmit = (modifiers: CartModifier[], note: string) => {
    if (!modifierEditor) return;
    if (modifierEditor.line) cart.updateItem(modifierEditor.line.key, modifiers, note);
    else cart.addItem(modifierEditor.product, modifiers, note);
    setModifierEditor(null);
  };

  const handleRemoveLine = (line: CartLine) => {
    cart.removeItem(line.key);
    setModifierEditor(null);
  };

  const handlePaid = async (method: PaymentMethod, cashReceived: number | null) => {
    if (isSaving.current) return; // a double tap must not save the order twice
    isSaving.current = true;
    try {
      const { id, orderNo } = saveOrder(db, {
        storeId: store.id,
        shiftId: shift.id,
        userId: user.id,
        orderType: cart.orderType,
        lines: cart.lines,
        discountName: cart.discount?.name ?? null,
        ...cart.totals,
        method,
        cashReceived,
      });
      const change = method === 'cash' && cashReceived !== null ? cashReceived - cart.totals.total : 0;
      const completed: CompletedOrder = { id, orderNo, method, change, printed: false };

      // Straight back to a new order, no confirmation screen (spec 3.1).
      cart.clear();
      setPayOpen(false);
      setCartOpen(false);
      setLastOrder(completed);
      const printed = await printLines(getReceiptLines(db, id));
      setLastOrder({ ...completed, printed });
    } finally {
      isSaving.current = false;
    }
  };

  const handleReprint = async () => {
    if (!lastOrder) return;
    const printed = await printLines(getReceiptLines(db, lastOrder.id));
    setLastOrder({ ...lastOrder, printed });
    if (!printed) showToast('Printer belum tersambung. Cek di Pengaturan.');
  };

  const cartPanel = (
    <CartPanel
      lines={cart.lines}
      orderType={cart.orderType}
      discount={cart.discount}
      totals={cart.totals}
      taxPercent={store.taxPercent}
      emptyContent={
        lastOrder && (
          <LastOrderCard
            order={lastOrder}
            onReprint={handleReprint}
            onPreview={() => setReceiptPreview(getReceiptLines(db, lastOrder.id))}
            onShare={() => shareReceipt(getReceiptLines(db, lastOrder.id))}
          />
        )
      }
      onOrderTypeChange={cart.setOrderType}
      onEditLine={handleEditLine}
      onChangeQty={cart.changeQty}
      onOpenDiscount={() => setDiscountOpen(true)}
      onClear={cart.clear}
      onPay={() => setPayOpen(true)}
    />
  );

  const menuPanel = (
    <MenuPanel
      catalog={catalog}
      qtyByProduct={cart.qtyByProduct}
      width={isTablet ? width - CART_WIDTH : width}
      onPressProduct={handleProductPress}
      onLongPressProduct={handleProductLongPress}
    />
  );

  const editingLine = modifierEditor?.line;

  return (
    <SafeAreaView className="flex-1 bg-peach" edges={['top', 'left', 'right']}>
      <KasirHeader
        storeName={store.name}
        cashierName={user.name}
        printerReady={isPrinterReady()}
        onOpenHistory={() => router.push('/riwayat')}
        onCloseShift={() => router.push('/tutup-shift')}
        onOpenSettings={() => router.push('/pengaturan')}
      />

      {isTablet ? (
        <View className="flex-1 flex-row">
          {menuPanel}
          <View style={{ width: CART_WIDTH }} className="border-l-2 border-line p-4">
            {cartPanel}
          </View>
        </View>
      ) : (
        <>
          {menuPanel}
          <CartBar itemCount={cart.itemCount} total={cart.totals.total} hasLastOrder={!!lastOrder} onPress={() => setCartOpen(true)} />
          {isCartOpen && (
            <Sheet title="Keranjang" onClose={() => setCartOpen(false)}>
              <View style={{ minHeight: 420 }}>{cartPanel}</View>
            </Sheet>
          )}
        </>
      )}

      {modifierEditor && (
        <ModifierSheet
          product={modifierEditor.product}
          groups={modifierEditor.groups}
          initialModifiers={editingLine?.modifiers}
          initialNote={editingLine?.note}
          qty={editingLine?.qty}
          onSubmit={handleModifierSubmit}
          onClose={() => setModifierEditor(null)}
          onRemove={editingLine ? () => handleRemoveLine(editingLine) : undefined}
        />
      )}
      {isPayOpen && (
        <PaySheet total={cart.totals.total} qrisImage={store.qrisImage} onPaid={handlePaid} onClose={() => setPayOpen(false)} />
      )}
      {isDiscountOpen && (
        <DiscountSheet
          discounts={catalog.discounts}
          selectedId={cart.discount?.id ?? null}
          onSelect={(discount) => {
            cart.setDiscount(discount);
            setDiscountOpen(false);
          }}
          onClose={() => setDiscountOpen(false)}
        />
      )}
      {receiptPreview && (
        <Sheet title="Struk" onClose={() => setReceiptPreview(null)}>
          <ReceiptPaper lines={receiptPreview} />
        </Sheet>
      )}
      <Toast message={toast} />
    </SafeAreaView>
  );
}
