import { useMemo, useState } from "react";
import {
  getLineSeries,
  YEAR_OPTIONS,
  YEAR_RANGE_OPTIONS,
  type SalesCategory,
  type SalesRange,
} from "@/data/mock";

export const SALES_RANGES: readonly SalesRange[] = ["Mingguan", "Bulanan", "Tahunan"];
export const YEAR_SELECT_OPTIONS = YEAR_OPTIONS.map((y) => ({ value: y, label: `Tahun ${y}` }));
export const YEAR_RANGE_SELECT_OPTIONS = YEAR_RANGE_OPTIONS.map((r) => ({ value: r, label: r }));

interface UseSalesTrendProps {
  branchFactor: number;
}

export function useSalesTrend({ branchFactor }: UseSalesTrendProps) {
  const [range, setRange] = useState<SalesRange>("Bulanan");
  const [year, setYear] = useState<string>("2026");
  const [yearRange, setYearRange] = useState<string>("2024 - 2026");
  const [category, setCategory] = useState<SalesCategory>("Semua");

  const data = useMemo(
    () => getLineSeries({ range, category, year, yearRange, branchFactor }),
    [range, category, year, yearRange, branchFactor],
  );
  const seriesTotal = data.reduce((sum, pt) => sum + pt.value * 1000, 0);

  return { range, setRange, year, setYear, yearRange, setYearRange, category, setCategory, data, seriesTotal };
}
