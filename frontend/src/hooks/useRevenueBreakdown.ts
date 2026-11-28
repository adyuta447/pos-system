import { useState } from "react";
import { BREAKDOWN_SERIES } from "@/data/mock";

interface UseRevenueBreakdownProps {
  totalIncome: number;
  totalExpense: number;
}

const RANGE_SCALE: Record<string, number> = { "1 Jan - 27 Nov": 1, "1 Okt - 27 Nov": 0.88 };

export function useRevenueBreakdown({ totalIncome, totalExpense }: UseRevenueBreakdownProps) {
  const [rangeLabel, setRangeLabel] = useState("1 Nov - 27 Nov");
  const scale = RANGE_SCALE[rangeLabel] ?? 0.78;
  const scaled = (values: readonly number[]) => values.map((v) => Number((v * scale).toFixed(2)));

  return {
    rangeLabel,
    setRangeLabel,
    netProfit: totalIncome - totalExpense,
    expenseBars: scaled(BREAKDOWN_SERIES.expense),
    incomeBars: scaled(BREAKDOWN_SERIES.income),
  };
}
