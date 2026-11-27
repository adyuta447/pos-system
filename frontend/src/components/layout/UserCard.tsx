"use client";

import { ROLE_META, type UserRole } from "../../config/nav";
import { Avatar } from "../ui/Avatar";
import { Select } from "../ui/Select";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "superadmin", label: "Superadmin Platform" },
  { value: "owner", label: "Admin Pusat (Owner)" },
  { value: "branch_admin", label: "Admin Cabang Kemang" },
];

export function UserCard({
  role,
  onRoleChange,
}: {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}) {
  const meta = ROLE_META[role];

  return (
    <div className="rounded-ctrl border border-line bg-card p-2 shadow-card">
      <div className="flex items-center gap-2.5">
        <Avatar alt={meta.name} initials={meta.initials} online />
        <div className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[13px] font-semibold text-ink">{meta.name}</span>
          <span className="block truncate text-[11px] text-ink-3">{meta.title}</span>
        </div>
      </div>
      <div className="mt-2">
        <Select
          size="sm"
          ariaLabel="Pilih peran simulasi"
          value={role}
          options={ROLE_OPTIONS}
          onChange={(v) => onRoleChange(v as UserRole)}
        />
      </div>
    </div>
  );
}
