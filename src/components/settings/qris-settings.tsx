import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { View } from 'react-native';

import AppText from '@/components/ui/app-text';
import Button from '@/components/ui/button';
import CardSection from '@/components/ui/card-section';

interface Props {
  /** data: URI of the store's static QRIS, or null. */
  image: string | null;
  onChange(image: string | null): void;
}

export default function QrisSettings({ image, onChange }: Props) {
  const handlePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], base64: true, quality: 0.7 });
    const asset = result.canceled ? null : result.assets[0];
    // Stored as a data URI in SQLite so it survives cache clears and can sync to the backend later.
    if (asset?.base64) onChange(`data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`);
  };

  return (
    <CardSection title="QRIS toko">
      {image ? (
        <Image
          source={{ uri: image }}
          contentFit="contain"
          style={{ width: 220, height: 220, alignSelf: 'center' }}
          accessibilityLabel="Gambar QRIS toko"
        />
      ) : (
        <AppText className="text-base">Belum ada. Unggah foto QRIS statis dari aplikasi bank atau stiker QRIS toko.</AppText>
      )}
      <View className="flex-row gap-2">
        <Button label={image ? 'Ganti gambar' : 'Unggah gambar QRIS'} variant="orange" className="flex-1" onPress={handlePick} />
        {image && <Button label="Hapus" onPress={() => onChange(null)} />}
      </View>
    </CardSection>
  );
}
