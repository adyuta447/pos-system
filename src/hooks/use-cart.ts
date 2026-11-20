import { useMemo, useState } from 'react';

import type { ProductInfo } from '@/db/catalog';
import { type CartLine, type CartModifier, computeTotals, type Discount, lineKey, type OrderType } from '@/lib/cart';

/** All cart state and actions for the register screen. */
export default function useCart(taxPercent: number) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('take_away');
  const [discount, setDiscount] = useState<Discount | null>(null);

  const addItem = (product: ProductInfo, modifiers: CartModifier[] = [], note = '') => {
    const key = lineKey(product.id, modifiers, note);
    setLines((current) =>
      current.some((line) => line.key === key)
        ? current.map((line) => (line.key === key ? { ...line, qty: line.qty + 1 } : line))
        : [...current, { key, productId: product.id, name: product.name, unitPrice: product.price, qty: 1, note, modifiers }],
    );
  };

  /** Changes modifiers/note of a line; merges it into an identical line if one exists. */
  const updateItem = (key: string, modifiers: CartModifier[], note: string) =>
    setLines((current) => {
      const line = current.find((l) => l.key === key);
      if (!line) return current;
      const newKey = lineKey(line.productId, modifiers, note);
      const others = current.filter((l) => l.key !== key);
      if (others.some((l) => l.key === newKey)) {
        return others.map((l) => (l.key === newKey ? { ...l, qty: l.qty + line.qty } : l));
      }
      return current.map((l) => (l.key === key ? { ...l, key: newKey, modifiers, note } : l));
    });

  const removeItem = (key: string) => setLines((current) => current.filter((line) => line.key !== key));

  /** qty reaching 0 removes the line. */
  const changeQty = (key: string, delta: number) =>
    setLines((current) =>
      current.map((line) => (line.key === key ? { ...line, qty: line.qty + delta } : line)).filter((line) => line.qty > 0),
    );

  /** Empties the cart for the next order. Order type is kept: most shops repeat it. */
  const clear = () => {
    setLines([]);
    setDiscount(null);
  };

  const totals = computeTotals(lines, discount, taxPercent);
  const itemCount = lines.reduce((sum, line) => sum + line.qty, 0);
  const qtyByProduct = useMemo(() => {
    const map = new Map<string, number>();
    for (const line of lines) map.set(line.productId, (map.get(line.productId) ?? 0) + line.qty);
    return map;
  }, [lines]);

  return {
    lines, orderType, discount, totals, itemCount, qtyByProduct,
    addItem, updateItem, removeItem, changeQty, clear, setOrderType, setDiscount,
  };
}
