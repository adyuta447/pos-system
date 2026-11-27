"use client";

import { useState } from "react";
import { ArrowRight, Wallet } from "lucide-react";
import { BREAKDOWN_SERIES, formatRupiah } from "../../data/mock";
import { BreakdownChart } from "../charts/BreakdownChart";
import { DateRangePill } from "../ui/DateControls";
import { Panel } from "../ui/Panel";

export function RevenueBreakdown({
  totalIncome,
  totalExpense,
  onOpenReports,
}: {
  totalIncome: number;
  totalExpense: number;
  onOpenReports?: () => void;
}) {
  const [rangeLabel, setRangeLabel] = useState("1 Nov - 27 Nov");
  const netProfit = totalIncome - totalExpense;
  const scale = rangeLabel === "1 Jan - 27 Nov" ? 1 : rangeLabel === "1 Okt - 27 Nov" ? 0.88 : 0.78;

  return (
    <Panel
      title="ARUS KAS CABANG"
      infoText="Perbandingan harian pemasukan (abu) terhadap pengeluaran operasional (hitam)."
      menuItems={
        onOpenReports
          ? [{ label: "Buka Laporan Keuangan", onSelect: onOpenReports }]
          : undefined
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-2 px-4 pt-4">
        <div className="min-w-0">
          <p className="text-[12px] text-ink-3">Selisih Bersih (Pemasukan - Pengeluaran)</p>
          <p className="mt-1.5 font-mono text-[22px] font-bold leading-6 text-ink">
            {formatRupiah(netProfit)}
          </p>
        </div>
        <DateRangePill label={rangeLabel} onChange={setRangeLabel} />
      </div>

      <button
        type="button"
        onClick={onOpenReports}
        className="mx-4 mt-3.5 flex h-9 w-[calc(100%-2rem)] cursor-pointer items-center gap-2 rounded-sm2 bg-muted px-2 text-left text-[12px] font-medium text-ink transition-colors hover:bg-hover"
      >
        <span className="grid size-6 shrink-0 place-items-center rounded-xs2 bg-card shadow-card">
          <Wallet className="size-3.5" />
        </span>
        <span className="flex-1 truncate">Lihat rincian pemasukan dan pengeluaran</span>
        <ArrowRight className="size-3.5 shrink-0 text-ink-3" />
      </button>

      <div className="px-4 pt-5 pb-4">
        <BreakdownChart
          main={BREAKDOWN_SERIES.expense.map((v) => Number((v * scale).toFixed(2)))}
          ghost={BREAKDOWN_SERIES.income.map((v) => Number((v * scale).toFixed(2)))}
        />
      </div>
    </Panel>
  );
}
