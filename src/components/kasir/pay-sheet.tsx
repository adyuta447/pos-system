import { useState } from 'react';
import { View } from 'react-native';

import AppText from '@/components/ui/app-text';
import Button from '@/components/ui/button';
import Sheet from '@/components/ui/sheet';
import type { PaymentMethod } from '@/lib/cart';
import { formatRupiah } from '@/lib/money';

import CashPayment from './cash-payment';
import QrisPayment from './qris-payment';

interface Props {
  total: number;
  qrisImage: string | null;
  onPaid(method: PaymentMethod, cashReceived: number | null): void;
  /** Back to the cart; the order is kept (spec 5.2 step 4). */
  onClose(): void;
}

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Tunai' },
  { value: 'qris', label: 'QRIS' },
];

/** Cash is preselected, so the common path is Bayar → Uang pas → Selesai. Mount only while open. */
export default function PaySheet({ total, qrisImage, onPaid, onClose }: Props) {
  const [method, setMethod] = useState<PaymentMethod>('cash');

  return (
    <Sheet title="Pembayaran" onClose={onClose} size="lg">
      <View className="gap-4">
        <View className="flex-row items-end justify-between rounded-2xl bg-red px-5 py-4">
          <AppText className="font-label text-lg text-paper">Total</AppText>
          <AppText className="font-display text-5xl text-paper">{formatRupiah(total)}</AppText>
        </View>
        <View className="flex-row gap-2" accessibilityRole="tablist">
          {METHODS.map((m) => (
            <Button
              key={m.value}
              label={m.label}
              size="lg"
              className="flex-1"
              accessibilityRole="tab"
              selected={method === m.value}
              onPress={() => setMethod(m.value)}
            />
          ))}
        </View>
        {method === 'cash' ? (
          <CashPayment total={total} onPaid={(cash) => onPaid('cash', cash)} />
        ) : (
          <QrisPayment total={total} qrisImage={qrisImage} onPaid={() => onPaid('qris', null)} onCancel={onClose} />
        )}
      </View>
    </Sheet>
  );
}
