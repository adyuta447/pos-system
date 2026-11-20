import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import AppText from '@/components/ui/app-text';
import type { CartLine, Discount, OrderType, Totals } from '@/lib/cart';

import CartItem from './cart-item';
import CartSummary from './cart-summary';
import OrderTypeToggle from './order-type-toggle';

interface Props {
  lines: CartLine[];
  orderType: OrderType;
  discount: Discount | null;
  totals: Totals;
  taxPercent: number;
  /** Shown when the cart is empty, e.g. the last completed order. */
  emptyContent?: ReactNode;
  onOrderTypeChange(value: OrderType): void;
  onEditLine(line: CartLine): void;
  onChangeQty(key: string, delta: number): void;
  onOpenDiscount(): void;
  onClear(): void;
  onPay(): void;
}

export default function CartPanel({
  lines, orderType, discount, totals, taxPercent, emptyContent,
  onOrderTypeChange, onEditLine, onChangeQty, onOpenDiscount, onClear, onPay,
}: Props) {
  const isEmpty = lines.length === 0;
  return (
    <View className="flex-1 gap-3">
      <OrderTypeToggle value={orderType} onChange={onOrderTypeChange} />
      <ScrollView className="flex-1" contentContainerClassName="gap-2">
        {isEmpty && (emptyContent ?? <AppText className="py-10 text-center text-lg">Tap menu untuk mulai pesanan</AppText>)}
        {lines.map((line) => (
          <CartItem key={line.key} line={line} onEdit={onEditLine} onChangeQty={onChangeQty} />
        ))}
      </ScrollView>
      {!isEmpty && (
        <CartSummary
          totals={totals}
          discount={discount}
          taxPercent={taxPercent}
          onOpenDiscount={onOpenDiscount}
          onClear={onClear}
          onPay={onPay}
        />
      )}
    </View>
  );
}
