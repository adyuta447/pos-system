import { useState } from 'react';
import { View } from 'react-native';

import AmountDisplay from '@/components/ui/amount-display';
import Button from '@/components/ui/button';
import Keypad from '@/components/ui/keypad';
import { quickCashOptions } from '@/lib/cart';
import applyKeypadKey from '@/lib/keypad';
import { formatNumber, formatRupiah } from '@/lib/money';

interface Props {
  total: number;
  onPaid(cashReceived: number): void;
}

/** Quick cash buttons or typed amount, with the change shown big (spec 5.1). */
export default function CashPayment({ total, onPaid }: Props) {
  const [quickAmount, setQuickAmount] = useState<number | null>(null);
  const [typed, setTyped] = useState('');

  const received = quickAmount ?? (typed ? Number(typed) : null);
  const enough = received !== null && received >= total;
  const changeLabel = received === null || enough ? 'Kembalian' : 'Masih kurang';

  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap gap-2">
        {quickCashOptions(total).map((amount, index) => (
          <Button
            key={amount}
            label={index === 0 ? 'Uang pas' : formatRupiah(amount)}
            variant="orange"
            size="xl"
            selected={quickAmount === amount}
            className="min-w-40 flex-1"
            onPress={() => {
              setQuickAmount(amount);
              setTyped('');
            }}
          />
        ))}
      </View>
      <View className="gap-3 md:flex-row">
        <View className="gap-3 md:flex-1">
          <AmountDisplay label="Uang diterima" amount={received} size="md" />
          <AmountDisplay label={changeLabel} amount={received === null ? null : Math.abs(received - total)} tone={enough ? 'green' : 'paper'} />
        </View>
        <View className="md:w-72">
          <Keypad
            mode="amount"
            onKeyPress={(key) => {
              setQuickAmount(null);
              setTyped((value) => applyKeypadKey(value, key));
            }}
          />
        </View>
      </View>
      <Button
        label={enough ? `Selesai, kembali ${formatNumber(received - total)}` : 'Pilih uang yang diterima'}
        variant="red"
        size="xl"
        disabled={!enough}
        onPress={() => enough && onPaid(received)}
      />
    </View>
  );
}
