import type { ReactNode } from 'react';
import { View } from 'react-native';

import AppText from './app-text';

interface Props {
  title: string;
  children: ReactNode;
}

export default function CardSection({ title, children }: Props) {
  return (
    <View className="gap-3 rounded-3xl bg-paper p-4">
      <AppText className="font-heading text-xl" accessibilityRole="header">
        {title}
      </AppText>
      {children}
    </View>
  );
}
