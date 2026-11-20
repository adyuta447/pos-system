import type { SQLiteDatabase } from 'expo-sqlite';

import seedDemoData from './seed';

// Tables follow the spec, section 6. orders.synced_at IS NULL = waiting to be sent once a backend exists.
const SCHEMA = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS stores (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, address TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '',
  receipt_footer TEXT NOT NULL DEFAULT '', qris_image_url TEXT, tax_percent REAL NOT NULL DEFAULT 0,
  paper_width INTEGER NOT NULL DEFAULT 58, printer_address TEXT);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, store_id TEXT NOT NULL REFERENCES stores(id), name TEXT NOT NULL, pin_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner','cashier')), active INTEGER NOT NULL DEFAULT 1);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY, store_id TEXT NOT NULL REFERENCES stores(id), name TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, category_id TEXT NOT NULL REFERENCES categories(id), name TEXT NOT NULL, price INTEGER NOT NULL,
  image_url TEXT, sort_order INTEGER NOT NULL DEFAULT 0, is_available INTEGER NOT NULL DEFAULT 1, active INTEGER NOT NULL DEFAULT 1);

CREATE TABLE IF NOT EXISTS modifier_groups (
  id TEXT PRIMARY KEY, store_id TEXT NOT NULL REFERENCES stores(id), name TEXT NOT NULL,
  required INTEGER NOT NULL DEFAULT 0, max_select INTEGER NOT NULL DEFAULT 1);

CREATE TABLE IF NOT EXISTS modifier_options (
  id TEXT PRIMARY KEY, group_id TEXT NOT NULL REFERENCES modifier_groups(id), name TEXT NOT NULL,
  price_delta INTEGER NOT NULL DEFAULT 0, is_default INTEGER NOT NULL DEFAULT 0, sort_order INTEGER NOT NULL DEFAULT 0);

CREATE TABLE IF NOT EXISTS product_modifier_groups (
  product_id TEXT NOT NULL REFERENCES products(id), group_id TEXT NOT NULL REFERENCES modifier_groups(id),
  PRIMARY KEY (product_id, group_id));

CREATE TABLE IF NOT EXISTS discounts (
  id TEXT PRIMARY KEY, store_id TEXT NOT NULL REFERENCES stores(id), name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percent','amount')), value INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1);

CREATE TABLE IF NOT EXISTS shifts (
  id TEXT PRIMARY KEY, store_id TEXT NOT NULL REFERENCES stores(id), user_id TEXT NOT NULL REFERENCES users(id),
  opened_at TEXT NOT NULL, opening_cash INTEGER NOT NULL, closed_at TEXT, counted_cash INTEGER, expected_cash INTEGER,
  difference INTEGER, synced_at TEXT);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, store_id TEXT NOT NULL REFERENCES stores(id), shift_id TEXT NOT NULL REFERENCES shifts(id),
  user_id TEXT NOT NULL REFERENCES users(id), order_no INTEGER NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('dine_in','take_away')),
  subtotal INTEGER NOT NULL, discount_name TEXT, discount_total INTEGER NOT NULL DEFAULT 0, tax_total INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL, status TEXT NOT NULL CHECK (status IN ('paid','void')), void_reason TEXT,
  created_at TEXT NOT NULL, synced_at TEXT);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), product_id TEXT NOT NULL,
  product_name TEXT NOT NULL, unit_price INTEGER NOT NULL, qty INTEGER NOT NULL, note TEXT NOT NULL DEFAULT '',
  line_total INTEGER NOT NULL);

CREATE TABLE IF NOT EXISTS order_item_modifiers (
  id TEXT PRIMARY KEY, order_item_id TEXT NOT NULL REFERENCES order_items(id), option_name TEXT NOT NULL,
  price_delta INTEGER NOT NULL);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), method TEXT NOT NULL CHECK (method IN ('cash','qris')),
  amount INTEGER NOT NULL, cash_received INTEGER, change_amount INTEGER, status TEXT NOT NULL DEFAULT 'paid',
  payment_ref TEXT, paid_at TEXT NOT NULL);

CREATE INDEX IF NOT EXISTS idx_orders_shift ON orders(shift_id);
`;

/** Passed to <SQLiteProvider onInit>: creates tables and fills demo data on first launch. */
export default async function initDatabase(db: SQLiteDatabase) {
  await db.execAsync(SCHEMA);
  const hasStore = await db.getFirstAsync('SELECT id FROM stores');
  if (!hasStore) await seedDemoData(db);
}
