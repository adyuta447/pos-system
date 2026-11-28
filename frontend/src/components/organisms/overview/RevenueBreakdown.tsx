"use client";

import { ArrowRight, Wallet } from "lucide-react";
import { BreakdownChart } from "@/components/molecules/BreakdownChart";
import { DateRangePill } from "@/components/molecules/DateRangePill";
import { Panel } from "@/components/molecules/Panel";
import { formatRupiah } from "@/data/mock";
import { useRevenueBreakdown } from "@/hooks/useRevenueBreakdown";

interface RevenueBreakdownProps {
  totalIncome: number;
  totalExpense: number;
  onOpenReports?: () => void;
}

export function RevenueBreakdown({ totalIncome, totalExpense, onOpenReports }: RevenueBreakdownProps) {
  const rb = useRevenueBreakdown({ totalIncome, totalExpense });

  return (
    <Panel
      title="ARUS KAS CABANG"
      infoText="Perbandingan harian pemasukan (abu) terhadap pengeluaran operasional (hitam)."
      menuItems={onOpenReports ? [{ label: "Buka Laporan Keuangan", onSelect: onOpenReports }] : undefined}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 px-4 pt-4">
        <div className="min-w-0">
          <p className="text-[12px] text-ink-3">Selisih Bersih (Pemasukan - Pengeluaran)</p>
          <p className="mt-1.5 font-mono text-[22px] font-bold leading-6 text-ink">{formatRupiah(rb.netProfit)}</p>
        </div>
        <DateRangePill label={rb.rangeLabel} onChange={rb.setRangeLabel} />
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
        <BreakdownChart main={rb.expenseBars} ghost={rb.incomeBars} />
      </div>
    </Panel>
  );
}
