import { View } from 'react-native';

import AppText from '@/components/ui/app-text';
import Button from '@/components/ui/button';
import SummaryRow from '@/components/ui/summary-row';
import type { Discount, Totals } from '@/lib/cart';
import { formatRupiah } from '@/lib/money';

interface Props {
  totals: Totals;
  discount: Discount | null;
  taxPercent: number;
  onOpenDiscount(): void;
  onClear(): void;
  onPay(): void;
}

/** Bottom of the cart: discount, totals and the big Bayar button. */
export default function CartSummary({ totals, discount, taxPercent, onOpenDiscount, onClear, onPay }: Props) {
  return (
    <View className="gap-2">
      <View className="flex-row gap-2">
        <Button label={discount?.name ?? 'Diskon'} selected={!!discount} className="flex-1" onPress={onOpenDiscount} />
        <Button label="Kosongkan" onPress={onClear} />
      </View>
      <View className="gap-1 rounded-2xl bg-paper p-3">
        <SummaryRow label="Subtotal" value={formatRupiah(totals.subtotal)} />
        {totals.discountTotal > 0 && <SummaryRow label={discount?.name ?? 'Diskon'} value={`-${formatRupiah(totals.discountTotal)}`} />}
        {totals.taxTotal > 0 && <SummaryRow label={`Pajak ${taxPercent}%`} value={formatRupiah(totals.taxTotal)} />}
      </View>
      <Button variant="red" size="xl" onPress={onPay} accessibilityLabel={`Bayar ${formatRupiah(totals.total)}`}>
        <View className="w-full flex-row items-center justify-between">
          <AppText className="font-heading text-2xl text-paper">Bayar</AppText>
          <AppText className="font-display text-3xl text-paper">{formatRupiah(totals.total)}</AppText>
        </View>
      </Button>
    </View>
  );
}
