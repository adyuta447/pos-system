import { View } from 'react-native';

import AppText from './app-text';

interface Props {
  label: string;
  value: string;
}

export default function StatCard({ label, value }: Props) {
  return (
    <View className="flex-1 rounded-2xl bg-paper p-4">
      <AppText className="text-base">{label}</AppText>
      <AppText className="font-display text-2xl">{value}</AppText>
    </View>
  );
}
