import { useMemo, useState } from "react";
import type { PosTxn } from "@/data/mock";

export type TxnSortKey = "receiptNo" | "branchName" | "itemsSummary" | "status" | "method" | "orderType" | "total";

interface UseTransactionsTableProps {
  transactions: PosTxn[];
  fadeBottom: boolean;
}

const PREVIEW_LIMIT = 5;
const PAGE_SIZE = 8;

export function useTransactionsTable({ transactions, fadeBottom }: UseTransactionsTableProps) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<TxnSortKey>("receiptNo");
  const [sortAsc, setSortAsc] = useState(false);
  const [detailTxn, setDetailTxn] = useState<PosTxn | null>(null);
  const [expanded, setExpanded] = useState(!fadeBottom);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = transactions.filter(
      (t) => !q || [t.receiptNo, t.branchName, t.itemsSummary, t.status, t.method].some((f) => f.toLowerCase().includes(q)),
    );
    return list.sort((a, b) => {
      const [av, bv] = [a[sortKey], b[sortKey]];
      if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [query, sortAsc, sortKey, transactions]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const showBlurredPreview = fadeBottom && !expanded && filtered.length > PREVIEW_LIMIT;
  const start = (safePage - 1) * PAGE_SIZE;
  const visibleRows = showBlurredPreview ? filtered.slice(0, PREVIEW_LIMIT) : filtered.slice(start, start + PAGE_SIZE);
  const allSelected = visibleRows.length > 0 && visibleRows.every((t) => selectedIds.includes(t.id));

  function toggleSort(key: TxnSortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  }

  function setExpandedAndReset(next: boolean) {
    setExpanded(next);
    setPage(1);
  }

  return {
    query,
    changeQuery: (v: string) => {
      setQuery(v);
      setPage(1);
    },
    sortKey,
    toggleSort,
    filtered,
    visibleRows,
    showBlurredPreview,
    showPagination: (!fadeBottom || expanded) && filtered.length > 0,
    page: safePage,
    totalPages,
    setPage,
    startItem: filtered.length === 0 ? 0 : start + 1,
    endItem: Math.min(safePage * PAGE_SIZE, filtered.length),
    expand: () => setExpandedAndReset(true),
    collapse: () => setExpandedAndReset(false),
    allSelected,
    isSelected: (id: string) => selectedIds.includes(id),
    toggleAll: () => setSelectedIds(allSelected ? [] : visibleRows.map((t) => t.id)),
    toggleOne: (id: string) =>
      setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    detailTxn,
    openDetail: setDetailTxn,
    closeDetail: () => setDetailTxn(null),
  };
}
