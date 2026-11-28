import { Ellipsis } from "lucide-react";
import { Checkbox } from "@/components/atoms/Checkbox";
import { IconButton } from "@/components/atoms/IconButton";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { formatRupiah, umkmOfBranch, type PosTxn } from "@/data/mock";

/** Grid kolom yang sama untuk header dan baris tabel transaksi. */
export const TXN_GRID =
  "grid grid-cols-[36px_140px_1.1fr_1.4fr_120px_90px_90px_115px_64px] items-center px-3";

interface TransactionRowProps {
  txn: PosTxn;
  selected: boolean;
  onToggle: () => void;
  onOpen: () => void;
}

export function TransactionRow({ txn: t, selected, onToggle, onOpen }: TransactionRowProps) {
  return (
    <div
      role="row"
      onClick={onOpen}
      className={`${TXN_GRID} h-[42px] cursor-pointer border-b border-line-subtle text-[13px] transition-colors hover:bg-[#FAFAF8]`}
    >
      <span onClick={(e) => e.stopPropagation()}>
        <Checkbox aria-label={`Pilih ${t.receiptNo}`} checked={selected} onChange={onToggle} />
      </span>
      <span className="font-mono text-[12.5px] text-ink-3">{t.receiptNo}</span>
      <span className="min-w-0 pr-2 leading-tight">
        <span className="block truncate font-medium text-ink">{umkmOfBranch(t.branchId)}</span>
        <span className="block truncate text-[11px] text-ink-3">{t.branchName}</span>
      </span>
      <span className="truncate pr-2 text-ink-2">{t.itemsSummary}</span>
      <span>
        <StatusBadge status={t.status} />
      </span>
      <span className="text-ink">{t.method}</span>
      <span className="text-ink-2">{t.orderType}</span>
      <span className="font-mono font-medium text-ink">{formatRupiah(t.total)}</span>
      <span
        className="flex justify-end"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        <IconButton className="!size-7 !rounded-xs2" aria-label={`Detail ${t.receiptNo}`}>
          <Ellipsis className="size-3.5" />
        </IconButton>
      </span>
    </div>
  );
}
