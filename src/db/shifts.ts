import type { SQLiteDatabase } from 'expo-sqlite';

import { newId } from './ids';

export interface Shift {
  id: string;
  openedAt: string;
  openingCash: number;
}

export interface ShiftSummary {
  orders: number;
  voids: number;
  cashSales: number;
  qrisSales: number;
}

export function getOpenShift(db: SQLiteDatabase, userId: string): Shift | null {
  return db.getFirstSync<Shift>(
    'SELECT id, opened_at AS openedAt, opening_cash AS openingCash FROM shifts WHERE user_id=? AND closed_at IS NULL',
    userId,
  );
}

export function openShift(db: SQLiteDatabase, storeId: string, userId: string, openingCash: number): Shift {
  const shift: Shift = { id: newId(), openedAt: new Date().toISOString(), openingCash };
  db.runSync(
    'INSERT INTO shifts (id, store_id, user_id, opened_at, opening_cash) VALUES (?,?,?,?,?)',
    shift.id, storeId, userId, shift.openedAt, openingCash,
  );
  return shift;
}

export function getShiftSummary(db: SQLiteDatabase, shiftId: string): ShiftSummary {
  const row = db.getFirstSync<{ orders: number | null; voids: number | null; cash: number | null; qris: number | null }>(
    `SELECT SUM(o.status='paid') AS orders,
            SUM(o.status='void') AS voids,
            SUM(CASE WHEN o.status='paid' AND p.method='cash' THEN p.amount END) AS cash,
            SUM(CASE WHEN o.status='paid' AND p.method='qris' THEN p.amount END) AS qris
     FROM orders o JOIN payments p ON p.order_id=o.id
     WHERE o.shift_id=?`,
    shiftId,
  );
  return { orders: row?.orders ?? 0, voids: row?.voids ?? 0, cashSales: row?.cash ?? 0, qrisSales: row?.qris ?? 0 };
}

export function closeShift(db: SQLiteDatabase, shiftId: string, countedCash: number, expectedCash: number) {
  db.runSync(
    'UPDATE shifts SET closed_at=?, counted_cash=?, expected_cash=?, difference=? WHERE id=?',
    new Date().toISOString(), countedCash, expectedCash, countedCash - expectedCash, shiftId,
  );
}
