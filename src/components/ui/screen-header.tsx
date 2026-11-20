import type { ReactNode } from 'react';
import { View } from 'react-native';

import AppText from './app-text';
import Button from './button';

interface Props {
  title: string;
  onBack?(): void;
  /** Extra content on the right, e.g. action buttons. */
  right?: ReactNode;
}

export default function ScreenHeader({ title, onBack, right }: Props) {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-red px-4 py-3">
      {onBack && <Button label="Kembali" variant="peach" onPress={onBack} />}
      <AppText className="mr-auto font-display text-xl text-paper" accessibilityRole="header">
        {title}
      </AppText>
      {right}
    </View>
  );
}
