import { useMemo, useState } from "react";
import { CASH_COPY, SOURCE_OPTIONS, type CashKind } from "@/config/cash";
import type { CashEntry } from "@/data/mock";

interface UseCashEntriesViewProps {
  kind: CashKind;
  entries: CashEntry[];
}

const sum = (list: CashEntry[]) => list.reduce((s, e) => s + e.amount, 0);

export function useCashEntriesView({ kind, entries }: UseCashEntriesViewProps) {
  const copy = CASH_COPY[kind];
  const [pendingDelete, setPendingDelete] = useState<CashEntry | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "Semua kategori" },
      ...[...new Set([...copy.presets, ...entries.map((e) => e.category)])].map((c) => ({ value: c, label: c })),
    ],
    [copy.presets, entries],
  );

  const q = query.trim().toLowerCase();
  const visible = entries.filter(
    (e) =>
      (categoryFilter === "all" || e.category === categoryFilter) &&
      (sourceFilter === "all" || e.source === sourceFilter) &&
      (!q || `${e.category} ${e.note} ${e.branchName}`.toLowerCase().includes(q)),
  );
  const total = sum(visible);
  const totalCash = sum(visible.filter((e) => e.source === "Tunai (Laci)"));

  return {
    copy,
    query,
    setQuery,
    categoryFilter,
    setCategoryFilter,
    sourceFilter,
    setSourceFilter,
    categoryOptions,
    sourceOptions: [{ value: "all", label: "Semua sumber" }, ...SOURCE_OPTIONS],
    isFiltered: q !== "" || categoryFilter !== "all" || sourceFilter !== "all",
    resetFilters: () => {
      setQuery("");
      setCategoryFilter("all");
      setSourceFilter("all");
    },
    visible,
    total,
    totalCash,
    totalNonCash: total - totalCash,
    pendingDelete,
    setPendingDelete,
  };
}
