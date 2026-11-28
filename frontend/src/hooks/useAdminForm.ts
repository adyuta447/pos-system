import { useState, type FormEvent } from "react";
import type { UserRole } from "@/config/nav";
import type { AdminAccount, BranchItem } from "@/data/mock";

interface AdminSavePayload {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  branchId: string;
}

interface UseAdminFormProps {
  editing: AdminAccount | null;
  branches: BranchItem[];
  currentRole: UserRole;
  onSave: (payload: AdminSavePayload) => void;
  onClose: () => void;
}

const ALL_ROLE_OPTIONS = [
  { value: "branch_admin", label: "Admin Cabang" },
  { value: "owner", label: "Admin Pusat (Owner)" },
  { value: "superadmin", label: "Superadmin Platform" },
];

export function useAdminForm({ editing, branches, currentRole, onSave, onClose }: UseAdminFormProps) {
  const defaultBranch = branches[0]?.id ?? "cab-kemang";
  const [name, setName] = useState(editing?.name ?? "");
  const [email, setEmail] = useState(editing?.email ?? "");
  const [role, setRole] = useState<UserRole>(editing?.role ?? "branch_admin");
  const [branchId, setBranchId] = useState(
    !editing || editing.branchId === "all" ? defaultBranch : editing.branchId,
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave({
      id: editing?.id,
      name: name.trim(),
      email: email.trim(),
      role,
      branchId: role === "branch_admin" ? branchId : "all",
    });
    onClose();
  }

  return {
    name,
    setName,
    email,
    setEmail,
    role,
    setRole: (v: string) => setRole(v as UserRole),
    roleOptions: currentRole === "superadmin" ? ALL_ROLE_OPTIONS : ALL_ROLE_OPTIONS.slice(0, 1),
    branchId,
    setBranchId,
    branchOptions: branches.map((b) => ({ value: b.id, label: b.name })),
    handleSubmit,
  };
}
