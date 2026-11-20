import { View } from 'react-native';

import type { KeypadKey } from '@/lib/keypad';

import Button from './button';

interface Props {
  onKeyPress(key: KeypadKey): void;
  /** pin: has a clear key. amount: has a 000 key instead. */
  mode?: 'pin' | 'amount';
}

const DIGITS: KeypadKey[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const LABELS: Partial<Record<KeypadKey, string>> = { clear: 'C', backspace: '⌫' };
const A11Y_LABELS: Partial<Record<KeypadKey, string>> = { clear: 'Hapus semua', backspace: 'Hapus satu angka' };

export default function Keypad({ onKeyPress, mode = 'pin' }: Props) {
  const keys: KeypadKey[] = [...DIGITS, mode === 'pin' ? 'clear' : '000', '0', 'backspace'];
  return (
    <View className="flex-row flex-wrap gap-2">
      {keys.map((key) => (
        <Button
          key={key}
          label={LABELS[key] ?? key}
          accessibilityLabel={A11Y_LABELS[key] ?? key}
          variant={key === 'clear' ? 'orange' : 'paper'}
          size="lg"
          className="grow basis-[31%]"
          onPress={() => onKeyPress(key)}
        />
      ))}
    </View>
  );
}
