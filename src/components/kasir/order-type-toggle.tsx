import { View } from 'react-native';

import Button from '@/components/ui/button';
import type { OrderType } from '@/lib/cart';

interface Props {
  value: OrderType;
  onChange(value: OrderType): void;
}

const OPTIONS: { value: OrderType; label: string }[] = [
  { value: 'take_away', label: 'Take away' },
  { value: 'dine_in', label: 'Makan di sini' },
];

export default function OrderTypeToggle({ value, onChange }: Props) {
  return (
    <View className="flex-row gap-2">
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          label={option.label}
          selected={value === option.value}
          className="flex-1"
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}
