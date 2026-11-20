import type { ReactNode } from 'react';
import { Modal, ScrollView, View } from 'react-native';

import AppText from './app-text';
import Button from './button';

interface Props {
  title: string;
  onClose(): void;
  children: ReactNode;
  visible?: boolean;
  size?: 'md' | 'lg';
}

/** Modal card on a solid ink backdrop. Mount it only while open to start with fresh state. */
export default function Sheet({ title, onClose, children, visible = true, size = 'md' }: Props) {
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 items-center justify-center bg-ink p-4">
        <View className={`max-h-full w-full rounded-3xl bg-peach p-5 ${size === 'lg' ? 'max-w-3xl' : 'max-w-lg'}`}>
          <View className="mb-4 flex-row items-center justify-between gap-3">
            <AppText className="flex-1 font-display text-2xl" accessibilityRole="header">
              {title}
            </AppText>
            <Button label="Tutup" onPress={onClose} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}
