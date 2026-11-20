import { Image } from 'expo-image';
import { View } from 'react-native';

import AppText from '@/components/ui/app-text';
import Button from '@/components/ui/button';
import { formatRupiah } from '@/lib/money';

interface Props {
  total: number;
  /** Static QRIS image of the store, or null when not uploaded yet. */
  qrisImage: string | null;
  onPaid(): void;
  onCancel(): void;
}

/** Manual QRIS: the cashier checks the bank app, then taps "Sudah dibayar" (spec 5.2). */
export default function QrisPayment({ total, qrisImage, onPaid, onCancel }: Props) {
  return (
    <View className="items-center gap-3">
      {qrisImage ? (
        <Image
          source={{ uri: qrisImage }}
          contentFit="contain"
          style={{ width: 300, height: 300, borderRadius: 16 }}
          accessibilityLabel="Kode QRIS toko"
        />
      ) : (
        <View className="h-48 w-full items-center justify-center rounded-2xl bg-paper p-4">
          <AppText className="text-center text-lg">Gambar QRIS belum diunggah. Tambahkan di Pengaturan.</AppText>
        </View>
      )}
      <AppText className="text-center text-lg">
        Minta pembeli scan dan ketik {formatRupiah(total)}. Cek dana masuk di aplikasi bank.
      </AppText>
      <View className="w-full flex-row gap-2">
        <Button label="Batal" size="xl" onPress={onCancel} />
        <Button label="Sudah dibayar" variant="green" size="xl" className="flex-1" onPress={onPaid} />
      </View>
    </View>
  );
}
