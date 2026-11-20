import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BrandPanel from '@/components/login/brand-panel';
import PinEntry from '@/components/login/pin-entry';
import UserPicker from '@/components/login/user-picker';
import { getOpenShift } from '@/db/shifts';
import { getStore } from '@/db/store';
import { isPinCorrect, listActiveUsers, type User } from '@/db/users';
import applyKeypadKey, { type KeypadKey } from '@/lib/keypad';
import { connectPrinter } from '@/lib/printer';
import { useSession } from '@/providers/session-provider';

const PIN_MIN = 4;
const PIN_MAX = 6;

export default function LoginScreen() {
  const db = useSQLiteContext();
  const session = useSession();
  const { width } = useWindowDimensions();
  const users = useMemo(() => listActiveUsers(db), [db]);
  const store = useMemo(() => getStore(db), [db]);
  const [user, setUser] = useState<User | null>(users.length === 1 ? users[0] : null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Spec 7.2: the saved printer reconnects by itself when the app opens.
  useEffect(() => {
    connectPrinter(store.printerAddress);
  }, [store.printerAddress]);

  const signIn = (signedIn: User) => {
    const shift = getOpenShift(db, signedIn.id);
    session.setUser(signedIn);
    session.setShift(shift);
    router.replace(shift ? '/kasir' : '/buka-shift');
  };

  const selectUser = (selected: User) => {
    setUser(selected);
    setPin('');
    setError('');
  };

  const handleKeyPress = async (key: KeypadKey) => {
    if (!user) return;
    const next = applyKeypadKey(pin, key, { maxLength: PIN_MAX, keepLeadingZeros: true });
    setPin(next);
    setError('');
    // PINs are 4 to 6 digits, so check silently from 4 digits on: no "Masuk" tap needed.
    if (next.length >= PIN_MIN && (await isPinCorrect(db, user.id, next))) {
      signIn(user);
    } else if (next.length === PIN_MAX) {
      setError('PIN salah, coba lagi');
      setPin('');
    }
  };

  const isTablet = width >= 768;
  return (
    <SafeAreaView className={`flex-1 bg-peach ${isTablet ? 'flex-row' : ''}`}>
      <BrandPanel storeName={store.name} address={store.address} layout={isTablet ? 'side' : 'top'} />
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-full max-w-md gap-5">
          <UserPicker users={users} selectedId={user?.id ?? null} onSelect={selectUser} />
          {user && <PinEntry userName={user.name} length={pin.length} error={error} onKeyPress={handleKeyPress} />}
        </View>
      </View>
    </SafeAreaView>
  );
}
