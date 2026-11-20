import { Share } from 'react-native';

import encodeEscPos from './escpos';

/**
 * PrinterService (spec 7.1). Screens only call these functions, so the Bluetooth library can be
 * swapped without touching them. A driver needs a development build (not Expo Go) and the
 * BLUETOOTH_CONNECT / BLUETOOTH_SCAN permissions on Android 12+.
 */
export interface PrinterDriver {
  isConnected(): boolean;
  connect(address: string): Promise<void>;
  write(data: Uint8Array): Promise<void>;
}

let driver: PrinterDriver | null = null;

export function registerPrinterDriver(nextDriver: PrinterDriver) {
  driver = nextDriver;
}

export function hasPrinterDriver(): boolean {
  return driver !== null;
}

// shortcut: status is read on render, not pushed; add a listener when a real driver reports disconnects.
export function isPrinterReady(): boolean {
  return driver?.isConnected() ?? false;
}

export async function connectPrinter(address: string | null): Promise<boolean> {
  if (!driver || !address) return false;
  try {
    await driver.connect(address);
    return true;
  } catch {
    return false;
  }
}

/** Never throws: a failed print must not lose the sale (spec 7.2). */
export async function printLines(lines: string[]): Promise<boolean> {
  if (!driver?.isConnected()) return false;
  try {
    await driver.write(encodeEscPos(lines, { boldFirstLine: true }));
    return true;
  } catch {
    return false;
  }
}

/** Opens the Android share sheet (WhatsApp etc.). Backticks make WhatsApp show it monospaced. */
export function shareReceipt(lines: string[]) {
  return Share.share({ message: '```\n' + lines.join('\n') + '\n```' });
}
