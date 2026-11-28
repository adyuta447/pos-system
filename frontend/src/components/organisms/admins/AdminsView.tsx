"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { Panel } from "@/components/molecules/Panel";
import type { UserRole } from "@/config/nav";
import type { AdminAccount, BranchItem } from "@/data/mock";
import type { useAdminForm } from "@/hooks/useAdminForm";
import { useAdminsView } from "@/hooks/useAdminsView";
import { AdminFormDialog } from "./AdminFormDialog";
import { AdminsTable } from "./AdminsTable";

interface AdminsViewProps {
  admins: AdminAccount[];
  branches: BranchItem[];
  currentRole: UserRole;
  onSaveAdmin: Parameters<typeof useAdminForm>[0]["onSave"];
  onToggleStatus: (id: string) => void;
  onDeleteAdmin: (id: string) => void;
}

export function AdminsView({ admins, branches, currentRole, onSaveAdmin, onToggleStatus, onDeleteAdmin }: AdminsViewProps) {
  const view = useAdminsView({ admins, currentRole });
  const { pendingDelete } = view;

  return (
    <>
      <Panel
        title="MANAJEMEN AKUN ADMIN DAN HAK AKSES"
        actions={
          <Button size="sm" variant="dark" onClick={view.openCreate}>
            <Plus className="size-3.5" /> Tambah Admin
          </Button>
        }
        bodyClassName="overflow-hidden"
      >
        <AdminsTable
          admins={view.visibleAdmins}
          onToggleStatus={onToggleStatus}
          onEdit={view.openEdit}
          onDelete={view.setPendingDelete}
        />
      </Panel>

      {view.formOpen && (
        <AdminFormDialog
          editing={view.editing}
          branches={branches}
          currentRole={currentRole}
          onSave={onSaveAdmin}
          onClose={view.closeForm}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Hapus akun admin?"
          message={
            <>
              Akun <span className="font-medium text-ink">{pendingDelete.name}</span> ({pendingDelete.email}) akan
              dihapus dan tidak bisa login lagi. Jika hanya ingin menonaktifkan sementara, ubah statusnya menjadi
              Nonaktif.
            </>
          }
          confirmLabel="Hapus akun"
          onConfirm={() => onDeleteAdmin(pendingDelete.id)}
          onCancel={() => view.setPendingDelete(null)}
        />
      )}
    </>
  );
}
