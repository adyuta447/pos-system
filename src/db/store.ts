import type { SQLiteDatabase } from 'expo-sqlite';

import type { ReceiptStore } from '@/lib/receipt';

export type PaperWidth = 58 | 80;

export interface Store extends ReceiptStore {
  id: string;
  qrisImage: string | null;
  taxPercent: number;
  paperWidth: PaperWidth;
  printerAddress: string | null;
}

interface StoreRow {
  id: string;
  name: string;
  address: string;
  phone: string;
  receipt_footer: string;
  qris_image_url: string | null;
  tax_percent: number;
  paper_width: PaperWidth;
  printer_address: string | null;
}

export function getStore(db: SQLiteDatabase): Store {
  const row = db.getFirstSync<StoreRow>('SELECT * FROM stores LIMIT 1');
  if (!row) throw new Error('Store belum dibuat');
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    phone: row.phone,
    footer: row.receipt_footer,
    qrisImage: row.qris_image_url,
    taxPercent: row.tax_percent,
    paperWidth: row.paper_width,
    printerAddress: row.printer_address,
  };
}

export function updateStore(db: SQLiteDatabase, store: Store) {
  db.runSync(
    `UPDATE stores SET name=?, address=?, phone=?, receipt_footer=?, qris_image_url=?, tax_percent=?, paper_width=?, printer_address=?
     WHERE id=?`,
    store.name, store.address, store.phone, store.footer, store.qrisImage, store.taxPercent, store.paperWidth, store.printerAddress, store.id,
  );
}

/** 58 mm paper fits 32 characters per line, 80 mm fits 48. */
export function charsPerLine(store: Pick<Store, 'paperWidth'>): number {
  return store.paperWidth === 80 ? 48 : 32;
}
