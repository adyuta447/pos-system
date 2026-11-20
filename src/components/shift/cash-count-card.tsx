import { View } from 'react-native';

import AppText from '@/components/ui/app-text';
import { formatRupiah } from '@/lib/money';

interface Props {
  /** null until the cashier types something. */
  countedCash: number | null;
  expectedCash: number;
}

function describeDifference(difference: number): string {
  if (difference === 0) return 'Pas, tidak ada selisih';
  return `${difference > 0 ? 'Lebih' : 'Kurang'} ${formatRupiah(Math.abs(difference))}`;
}

/** Counted drawer cash and the difference against what should be there. */
export default function CashCountCard({ countedCash, expectedCash }: Props) {
  const difference = countedCash === null ? null : countedCash - expectedCash;
  const surface = difference === null ? 'bg-paper' : difference === 0 ? 'bg-green' : 'bg-orange';
  return (
    <View className={`rounded-2xl p-4 ${surface}`}>
      <AppText className="text-base">Uang di laci (hitung manual)</AppText>
      <AppText className="font-display text-4xl">{formatRupiah(countedCash ?? 0)}</AppText>
      {difference !== null && (
        <AppText className="mt-1 font-heading text-xl" accessibilityLiveRegion="polite">
          {describeDifference(difference)}
        </AppText>
      )}
    </View>
  );
}
