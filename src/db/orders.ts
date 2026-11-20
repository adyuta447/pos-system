import type { SQLiteDatabase } from 'expo-sqlite';

import { type CartLine, type OrderType, type PaymentMethod, type Totals, unitPriceWithModifiers } from '@/lib/cart';
import { buildReceiptLines, type ReceiptOrder } from '@/lib/receipt';

import { newId } from './ids';
import { charsPerLine, getStore } from './store';

export type OrderStatus = 'paid' | 'void';

export interface NewOrder extends Totals {
  storeId: string;
  shiftId: string;
  userId: string;
  orderType: OrderType;
  lines: CartLine[];
  discountName: string | null;
  method: PaymentMethod;
  cashReceived: number | null;
}

export interface OrderSummary {
  id: string;
  orderNo: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  method: PaymentMethod;
  voidReason: string | null;
}

interface OrderDetailRow {
  order_no: number;
  created_at: string;
  cashier: string;
  order_type: OrderType;
  subtotal: number;
  discount_name: string | null;
  discount_total: number;
  tax_total: number;
  total: number;
  status: OrderStatus;
  method: PaymentMethod;
  cash_received: number | null;
  change_amount: number | null;
}

interface OrderItemRow {
  id: string;
  product_name: string;
  qty: number;
  line_total: number;
  note: string;
}

interface ItemModifierRow {
  order_item_id: string;
  option_name: string;
}

/** Saves order, items, modifiers and payment in one transaction. */
export function saveOrder(db: SQLiteDatabase, order: NewOrder): { id: string; orderNo: number } {
  const id = newId();
  const now = new Date().toISOString();
  let orderNo = 0;

  db.withTransactionSync(() => {
    const last = db.getFirstSync<{ n: number | null }>('SELECT MAX(order_no) AS n FROM orders WHERE store_id=?', order.storeId);
    orderNo = (last?.n ?? 0) + 1;

    db.runSync(
      `INSERT INTO orders (id, store_id, shift_id, user_id, order_no, order_type, subtotal, discount_name, discount_total, tax_total, total, status, created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,'paid',?)`,
      id, order.storeId, order.shiftId, order.userId, orderNo, order.orderType, order.subtotal,
      order.discountName, order.discountTotal, order.taxTotal, order.total, now,
    );

    // Name and price are copied, so old reports do not change when the menu is edited (spec 6).
    for (const line of order.lines) {
      const itemId = newId();
      db.runSync(
        'INSERT INTO order_items (id, order_id, product_id, product_name, unit_price, qty, note, line_total) VALUES (?,?,?,?,?,?,?,?)',
        itemId, id, line.productId, line.name, line.unitPrice, line.qty, line.note, unitPriceWithModifiers(line) * line.qty,
      );
      for (const modifier of line.modifiers) {
        db.runSync(
          'INSERT INTO order_item_modifiers (id, order_item_id, option_name, price_delta) VALUES (?,?,?,?)',
          newId(), itemId, modifier.name, modifier.priceDelta,
        );
      }
    }

    const isCash = order.method === 'cash';
    const cashReceived = isCash ? (order.cashReceived ?? order.total) : null;
    db.runSync(
      `INSERT INTO payments (id, order_id, method, amount, cash_received, change_amount, status, paid_at)
       VALUES (?,?,?,?,?,?,'paid',?)`,
      newId(), id, order.method, order.total, cashReceived, cashReceived === null ? null : cashReceived - order.total, now,
    );
  });

  return { id, orderNo };
}

export function listShiftOrders(db: SQLiteDatabase, shiftId: string): OrderSummary[] {
  return db.getAllSync<OrderSummary>(
    `SELECT o.id, o.order_no AS orderNo, o.total, o.status, o.created_at AS createdAt, p.method, o.void_reason AS voidReason
     FROM orders o JOIN payments p ON p.order_id=o.id
     WHERE o.shift_id=? ORDER BY o.order_no DESC`,
    shiftId,
  );
}

/** Marks a paid order as void. The order stays in reports with its reason. */
export function voidOrder(db: SQLiteDatabase, orderId: string, reason: string) {
  db.runSync("UPDATE orders SET status='void', void_reason=?, synced_at=NULL WHERE id=? AND status='paid'", reason, orderId);
}

function getReceiptOrder(db: SQLiteDatabase, orderId: string, taxPercent: number): ReceiptOrder {
  const order = db.getFirstSync<OrderDetailRow>(
    `SELECT o.*, u.name AS cashier, p.method, p.cash_received, p.change_amount
     FROM orders o JOIN users u ON u.id=o.user_id JOIN payments p ON p.order_id=o.id
     WHERE o.id=?`,
    orderId,
  );
  if (!order) throw new Error(`Transaksi ${orderId} tidak ditemukan`);
  const items = db.getAllSync<OrderItemRow>('SELECT id, product_name, qty, line_total, note FROM order_items WHERE order_id=?', orderId);
  const modifiers = db.getAllSync<ItemModifierRow>(
    `SELECT m.order_item_id, m.option_name FROM order_item_modifiers m
     JOIN order_items i ON i.id=m.order_item_id WHERE i.order_id=?`,
    orderId,
  );

  return {
    orderNo: order.order_no,
    createdAt: new Date(order.created_at),
    cashier: order.cashier,
    orderType: order.order_type,
    items: items.map((item) => ({
      name: item.product_name,
      qty: item.qty,
      lineTotal: item.line_total,
      note: item.note,
      modifiers: modifiers.filter((m) => m.order_item_id === item.id).map((m) => m.option_name),
    })),
    subtotal: order.subtotal,
    discountName: order.discount_name,
    discountTotal: order.discount_total,
    taxPercent,
    taxTotal: order.tax_total,
    total: order.total,
    method: order.method,
    cashReceived: order.cash_received,
    change: order.change_amount,
    isVoid: order.status === 'void',
  };
}

/** Receipt text for an order, at the store's current paper width. */
export function getReceiptLines(db: SQLiteDatabase, orderId: string): string[] {
  const store = getStore(db);
  return buildReceiptLines(store, getReceiptOrder(db, orderId, store.taxPercent), charsPerLine(store));
}
