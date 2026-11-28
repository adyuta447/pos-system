import { Trash2 } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { StackedText } from "@/components/atoms/StackedText";
import { DataTable } from "@/components/molecules/DataTable";
import { Panel } from "@/components/molecules/Panel";
import { formatRupiah, umkmOfBranch } from "@/data/mock";
import type { useCashEntriesView } from "@/hooks/useCashEntriesView";

interface CashEntriesTableProps {
  view: ReturnType<typeof useCashEntriesView>;
}

const COLUMNS = [
  { label: "TANGGAL" },
  { label: "UMKM / CABANG" },
  { label: "KATEGORI" },
  { label: "CATATAN" },
  { label: "SUMBER KAS" },
  { label: "NOMINAL", align: "right" as const },
  { label: "AKSI", align: "right" as const },
];

export function CashEntriesTable({ view }: CashEntriesTableProps) {
  const noun = view.copy.noun.toLowerCase();
  return (
    <Panel title={view.copy.listTitle} bodyClassName="overflow-hidden">
      <DataTable columns={COLUMNS} minWidth="min-w-[720px]">
        {view.visible.map((entry) => (
          <tr key={entry.id} className="h-[46px] border-b border-line-subtle hover:bg-[#FAFAF8]">
            <td className="px-4 whitespace-nowrap text-ink-2">{entry.date}</td>
            <td className="px-4">
              <StackedText primary={umkmOfBranch(entry.branchId)} secondary={entry.branchName} />
            </td>
            <td className="px-4 text-ink">{entry.category}</td>
            <td className="px-4 text-ink-2">{entry.note}</td>
            <td className="px-4">
              <span className="inline-block whitespace-nowrap rounded-full border border-line bg-muted/60 px-2.5 py-0.5 text-[11.5px] font-medium text-ink-2">
                {entry.source}
              </span>
            </td>
            <td className="px-4 text-right font-mono font-medium whitespace-nowrap text-ink">
              {formatRupiah(entry.amount)}
            </td>
            <td className="px-4 text-right">
              <IconButton
                onClick={() => view.setPendingDelete(entry)}
                aria-label={`Hapus ${entry.category} ${formatRupiah(entry.amount)}`}
                className="ml-auto !size-7 !rounded-xs2 text-ink-3 hover:text-ink"
              >
                <Trash2 className="size-3.5" />
              </IconButton>
            </td>
          </tr>
        ))}
        {view.visible.length === 0 && (
          <tr>
            <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-ink-3">
              {view.isFiltered
                ? `Tidak ada ${noun} yang cocok dengan filter.`
                : `Belum ada ${noun} pada rentang tanggal ini.`}
            </td>
          </tr>
        )}
      </DataTable>
    </Panel>
  );
}
