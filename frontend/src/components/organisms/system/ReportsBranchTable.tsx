import { StackedText } from "@/components/atoms/StackedText";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { DataTable } from "@/components/molecules/DataTable";
import { Panel } from "@/components/molecules/Panel";
import { formatRupiah } from "@/data/mock";
import type { ReportsData } from "@/hooks/useReports";

interface ReportsBranchTableProps {
  rows: ReportsData["branchRows"];
}

const COLUMNS = [
  { label: "UMKM / CABANG" },
  { label: "ADMIN CABANG" },
  { label: "PEMASUKAN", align: "right" as const },
  { label: "PENGELUARAN", align: "right" as const },
  { label: "SELISIH BERSIH", align: "right" as const },
  { label: "STATUS", align: "right" as const },
];

export function ReportsBranchTable({ rows }: ReportsBranchTableProps) {
  return (
    <Panel title="REKAP KEUANGAN PER CABANG" bodyClassName="overflow-hidden">
      <DataTable columns={COLUMNS} minWidth="min-w-[720px]">
        {rows.map(({ branch: b, income, expense, net }) => (
          <tr key={b.id} className="h-[48px] border-b border-line-subtle hover:bg-[#FAFAF8]">
            <td className="px-4">
              <StackedText primary={b.umkmName} secondary={`${b.name} · ${b.city}`} />
            </td>
            <td className="px-4 text-ink-2">{b.adminName}</td>
            <td className="px-4 text-right font-mono text-ink">{formatRupiah(income)}</td>
            <td className="px-4 text-right font-mono text-ink-2">{formatRupiah(expense)}</td>
            <td className="px-4 text-right font-mono font-semibold text-ink">{formatRupiah(net)}</td>
            <td className="px-4 text-right">
              <StatusBadge status={b.status} />
            </td>
          </tr>
        ))}
      </DataTable>
    </Panel>
  );
}
