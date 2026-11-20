// Pure text layout for the thermal printer. Imports use the .ts extension so plain Node can run the tests.
import type { OrderType, PaymentMethod } from './cart.ts';
import { formatNumber } from './money.ts';

export interface ReceiptStore {
  name: string;
  address: string;
  phone: string;
  footer: string;
}

export interface ReceiptItem {
  name: string;
  qty: number;
  lineTotal: number;
  modifiers: string[];
  note: string;
}

export interface ReceiptOrder {
  orderNo: number;
  createdAt: Date;
  cashier: string;
  orderType: OrderType;
  items: ReceiptItem[];
  subtotal: number;
  discountName: string | null;
  discountTotal: number;
  taxPercent: number;
  taxTotal: number;
  total: number;
  method: PaymentMethod;
  cashReceived: number | null;
  change: number | null;
  isVoid: boolean;
}

export interface ShiftReport {
  storeName: string;
  cashier: string;
  openedAt: Date;
  closedAt: Date;
  orders: number;
  voids: number;
  cashSales: number;
  qrisSales: number;
  openingCash: number;
  countedCash: number;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/** "19/11/26 14:05" */
export function formatDateTime(date: Date): string {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${String(date.getFullYear()).slice(2)} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/** 42 -> "#0042" */
export function formatOrderNo(orderNo: number): string {
  return `#${String(orderNo).padStart(4, '0')}`;
}

/** Cash that should be in the drawer at the end of a shift. */
export function expectedCash({ openingCash, cashSales }: Pick<ShiftReport, 'openingCash' | 'cashSales'>): number {
  return openingCash + cashSales;
}

export function buildReceiptLines(store: ReceiptStore, order: ReceiptOrder, width: number): string[] {
  const out: string[] = [];
  const divider = '-'.repeat(width);

  out.push(center(store.name.toUpperCase(), width));
  for (const text of [store.address, store.phone].filter(Boolean)) out.push(...centerWrapped(text, width));
  if (order.isVoid) out.push(center('*** DIBATALKAN ***', width));

  out.push(divider);
  out.push(...leftRight(formatOrderNo(order.orderNo), `${formatDateTime(order.createdAt)}  ${order.cashier}`.slice(0, width - 6), width));
  out.push(order.orderType === 'dine_in' ? 'Makan di tempat' : 'Take away');

  out.push(divider);
  for (const item of order.items) {
    out.push(...leftRight(`${item.name} x${item.qty}`, formatNumber(item.lineTotal), width));
    for (const modifier of item.modifiers) out.push(...wrap(modifier, width, '  '));
    if (item.note) out.push(...wrap(`Catatan: ${item.note}`, width, '  '));
  }

  out.push(divider);
  out.push(...leftRight('Subtotal', formatNumber(order.subtotal), width));
  if (order.discountTotal) out.push(...leftRight(order.discountName ?? 'Diskon', `-${formatNumber(order.discountTotal)}`, width));
  if (order.taxTotal) out.push(...leftRight(`Pajak ${order.taxPercent}%`, formatNumber(order.taxTotal), width));
  out.push(...leftRight('Total', formatNumber(order.total), width));
  if (order.method === 'cash') {
    out.push(...leftRight('Tunai', formatNumber(order.cashReceived ?? order.total), width));
    out.push(...leftRight('Kembali', formatNumber(order.change ?? 0), width));
  } else {
    out.push(...leftRight('QRIS', formatNumber(order.total), width));
  }

  out.push(divider);
  out.push(...centerWrapped(store.footer || 'Terima kasih!', width));
  return out;
}

export function buildShiftReportLines(report: ShiftReport, width: number): string[] {
  const divider = '-'.repeat(width);
  const expected = expectedCash(report);
  const row = (label: string, value: string | number) =>
    leftRight(label, typeof value === 'number' ? formatNumber(value) : value, width);

  return [
    center(report.storeName.toUpperCase(), width),
    center('LAPORAN SHIFT', width),
    divider,
    ...row('Kasir', report.cashier),
    ...row('Buka', formatDateTime(report.openedAt)),
    ...row('Tutup', formatDateTime(report.closedAt)),
    divider,
    ...row('Transaksi', String(report.orders)),
    ...row('Dibatalkan', String(report.voids)),
    ...row('Penjualan tunai', report.cashSales),
    ...row('Penjualan QRIS', report.qrisSales),
    ...row('Total penjualan', report.cashSales + report.qrisSales),
    divider,
    ...row('Modal awal', report.openingCash),
    ...row('Seharusnya di laci', expected),
    ...row('Uang di laci', report.countedCash),
    ...row('Selisih', report.countedCash - expected),
    divider,
  ];
}

// ---------- text layout helpers ----------

function center(text: string, width: number): string {
  return ' '.repeat(Math.max(0, Math.floor((width - text.length) / 2))) + text;
}

function centerWrapped(text: string, width: number): string[] {
  return wrap(text, width).map((line) => center(line, width));
}

/** Word-wraps text to the width, prefixing every line with indent. */
function wrap(text: string, width: number, indent = ''): string[] {
  const out: string[] = [];
  let line = indent;
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (line.trim() && line.length + 1 + word.length > width) {
      out.push(line);
      line = indent;
    }
    line += (line.trim() ? ' ' : '') + word;
  }
  if (line.trim()) out.push(line);
  return out;
}

/** Left text and right-aligned value on one line; long left text wraps and the value sits on the last line. */
function leftRight(left: string, right: string, width: number): string[] {
  const room = width - right.length - 1;
  const out: string[] = [];
  let rest = left;
  while (rest.length > room) {
    let cut = rest.lastIndexOf(' ', width);
    if (cut <= 0) cut = Math.min(width, rest.length);
    out.push(rest.slice(0, cut).trimEnd());
    rest = rest.slice(cut).trimStart();
  }
  out.push(rest + ' '.repeat(Math.max(1, width - rest.length - right.length)) + right);
  return out;
}
