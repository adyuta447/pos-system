import { Pressable } from 'react-native';

import AppText from '@/components/ui/app-text';
import { formatRupiah } from '@/lib/money';

interface Props {
  itemCount: number;
  total: number;
  hasLastOrder: boolean;
  onPress(): void;
}

/** Phone layout: the cart collapses into this bar at the bottom (spec 3.1). */
export default function CartBar({ itemCount, total, hasLastOrder, onPress }: Props) {
  const label = itemCount ? `Keranjang (${itemCount})` : hasLastOrder ? 'Transaksi terakhir' : 'Keranjang kosong';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="m-2 min-h-16 flex-row items-center justify-between rounded-2xl bg-red px-5 active:scale-95">
      <AppText className="font-heading text-lg text-paper">{label}</AppText>
      <AppText className="font-display text-2xl text-paper">{formatRupiah(total)}</AppText>
    </Pressable>
  );
}
