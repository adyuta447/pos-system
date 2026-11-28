import { ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/atoms/Checkbox";
import type { TxnSortKey } from "@/hooks/useTransactionsTable";
import { TXN_GRID } from "./TransactionRow";

interface TransactionsHeadRowProps {
  sortKey: TxnSortKey;
  onSort: (key: TxnSortKey) => void;
  allSelected: boolean;
  onToggleAll: () => void;
}

const COLS: { key: TxnSortKey; label: string }[] = [
  { key: "receiptNo", label: "NO. STRUK" },
  { key: "branchName", label: "UMKM / CABANG" },
  { key: "itemsSummary", label: "ITEM" },
  { key: "status", label: "STATUS" },
  { key: "method", label: "METODE" },
  { key: "orderType", label: "PESANAN" },
  { key: "total", label: "TOTAL" },
];

export function TransactionsHeadRow({ sortKey, onSort, allSelected, onToggleAll }: TransactionsHeadRowProps) {
  return (
    <div className={`${TXN_GRID} label-mono h-9 border-b border-line-subtle bg-[#F8F7F5] !text-[11px] text-ink-3`} role="row">
      <Checkbox aria-label="Pilih semua" checked={allSelected} onChange={onToggleAll} />
      {COLS.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onSort(c.key)}
          className="flex cursor-pointer items-center gap-1 text-left hover:text-ink"
        >
          {c.label}
          <ChevronsUpDown className={`size-3 ${sortKey === c.key ? "text-ink" : "text-ink-4"}`} />
        </button>
      ))}
      <span className="text-right">AKSI</span>
    </div>
  );
}
