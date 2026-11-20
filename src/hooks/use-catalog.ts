import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { type Catalog, getCatalog } from '@/db/catalog';

/** Menu, modifiers and discounts. Call refresh() after changing them; also re-read on focus. */
export default function useCatalog(): { catalog: Catalog; refresh(): void } {
  const db = useSQLiteContext();
  const [catalog, setCatalog] = useState(() => getCatalog(db));
  const refresh = useCallback(() => setCatalog(getCatalog(db)), [db]);
  useFocusEffect(refresh);
  return { catalog, refresh };
}
