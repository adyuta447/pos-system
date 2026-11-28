"use client";

import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { KpiCard } from "@/components/molecules/KpiCard";
import type { CashKind } from "@/config/cash";
import type { UserRole } from "@/config/nav";
import { formatRupiah, type BranchItem, type CashEntry } from "@/data/mock";
import { useCashEntriesView } from "@/hooks/useCashEntriesView";
import { CashEntriesTable } from "./CashEntriesTable";
import { CashEntryFilters } from "./CashEntryFilters";
import { CashEntryForm } from "./CashEntryForm";

interface CashEntriesViewProps {
  kind: CashKind;
  entries: CashEntry[];
  branches: BranchItem[];
  role: UserRole;
  onAdd: (item: Omit<CashEntry, "id" | "date">) => void;
  onDelete: (id: string) => void;
}

/** Halaman Pemasukan dan Pengeluaran: form catat + daftar dengan filter. */
export function CashEntriesView({ kind, entries, branches, role, onAdd, onDelete }: CashEntriesViewProps) {
  const view = useCashEntriesView({ kind, entries });
  const { copy, pendingDelete } = view;
  const label = copy.noun.toUpperCase();

  return (
    <div className="grid gap-4">
      <section className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <KpiCard
          label={`TOTAL ${label}`}
          value={formatRupiah(view.total)}
          delta={`${view.visible.length} catatan`}
          bars={[0.4, 0.65, 0.5, 0.85, 0.6, 0.7, 0.9, 0.55]}
          hi={[6]}
        />
        <KpiCard
          label={`${label} TUNAI (LACI)`}
          value={formatRupiah(view.totalCash)}
          delta={copy.cashDelta}
          bars={[0.5, 0.4, 0.75, 0.6, 0.8, 0.5, 0.65, 0.7]}
          hi={[4]}
        />
        <KpiCard
          label={`${label} NON-TUNAI`}
          value={formatRupiah(view.totalNonCash)}
          delta={copy.nonCashDelta}
          bars={[0.3, 0.5, 0.45, 0.7, 0.55, 0.85, 0.6, 0.4]}
          hi={[5]}
        />
      </section>

      <div className="grid gap-3.5 xl:grid-cols-[1fr_2fr]">
        <CashEntryForm kind={kind} branches={branches} role={role} onAdd={onAdd} />
        <div className="grid min-w-0 content-start gap-3">
          <CashEntryFilters view={view} />
          <CashEntriesTable view={view} />
        </div>
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title={`Hapus ${copy.noun.toLowerCase()}?`}
          message={
            <>
              <span className="font-medium text-ink">
                {pendingDelete.category} {formatRupiah(pendingDelete.amount)}
              </span>{" "}
              di {pendingDelete.branchName} ({pendingDelete.date}) akan dihapus permanen dan tidak dihitung lagi di
              laporan.
            </>
          }
          onConfirm={() => onDelete(pendingDelete.id)}
          onCancel={() => view.setPendingDelete(null)}
        />
      )}
    </div>
  );
}
