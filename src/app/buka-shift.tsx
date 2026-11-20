import { Redirect, router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AmountDisplay from '@/components/ui/amount-display';
import AppText from '@/components/ui/app-text';
import Button from '@/components/ui/button';
import Keypad from '@/components/ui/keypad';
import { openShift } from '@/db/shifts';
import { getStore } from '@/db/store';
import applyKeypadKey from '@/lib/keypad';
import { useSession } from '@/providers/session-provider';

const QUICK_AMOUNTS = [0, 100000, 200000, 300000];

export default function BukaShiftScreen() {
  const db = useSQLiteContext();
  const { user, setShift, signOut } = useSession();
  const [cash, setCash] = useState('');
  if (!user) return <Redirect href="/" />;

  const openingCash = Number(cash || 0);

  const handleOpen = () => {
    setShift(openShift(db, getStore(db).id, user.id, openingCash));
    router.replace('/kasir');
  };

  const handleSwitchUser = () => {
    signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-peach p-6">
      <View className="w-full max-w-md gap-4">
        <View>
          <AppText className="font-label text-base">Halo, {user.name}</AppText>
          <AppText className="font-display text-3xl" accessibilityRole="header">
            Berapa uang di laci sekarang?
          </AppText>
          <AppText className="mt-1 text-base">Ini jadi modal awal shift. Dihitung lagi saat tutup shift.</AppText>
        </View>
        <AmountDisplay amount={openingCash} />
        <View className="flex-row gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              label={amount ? `${amount / 1000}rb` : 'Kosong'}
              variant="orange"
              className="flex-1"
              onPress={() => setCash(amount ? String(amount) : '')}
            />
          ))}
        </View>
        <Keypad mode="amount" onKeyPress={(key) => setCash((value) => applyKeypadKey(value, key))} />
        <View className="flex-row gap-2">
          <Button label="Ganti kasir" onPress={handleSwitchUser} />
          <Button label="Buka shift" variant="red" size="lg" className="flex-1" onPress={handleOpen} />
        </View>
      </View>
    </SafeAreaView>
  );
}
