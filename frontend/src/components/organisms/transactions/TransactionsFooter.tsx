import { ChevronDown } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Pagination } from "@/components/molecules/Pagination";
import type { useTransactionsTable } from "@/hooks/useTransactionsTable";

interface TransactionsFooterProps {
  table: ReturnType<typeof useTransactionsTable>;
  fadeBottom: boolean;
}

/** Tombol "Muat lebih banyak" saat pratinjau, atau info halaman + paginasi. */
export function TransactionsFooter({ table, fadeBottom }: TransactionsFooterProps) {
  return (
    <>
      {table.showBlurredPreview && (
        <div className="flex justify-center border-t border-line-subtle bg-card px-4 py-2.5">
          <Button size="sm" variant="outline" onClick={table.expand}>
            <ChevronDown className="size-3.5" />
            Muat lebih banyak ({table.filtered.length} transaksi)
          </Button>
        </div>
      )}

      {table.showPagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-subtle px-4 py-2.5 text-[12px] text-ink-3">
          <div className="flex items-center gap-3">
            <span>
              Menampilkan{" "}
              <strong className="font-mono font-medium text-ink">
                {table.startItem}-{table.endItem}
              </strong>{" "}
              dari <strong className="font-mono font-medium text-ink">{table.filtered.length}</strong> transaksi
            </span>
            {fadeBottom && (
              <button
                type="button"
                onClick={table.collapse}
                className="cursor-pointer text-[12px] font-medium text-ink-2 underline-offset-2 hover:text-ink hover:underline"
              >
                Ringkas
              </button>
            )}
          </div>
          <Pagination page={table.page} totalPages={table.totalPages} onPageChange={table.setPage} />
        </div>
      )}
    </>
  );
}
