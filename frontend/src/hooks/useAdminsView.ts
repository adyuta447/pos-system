import { useMemo, useState } from "react";
import type { UserRole } from "@/config/nav";
import type { AdminAccount } from "@/data/mock";

interface UseAdminsViewProps {
  admins: AdminAccount[];
  currentRole: UserRole;
}

export function useAdminsView({ admins, currentRole }: UseAdminsViewProps) {
  const [formOpen, setFormOpen] = useState(false);
  // null = tambah admin baru; berisi akun = ubah akun itu.
  const [editing, setEditing] = useState<AdminAccount | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminAccount | null>(null);

  const visibleAdmins = useMemo(
    () => (currentRole === "superadmin" ? admins : admins.filter((a) => a.role === "branch_admin")),
    [admins, currentRole],
  );

  return {
    visibleAdmins,
    formOpen,
    editing,
    openCreate: () => {
      setEditing(null);
      setFormOpen(true);
    },
    openEdit: (a: AdminAccount) => {
      setEditing(a);
      setFormOpen(true);
    },
    closeForm: () => setFormOpen(false),
    pendingDelete,
    setPendingDelete,
  };
}
