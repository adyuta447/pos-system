export interface CartModifier {
  optionId: string;
  groupId: string;
  name: string;
  priceDelta: number;
}

export interface CartLine {
  key: string;
  productId: string;
  name: string;
  /** Base price without modifiers. */
  unitPrice: number;
  qty: number;
  note: string;
  modifiers: CartModifier[];
}

export interface Discount {
  id: string;
  name: string;
  type: "percent" | "amount";
  value: number;
}

export type OrderType = "dine_in" | "take_away";
export type PaymentMethod = "cash" | "qris";

export interface Totals {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
}

/** Same product + same modifiers + same note = same cart line, so tapping again adds qty. */
export function lineKey(
  productId: string,
  modifiers: CartModifier[],
  note: string,
): string {
  return [productId, ...modifiers.map((m) => m.optionId).sort(), note].join(
    "|",
  );
}

export function unitPriceWithModifiers(
  line: Pick<CartLine, "unitPrice" | "modifiers">,
): number {
  return (
    line.unitPrice + line.modifiers.reduce((sum, m) => sum + m.priceDelta, 0)
  );
}

export function lineTotal(
  line: Pick<CartLine, "unitPrice" | "qty" | "modifiers">,
): number {
  return unitPriceWithModifiers(line) * line.qty;
}

/** Discount applies to the subtotal and never goes below zero; tax applies after discount. */
export function computeTotals(
  lines: CartLine[],
  discount: Discount | null,
  taxPercent: number,
): Totals {
  const subtotal = lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const rawDiscount = !discount
    ? 0
    : discount.type === "percent"
      ? Math.round((subtotal * discount.value) / 100)
      : discount.value;
  const discountTotal = Math.min(rawDiscount, subtotal);
  const taxTotal = Math.round(((subtotal - discountTotal) * taxPercent) / 100);
  return {
    subtotal,
    discountTotal,
    taxTotal,
    total: subtotal - discountTotal + taxTotal,
  };
}

const CASH_NOTES = [20000, 50000, 100000];

/** Quick cash buttons: exact amount first, then the notes that cover the total. */
export function quickCashOptions(total: number): number[] {
  return [total, ...CASH_NOTES.filter((note) => note > total)];
}
