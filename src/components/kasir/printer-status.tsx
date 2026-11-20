import { Pressable, View } from 'react-native';

import AppText from '@/components/ui/app-text';

interface Props {
  ready: boolean;
  onPress(): void;
}

/** Small printer indicator in the register header (spec 7.2). Text plus color, never color alone. */
export default function PrinterStatus({ ready, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={ready ? 'Printer tersambung, buka pengaturan' : 'Printer terputus, buka pengaturan'}
      className={`min-h-12 flex-row items-center gap-2 rounded-full px-4 active:scale-95 ${ready ? 'bg-green' : 'bg-orange'}`}>
      <View className={`h-3 w-3 rounded-full ${ready ? 'bg-ink' : 'bg-red'}`} />
      <AppText className="font-label text-sm">{ready ? 'Printer siap' : 'Printer terputus'}</AppText>
    </Pressable>
  );
}
