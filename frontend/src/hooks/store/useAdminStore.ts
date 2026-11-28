import { useState } from "react";
import type { UserRole } from "@/config/nav";
import { INITIAL_ADMINS, type AdminAccount, type BranchItem } from "@/data/mock";
import type { AppendLog } from "./useAuditLog";

interface AdminSavePayload {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  branchId: string;
}

interface UseAdminStoreProps {
  appendLog: AppendLog;
  branches: BranchItem[];
}

export function useAdminStore({ appendLog, branches }: UseAdminStoreProps) {
  const [admins, setAdmins] = useState<AdminAccount[]>(INITIAL_ADMINS);

  function saveAdmin({ id, ...fields }: AdminSavePayload) {
    const branchLabel =
      fields.role === "superadmin"
        ? "Seluruh Platform"
        : fields.role === "owner"
          ? "Kopi Laris (Semua Cabang)"
          : (branches.find((b) => b.id === fields.branchId)?.name ?? "Cabang Kemang");

    if (id) {
      setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, ...fields, branchLabel } : a)));
      appendLog("Ubah Akun Admin", fields.name, `Peran: ${fields.role} (${branchLabel})`);
      return;
    }
    setAdmins((prev) => [
      { id: `adm-${Date.now()}`, ...fields, branchLabel, status: "Aktif", lastLogin: "Belum pernah" },
      ...prev,
    ]);
    appendLog("Tambah Akun Admin", fields.name, `Email ${fields.email} (${branchLabel})`);
  }

  function toggleStatus(id: string) {
    const target = admins.find((a) => a.id === id);
    const flip = (s: AdminAccount["status"]) => (s === "Aktif" ? "Nonaktif" : "Aktif");
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, status: flip(a.status) } : a)));
    if (target) appendLog("Ubah Status Admin", target.name, `Status menjadi ${flip(target.status)}`);
  }

  function deleteAdmin(id: string) {
    const target = admins.find((a) => a.id === id);
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    if (target) appendLog("Hapus Akun Admin", target.name, `Akun ${target.email} dihapus`);
  }

  return { admins, saveAdmin, toggleStatus, deleteAdmin };
}
