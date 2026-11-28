import { Pencil, Trash2 } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { DataTable } from "@/components/molecules/DataTable";
import { ROLE_LABELS } from "@/config/roles";
import type { AdminAccount } from "@/data/mock";

interface AdminsTableProps {
  admins: AdminAccount[];
  onToggleStatus: (id: string) => void;
  onEdit: (admin: AdminAccount) => void;
  onDelete: (admin: AdminAccount) => void;
}

const COLUMNS = [
  { label: "NAMA ADMIN" },
  { label: "PERAN" },
  { label: "CAKUPAN CABANG" },
  { label: "LOGIN TERAKHIR" },
  { label: "STATUS" },
  { label: "AKSI", align: "right" as const },
];

export function AdminsTable({ admins, onToggleStatus, onEdit, onDelete }: AdminsTableProps) {
  return (
    <DataTable columns={COLUMNS} minWidth="min-w-[840px]">
      {admins.map((a) => (
        <tr key={a.id} className="h-[48px] border-b border-line-subtle hover:bg-[#FAFAF8]">
          <td className="px-4">
            <p className="font-medium text-ink">{a.name}</p>
            <p className="font-mono text-[11.5px] text-ink-3">{a.email}</p>
          </td>
          <td className="px-4 text-ink">{ROLE_LABELS[a.role]}</td>
          <td className="px-4 text-ink-2">{a.branchLabel}</td>
          <td className="px-4 font-mono text-[12px] text-ink-3">{a.lastLogin}</td>
          <td className="px-4">
            <button
              type="button"
              onClick={() => onToggleStatus(a.id)}
              className="cursor-pointer"
              title="Klik untuk ubah status aktif"
            >
              <StatusBadge status={a.status} />
            </button>
          </td>
          <td className="px-4">
            <div className="flex justify-end gap-1.5">
              <IconButton className="!size-7 !rounded-xs2" aria-label={`Ubah ${a.name}`} onClick={() => onEdit(a)}>
                <Pencil className="size-3.5" />
              </IconButton>
              <IconButton className="!size-7 !rounded-xs2" aria-label={`Hapus ${a.name}`} onClick={() => onDelete(a)}>
                <Trash2 className="size-3.5" />
              </IconButton>
            </div>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
