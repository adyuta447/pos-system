export type KeypadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '000' | 'clear' | 'backspace';

interface Options {
  maxLength?: number;
  keepLeadingZeros?: boolean;
}

/** Applies a keypad key to a digit string. PINs keep leading zeros, amounts do not. */
export default function applyKeypadKey(value: string, key: KeypadKey, { maxLength = 9, keepLeadingZeros = false }: Options = {}): string {
  if (key === 'clear') return '';
  if (key === 'backspace') return value.slice(0, -1);
  const next = value + key;
  return (keepLeadingZeros ? next : next.replace(/^0+/, '')).slice(0, maxLength);
}
