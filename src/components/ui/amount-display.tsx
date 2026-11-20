import { View } from 'react-native';

import { formatRupiah } from '@/lib/money';

import AppText from './app-text';

interface Props {
  label?: string;
  /** null shows a dash. */
  amount: number | null;
  tone?: 'paper' | 'green' | 'orange';
  size?: 'md' | 'lg';
}

const TONE = { paper: 'bg-paper', green: 'bg-green', orange: 'bg-orange' };

/** Big money figure in a card, e.g. cash received, change, starting cash. */
export default function AmountDisplay({ label, amount, tone = 'paper', size = 'lg' }: Props) {
  return (
    <View className={`rounded-2xl px-5 py-4 ${TONE[tone]}`}>
      {label && <AppText className="text-base">{label}</AppText>}
      <AppText className={`font-display ${size === 'lg' ? 'text-5xl' : 'text-3xl'}`} accessibilityLiveRegion="polite">
        {amount === null ? '-' : formatRupiah(amount)}
      </AppText>
    </View>
  );
}
