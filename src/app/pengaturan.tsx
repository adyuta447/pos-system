import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrinterSettings from '@/components/settings/printer-settings';
import QrisSettings from '@/components/settings/qris-settings';
import StoreInfoForm from '@/components/settings/store-info-form';
import ScreenHeader from '@/components/ui/screen-header';
import { getStore, type Store, updateStore } from '@/db/store';

export default function PengaturanScreen() {
  const db = useSQLiteContext();
  const [store, setStore] = useState(() => getStore(db));

  // Saved as you type: there is no save button to forget.
  const handleChange = (patch: Partial<Store>) => {
    const next = { ...store, ...patch };
    setStore(next);
    updateStore(db, next);
  };

  return (
    <SafeAreaView className="flex-1 bg-peach">
      <ScreenHeader title="Pengaturan" onBack={() => router.back()} />
      <ScrollView contentContainerClassName="gap-4 p-4 md:flex-row md:items-start" keyboardShouldPersistTaps="handled">
        <View className="gap-4 md:flex-1">
          <PrinterSettings store={store} onChange={handleChange} />
          <QrisSettings image={store.qrisImage} onChange={(qrisImage) => handleChange({ qrisImage })} />
        </View>
        <View className="gap-4 md:flex-1">
          <StoreInfoForm store={store} onChange={handleChange} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
