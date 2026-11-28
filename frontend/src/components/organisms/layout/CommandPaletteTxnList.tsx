import { StatusBadge } from "@/components/atoms/StatusBadge";
import { formatRupiah, type PosTxn } from "@/data/mock";
import { cn } from "@/lib/cn";

interface CommandPaletteTxnListProps {
  transactions: PosTxn[];
  /** Indeks global item pertama (setelah item menu). */
  offset: number;
  activeIdx: number;
  onHover: (idx: number) => void;
  onSelect: (idx: number) => void;
}

export function CommandPaletteTxnList({ transactions, offset, activeIdx, onHover, onSelect }: CommandPaletteTxnListProps) {
  return (
    <div>
      <p className="label-mono px-2.5 py-1.5 !text-[10.5px] text-ink-3">TRANSAKSI TERKAIT</p>
      <div className="space-y-0.5">
        {transactions.map((t, idx) => {
          const globalIdx = offset + idx;
          return (
            <button
              key={t.id}
              type="button"
              onMouseEnter={() => onHover(globalIdx)}
              onClick={() => onSelect(globalIdx)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm2 px-2.5 py-2 text-left text-[12.5px] transition-colors",
                globalIdx === activeIdx ? "bg-muted text-ink" : "hover:bg-hover",
              )}
            >
              <span className="font-mono text-[12px] text-ink-3">{t.receiptNo}</span>
              <span className="min-w-0 flex-1 truncate px-2 font-medium text-ink">{t.itemsSummary}</span>
              <StatusBadge status={t.status} />
              <span className="font-mono font-semibold text-ink">{formatRupiah(t.total)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
