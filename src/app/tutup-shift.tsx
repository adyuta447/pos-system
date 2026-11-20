import { Redirect, router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CashCountCard from '@/components/shift/cash-count-card';
import ShiftClosedView from '@/components/shift/shift-closed-view';
import Button from '@/components/ui/button';
import Keypad from '@/components/ui/keypad';
import ScreenHeader from '@/components/ui/screen-header';
import StatCard from '@/components/ui/stat-card';
import SummaryRow from '@/components/ui/summary-row';
import { closeShift, getShiftSummary } from '@/db/shifts';
import { charsPerLine, getStore } from '@/db/store';
import applyKeypadKey from '@/lib/keypad';
import { formatRupiah } from '@/lib/money';
import { printLines } from '@/lib/printer';
import { buildShiftReportLines, expectedCash } from '@/lib/receipt';
import { useSession } from '@/providers/session-provider';

interface ClosedReport {
  lines: string[];
  printed: boolean;
}

export default function TutupShiftScreen() {
  const db = useSQLiteContext();
  const { user, shift, signOut } = useSession();
  const summary = useMemo(() => (shift ? getShiftSummary(db, shift.id) : null), [db, shift]);
  const [counted, setCounted] = useState<string | null>(null);
  const [report, setReport] = useState<ClosedReport | null>(null);

  const handleDone = () => {
    signOut();
    router.dismissTo('/');
  };

  if (report) {
    return (
      <SafeAreaView className="flex-1 bg-peach">
        <ShiftClosedView
          reportLines={report.lines}
          printed={report.printed}
          onReprint={async () => setReport({ ...report, printed: await printLines(report.lines) })}
          onDone={handleDone}
        />
      </SafeAreaView>
    );
  }
  if (!user || !shift || !summary) return <Redirect href="/" />;

  const expected = expectedCash({ openingCash: shift.openingCash, cashSales: summary.cashSales });
  const countedCash = counted === null ? null : Number(counted || 0);

  const handleClose = async () => {
    if (countedCash === null) return;
    const store = getStore(db);
    closeShift(db, shift.id, countedCash, expected);
    const lines = buildShiftReportLines(
      {
        storeName: store.name,
        cashier: user.name,
        openedAt: new Date(shift.openedAt),
        closedAt: new Date(),
        ...summary,
        openingCash: shift.openingCash,
        countedCash,
      },
      charsPerLine(store),
    );
    setReport({ lines, printed: false });
    setReport({ lines, printed: await printLines(lines) });
  };

  return (
    <SafeAreaView className="flex-1 bg-peach">
      <ScreenHeader title="Tutup shift" onBack={() => router.back()} />
      <ScrollView contentContainerClassName="gap-4 p-4 md:flex-row">
        <View className="gap-3 md:flex-1">
          <View className="flex-row gap-3">
            <StatCard label="Penjualan tunai" value={formatRupiah(summary.cashSales)} />
            <StatCard label="Penjualan QRIS" value={formatRupiah(summary.qrisSales)} />
          </View>
          <View className="flex-row gap-3">
            <StatCard label="Transaksi" value={String(summary.orders)} />
            <StatCard label="Dibatalkan" value={String(summary.voids)} />
          </View>
          <View className="gap-1 rounded-2xl bg-paper p-4">
            <SummaryRow label="Modal awal" value={formatRupiah(shift.openingCash)} />
            <SummaryRow label="Penjualan tunai" value={formatRupiah(summary.cashSales)} />
            <SummaryRow label="Seharusnya di laci" value={formatRupiah(expected)} emphasis />
          </View>
          <CashCountCard countedCash={countedCash} expectedCash={expected} />
        </View>
        <View className="gap-3 md:w-96">
          <Keypad mode="amount" onKeyPress={(key) => setCounted((value) => applyKeypadKey(value ?? '', key) || null)} />
          <Button label="Laci kosong (Rp0)" variant="orange" onPress={() => setCounted('0')} />
          <Button label="Tutup shift dan cetak laporan" variant="red" size="xl" disabled={countedCash === null} onPress={handleClose} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
