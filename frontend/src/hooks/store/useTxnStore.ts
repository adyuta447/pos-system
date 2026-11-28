import { useState } from "react";
import { formatRupiah, INITIAL_TXNS, type PosTxn, type PosTxnStatus } from "@/data/mock";
import type { AppendLog } from "./useAuditLog";

interface UseTxnStoreProps {
  appendLog: AppendLog;
}

export function useTxnStore({ appendLog }: UseTxnStoreProps) {
  const [txns, setTxns] = useState<PosTxn[]>(INITIAL_TXNS);

  function updateStatus(id: string, status: PosTxnStatus) {
    const target = txns.find((t) => t.id === id);
    setTxns((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    if (target) {
      appendLog(
        status === "Dibatalkan" ? "Batalkan Transaksi" : "Ubah Status Transaksi",
        target.receiptNo,
        `Status diubah menjadi ${status} (${formatRupiah(target.total)})`,
      );
    }
  }

  return { txns, updateStatus };
}
