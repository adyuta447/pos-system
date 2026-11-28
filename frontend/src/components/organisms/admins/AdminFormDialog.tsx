"use client";

import { TextInput } from "@/components/atoms/TextInput";
import { DialogActions } from "@/components/molecules/DialogActions";
import { FormField } from "@/components/molecules/FormField";
import { Modal } from "@/components/molecules/Modal";
import { Select } from "@/components/molecules/Select";
import type { UserRole } from "@/config/nav";
import type { AdminAccount, BranchItem } from "@/data/mock";
import { useAdminForm } from "@/hooks/useAdminForm";

interface AdminFormDialogProps {
  editing: AdminAccount | null;
  branches: BranchItem[];
  currentRole: UserRole;
  onSave: Parameters<typeof useAdminForm>[0]["onSave"];
  onClose: () => void;
}

/** Dipasang ulang setiap dibuka, sehingga isian awal selalu mengikuti akun yang diedit. */
export function AdminFormDialog(props: AdminFormDialogProps) {
  const form = useAdminForm(props);

  return (
    <Modal title={props.editing ? "Ubah Akun Admin" : "Tambah Akun Admin"} onClose={props.onClose}>
      <form onSubmit={form.handleSubmit} className="space-y-3">
        <FormField label="Nama Lengkap" htmlFor="admin-nama">
          <TextInput
            id="admin-nama"
            value={form.name}
            onChange={(e) => form.setName(e.target.value)}
            required
            placeholder="Contoh: Rina Novita"
          />
        </FormField>
        <FormField label="Email" htmlFor="admin-email">
          <TextInput
            id="admin-email"
            type="email"
            value={form.email}
            onChange={(e) => form.setEmail(e.target.value)}
            required
            placeholder="rina@kopilaris.id"
          />
        </FormField>
        <FormField label="Peran">
          <Select ariaLabel="Peran" value={form.role} options={form.roleOptions} onChange={form.setRole} />
        </FormField>
        {form.role === "branch_admin" && (
          <FormField label="Cabang">
            <Select ariaLabel="Cabang" value={form.branchId} options={form.branchOptions} onChange={form.setBranchId} />
          </FormField>
        )}
        <DialogActions onCancel={props.onClose} submitLabel="Simpan Akun" className="pt-2" />
      </form>
    </Modal>
  );
}
