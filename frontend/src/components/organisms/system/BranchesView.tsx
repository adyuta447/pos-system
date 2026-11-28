import { Button } from "@/components/atoms/Button";
import { StackedText } from "@/components/atoms/StackedText";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { DataTable } from "@/components/molecules/DataTable";
import { Panel } from "@/components/molecules/Panel";
import type { UserRole } from "@/config/nav";
import type { BranchItem } from "@/data/mock";

interface BranchesViewProps {
  branches: BranchItem[];
  role: UserRole;
  onToggleLicense: (branchId: string) => void;
}

export function BranchesView({ branches, role, onToggleLicense }: BranchesViewProps) {
  const canManage = role === "superadmin";
  const columns = [
    { label: "UMKM / CABANG" },
    { label: "ADMIN" },
    { label: "KUNCI LISENSI" },
    { label: "MASA AKTIF" },
    { label: "STATUS" },
    canManage && { label: "AKSI", align: "right" as const },
  ];

  return (
    <Panel title="MANAJEMEN CABANG DAN LISENSI LANGGANAN" bodyClassName="overflow-hidden">
      <DataTable columns={columns} minWidth="min-w-[840px]">
        {branches.map((b) => (
          <tr key={b.id} className="h-[48px] border-b border-line-subtle hover:bg-[#FAFAF8]">
            <td className="px-4">
              <StackedText primary={b.umkmName} secondary={`${b.name} · ${b.city}`} />
            </td>
            <td className="px-4 text-ink-2">{b.adminName}</td>
            <td className="px-4 font-mono text-[12px] text-ink-2">{b.licenseKey}</td>
            <td className="px-4 text-ink-2">{b.validUntil}</td>
            <td className="px-4">
              <StatusBadge status={b.status} />
            </td>
            {canManage && (
              <td className="px-4 text-right">
                <Button
                  size="sm"
                  variant={b.status === "Aktif" ? "outline" : "dark"}
                  onClick={() => onToggleLicense(b.id)}
                >
                  {b.status === "Aktif" ? "Nonaktifkan" : "Aktifkan Lisensi"}
                </Button>
              </td>
            )}
          </tr>
        ))}
      </DataTable>
    </Panel>
  );
}
