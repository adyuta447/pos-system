import { View } from 'react-native';

import AppText from '@/components/ui/app-text';
import Button from '@/components/ui/button';

import PrinterStatus from './printer-status';

interface Props {
  storeName: string;
  cashierName: string;
  printerReady: boolean;
  onOpenHistory(): void;
  onCloseShift(): void;
  onOpenSettings(): void;
}

export default function KasirHeader({ storeName, cashierName, printerReady, onOpenHistory, onCloseShift, onOpenSettings }: Props) {
  return (
    <View className="flex-row flex-wrap items-center gap-2 bg-red px-4 py-3">
      <View className="mr-auto">
        <AppText className="font-display text-xl text-paper">{storeName}</AppText>
        <AppText className="text-sm text-paper">Kasir: {cashierName}</AppText>
      </View>
      <PrinterStatus ready={printerReady} onPress={onOpenSettings} />
      <Button label="Riwayat" variant="peach" onPress={onOpenHistory} />
      <Button label="Tutup shift" variant="peach" onPress={onCloseShift} />
      <Button label="Pengaturan" variant="peach" onPress={onOpenSettings} />
    </View>
  );
}
