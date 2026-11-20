import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { getStore, type Store } from '@/db/store';

/** Store settings, re-read whenever the screen regains focus (e.g. back from Pengaturan). */
export default function useFocusedStore(): Store {
  const db = useSQLiteContext();
  const [store, setStore] = useState(() => getStore(db));
  useFocusEffect(useCallback(() => setStore(getStore(db)), [db]));
  return store;
}
