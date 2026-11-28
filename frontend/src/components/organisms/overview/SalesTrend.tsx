"use client";

import { Chip } from "@/components/atoms/Chip";
import { Panel } from "@/components/molecules/Panel";
import { SalesLineChart } from "@/components/molecules/SalesLineChart";
import { Segmented } from "@/components/molecules/Segmented";
import { Select } from "@/components/molecules/Select";
import { formatRupiah, SALES_CATEGORIES, type SalesRange } from "@/data/mock";
import {
  SALES_RANGES,
  useSalesTrend,
  YEAR_RANGE_SELECT_OPTIONS,
  YEAR_SELECT_OPTIONS,
} from "@/hooks/useSalesTrend";

interface SalesTrendProps {
  branchFactor?: number;
}

export function SalesTrend({ branchFactor = 1 }: SalesTrendProps) {
  const trend = useSalesTrend({ branchFactor });

  return (
    <Panel
      title="TREN PENJUALAN"
      infoText="Total pemasukan otomatis mengikuti periode, tahun atau rentang tahun, kategori produk, dan cabang yang dipilih."
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4">
        <div className="flex items-baseline gap-2.5">
          <span className="text-[12px] text-ink-3">Total Pemasukan :</span>
          <span className="font-mono text-[22px] font-bold leading-6 text-ink">
            {formatRupiah(trend.seriesTotal)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {trend.range === "Tahunan" ? (
            <Select
              size="sm"
              ariaLabel="Pilih rentang tahun"
              value={trend.yearRange}
              options={YEAR_RANGE_SELECT_OPTIONS}
              onChange={trend.setYearRange}
              className="w-[125px]"
            />
          ) : (
            <Select
              size="sm"
              ariaLabel="Pilih tahun"
              value={trend.year}
              options={YEAR_SELECT_OPTIONS}
              onChange={trend.setYear}
              className="w-[115px]"
            />
          )}
          <Segmented options={SALES_RANGES} value={trend.range} onChange={(v) => trend.setRange(v as SalesRange)} />
        </div>
      </div>

      <div className="px-4 pt-4 pb-2">
        <SalesLineChart data={trend.data} />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-line-subtle px-4 py-3">
        {SALES_CATEGORIES.map((cat) => (
          <Chip key={cat} size="md" active={cat === trend.category} onClick={() => trend.setCategory(cat)}>
            {cat}
          </Chip>
        ))}
      </div>
    </Panel>
  );
}
