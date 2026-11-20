import * as Crypto from 'expo-crypto';

/** IDs are made on the device so offline orders never collide when synced (spec 6). */
export function newId(): string {
  return Crypto.randomUUID();
}

export function hashPin(userId: string, pin: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${userId}:${pin}`);
}
