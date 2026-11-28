"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Panel } from "@/components/molecules/Panel";
import { SearchInput } from "@/components/molecules/SearchInput";
import type { PosTxn, PosTxnStatus } from "@/data/mock";
import { useTransactionsTable } from "@/hooks/useTransactionsTable";
import { TransactionDetailDialog } from "./TransactionDetailDialog";
import { TransactionRow } from "./TransactionRow";
import { TransactionsFooter } from "./TransactionsFooter";
import { TransactionsHeadRow } from "./TransactionsHeadRow";

interface TransactionsTableProps {
  transactions: PosTxn[];
  title?: string;
  fadeBottom?: boolean;
  onAddExpense?: () => void;
  onUpdateStatus?: (id: string, status: PosTxnStatus) => void;
}

export function TransactionsTable({
  transactions,
  title = "TRANSAKSI TERBARU",
  fadeBottom = true,
  onAddExpense,
  onUpdateStatus,
}: TransactionsTableProps) {
  const table = useTransactionsTable({ transactions, fadeBottom });

  return (
    <>
      <Panel
        title={title}
        infoText="Klik header kolom untuk mengurutkan, atau tekan tombol aksi untuk melihat detail struk dan status."
        actions={
          <>
            <SearchInput
              variant="white"
              placeholder="Cari transaksi..."
              value={table.query}
              onChange={table.changeQuery}
              className="w-[225px] max-sm:hidden"
            />
            {onAddExpense && (
              <Button size="sm" onClick={onAddExpense}>
                <Plus className="size-3.5" /> Catat Pengeluaran
              </Button>
            )}
          </>
        }
        bodyClassName="overflow-hidden"
      >
        <div className="no-scrollbar overflow-x-auto">
          <div className="min-w-[920px]">
            <TransactionsHeadRow
              sortKey={table.sortKey}
              onSort={table.toggleSort}
              allSelected={table.allSelected}
              onToggleAll={table.toggleAll}
            />
            <div
              className={
                table.showBlurredPreview ? "[mask-image:linear-gradient(to_bottom,#000_62%,transparent_100%)]" : undefined
              }
            >
              {table.visibleRows.length === 0 ? (
                <div className="px-4 py-8 text-center text-[13px] text-ink-3">
                  Tidak ada transaksi yang sesuai dengan pencarian.
                </div>
              ) : (
                table.visibleRows.map((t) => (
                  <TransactionRow
                    key={t.id}
                    txn={t}
                    selected={table.isSelected(t.id)}
                    onToggle={() => table.toggleOne(t.id)}
                    onOpen={() => table.openDetail(t)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        <TransactionsFooter table={table} fadeBottom={fadeBottom} />
      </Panel>

      {table.detailTxn && (
        <TransactionDetailDialog txn={table.detailTxn} onClose={table.closeDetail} onUpdateStatus={onUpdateStatus} />
      )}
    </>
  );
}
