import { View } from 'react-native';

import AppText from './app-text';

interface Props {
  label: string;
  value: string;
  emphasis?: boolean;
}

/** "Label ........ value" row for totals and summaries. */
export default function SummaryRow({ label, value, emphasis = false }: Props) {
  return (
    <View className="flex-row justify-between gap-3">
      <AppText className={`text-base ${emphasis ? 'font-heading' : ''}`}>{label}</AppText>
      <AppText className="font-heading text-base">{value}</AppText>
    </View>
  );
}
