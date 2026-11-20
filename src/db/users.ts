import type { SQLiteDatabase } from 'expo-sqlite';

import { hashPin } from './ids';

export type UserRole = 'owner' | 'cashier';
export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export function listActiveUsers(db: SQLiteDatabase): User[] {
  return db.getAllSync<User>("SELECT id, name, role FROM users WHERE active=1 ORDER BY role='owner', name");
}

export async function isPinCorrect(db: SQLiteDatabase, userId: string, pin: string): Promise<boolean> {
  const row = db.getFirstSync<{ pin_hash: string }>('SELECT pin_hash FROM users WHERE id=?', userId);
  return !!row && row.pin_hash === (await hashPin(userId, pin));
}
