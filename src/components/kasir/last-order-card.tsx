import { View } from 'react-native';

import AppText from '@/components/ui/app-text';
import Button from '@/components/ui/button';
import type { PaymentMethod } from '@/lib/cart';
import { formatRupiah } from '@/lib/money';
import { formatOrderNo } from '@/lib/receipt';

export interface CompletedOrder {
  id: string;
  orderNo: number;
  method: PaymentMethod;
  change: number;
  printed: boolean;
}

interface Props {
  order: CompletedOrder;
  onReprint(): void;
  onPreview(): void;
  onShare(): void;
}

/** Shown in the empty cart right after a sale, instead of a separate confirmation screen. */
export default function LastOrderCard({ order, onReprint, onPreview, onShare }: Props) {
  return (
    <View className="gap-3 rounded-2xl bg-green p-4">
      <AppText className="font-heading text-lg">Transaksi {formatOrderNo(order.orderNo)} selesai</AppText>
      {order.method === 'cash' ? (
        <View>
          <AppText className="text-base">Kembalian</AppText>
          <AppText className="font-display text-4xl">{formatRupiah(order.change)}</AppText>
        </View>
      ) : (
        <AppText className="font-display text-2xl">Lunas via QRIS</AppText>
      )}
      <AppText className="font-label text-base">
        {order.printed ? 'Struk sudah dicetak' : 'Struk belum tercetak, printer terputus'}
      </AppText>
      <View className="flex-row flex-wrap gap-2">
        <Button label="Cetak ulang" onPress={onReprint} />
        <Button label="Lihat struk" onPress={onPreview} />
        <Button label="WhatsApp" onPress={onShare} />
      </View>
    </View>
  );
}
