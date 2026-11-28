import { X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { formatRupiah, type PosTxn, type PosTxnStatus } from "@/data/mock";

interface TransactionDetailDialogProps {
  txn: PosTxn;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: PosTxnStatus) => void;
}

export function TransactionDetailDialog({ txn, onClose, onUpdateStatus }: TransactionDetailDialogProps) {
  const update = (status: PosTxnStatus) => {
    onUpdateStatus?.(txn.id, status);
    onClose();
  };
  const rows = [
    ["Kasir", txn.cashier],
    ["Jenis Pesanan", txn.orderType],
    ["Metode Pembayaran", txn.method],
  ];

  return (
    <div
      className="animate-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-ink/25 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="animate-modal-in w-full max-w-[440px] rounded-ctrl border border-line bg-card p-5 shadow-window"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2 border-b border-line-subtle pb-3">
          <div>
            <p className="font-mono text-[13px] font-bold text-ink">{txn.receiptNo}</p>
            <p className="text-[12px] text-ink-3">
              {txn.date} · {txn.createdAt} · {txn.branchName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail transaksi"
            className="grid size-7 cursor-pointer place-items-center rounded-sm2 text-ink-3 hover:bg-hover"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="my-4 space-y-2.5 text-[13px]">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-ink-3">{label}</span>
              <span className="font-medium text-ink">{value}</span>
            </div>
          ))}
          <div className="flex justify-between">
            <span className="text-ink-3">Status</span>
            <StatusBadge status={txn.status} />
          </div>
          <div className="rounded-sm2 border border-line-subtle bg-muted/40 p-3">
            <p className="text-[11.5px] font-medium text-ink-3">Rincian Item</p>
            <p className="mt-1 text-ink">{txn.itemsSummary}</p>
          </div>
          <div className="flex justify-between border-t border-line-subtle pt-2.5">
            <span className="font-medium text-ink">Total Tagihan</span>
            <span className="font-mono text-[15px] font-bold text-ink">{formatRupiah(txn.total)}</span>
          </div>
        </div>

        {onUpdateStatus && (
          <div className="flex flex-wrap gap-2 pt-1">
            {txn.status !== "Selesai" && (
              <Button variant="dark" className="flex-1" onClick={() => update("Selesai")}>
                Tandai Selesai
              </Button>
            )}
            {txn.status !== "Dibatalkan" && (
              <Button variant="outline" className="flex-1" onClick={() => update("Dibatalkan")}>
                Batalkan Transaksi
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
