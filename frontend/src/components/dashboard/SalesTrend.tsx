"use client";

import { useMemo, useState } from "react";
import {
  formatRupiah,
  getLineSeries,
  SALES_CATEGORIES,
  YEAR_OPTIONS,
  YEAR_RANGE_OPTIONS,
  type SalesCategory,
  type SalesRange,
} from "../../data/mock";
import { cn } from "../../lib/cn";
import { SalesLineChart } from "../charts/SalesLineChart";
import { Panel } from "../ui/Panel";
import { Segmented } from "../ui/Segmented";
import { Select } from "../ui/Select";

const RANGES: readonly SalesRange[] = ["Mingguan", "Bulanan", "Tahunan"];

export function SalesTrend({ branchFactor = 1 }: { totalIncome?: number; branchFactor?: number }) {
  const [range, setRange] = useState<SalesRange>("Bulanan");
  const [year, setYear] = useState<string>("2026");
  const [yearRange, setYearRange] = useState<string>("2024 - 2026");
  const [category, setCategory] = useState<SalesCategory>("Semua");

  const data = useMemo(
    () => getLineSeries({ range, category, year, yearRange, branchFactor }),
    [range, category, year, yearRange, branchFactor],
  );

  const seriesTotal = useMemo(
    () => data.reduce((sum, pt) => sum + pt.value * 1000, 0),
    [data],
  );

  return (
    <Panel
      title="TREN PENJUALAN"
      infoText="Total pemasukan otomatis mengikuti periode, tahun atau rentang tahun, kategori produk, dan cabang yang dipilih."
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4">
        <div className="flex items-baseline gap-2.5">
          <span className="text-[12px] text-ink-3">Total Pemasukan :</span>
          <span className="font-mono text-[22px] font-bold leading-6 text-ink">
            {formatRupiah(seriesTotal)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {range === "Tahunan" ? (
            <Select
              size="sm"
              ariaLabel="Pilih rentang tahun"
              value={yearRange}
              options={YEAR_RANGE_OPTIONS.map((r) => ({ value: r, label: r }))}
              onChange={setYearRange}
              className="w-[125px]"
            />
          ) : (
            <Select
              size="sm"
              ariaLabel="Pilih tahun"
              value={year}
              options={YEAR_OPTIONS.map((y) => ({ value: y, label: `Tahun ${y}` }))}
              onChange={setYear}
              className="w-[115px]"
            />
          )}
          <Segmented options={RANGES} value={range} onChange={setRange} />
        </div>
      </div>

      <div className="px-4 pt-4 pb-2">
        <SalesLineChart data={data} />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-line-subtle px-4 py-3">
        {SALES_CATEGORIES.map((cat) => {
          const active = cat === category;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1 text-[12px] font-medium transition-colors",
                active
                  ? "bg-ink text-white shadow-card"
                  : "border border-line bg-muted/60 text-ink-2 hover:bg-hover hover:text-ink",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </Panel>
  );
}
