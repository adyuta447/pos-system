import { ScrollView, View } from 'react-native';

import AppText from '@/components/ui/app-text';
import Button from '@/components/ui/button';
import ReceiptPaper from '@/components/ui/receipt-paper';

interface Props {
  reportLines: string[];
  printed: boolean;
  onReprint(): void;
  onDone(): void;
}

export default function ShiftClosedView({ reportLines, printed, onReprint, onDone }: Props) {
  return (
    <ScrollView contentContainerClassName="items-center gap-4 p-6">
      <AppText className="font-display text-3xl" accessibilityRole="header">
        Shift ditutup
      </AppText>
      <AppText className="font-label text-base">{printed ? 'Laporan shift sudah dicetak' : 'Laporan belum tercetak, printer terputus'}</AppText>
      <ReceiptPaper lines={reportLines} />
      <View className="w-full max-w-md flex-row gap-2">
        <Button label="Cetak ulang" variant="orange" onPress={onReprint} />
        <Button label="Selesai, keluar" variant="red" size="lg" className="flex-1" onPress={onDone} />
      </View>
    </ScrollView>
  );
}
