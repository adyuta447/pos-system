import { Redirect, router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import OrderDetailSheet from '@/components/riwayat/order-detail-sheet';
import OrderListItem from '@/components/riwayat/order-list-item';
import AppText from '@/components/ui/app-text';
import ScreenHeader from '@/components/ui/screen-header';
import { getReceiptLines, listShiftOrders, type OrderSummary, voidOrder } from '@/db/orders';
import { useSession } from '@/providers/session-provider';

export default function RiwayatScreen() {
  const db = useSQLiteContext();
  const { shift } = useSession();
  const [selected, setSelected] = useState<OrderSummary | null>(null);
  if (!shift) return <Redirect href="/" />;

  // Read on every render: one shift's orders is small, and closing the sheet re-renders after a void.
  const orders = listShiftOrders(db, shift.id);

  const handleVoid = (reason: string) => {
    if (!selected) return;
    voidOrder(db, selected.id, reason);
    setSelected(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-peach">
      <ScreenHeader title="Riwayat shift ini" onBack={() => router.back()} />
      <FlatList
        data={orders}
        keyExtractor={(order) => order.id}
        contentContainerClassName="w-full max-w-3xl gap-2 self-center p-4"
        ListEmptyComponent={<AppText className="p-10 text-center text-lg">Belum ada transaksi di shift ini</AppText>}
        renderItem={({ item }) => <OrderListItem order={item} onPress={setSelected} />}
      />
      {selected && (
        <OrderDetailSheet
          order={selected}
          receiptLines={getReceiptLines(db, selected.id)}
          onVoid={handleVoid}
          onClose={() => setSelected(null)}
        />
      )}
    </SafeAreaView>
  );
}
