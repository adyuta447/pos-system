"use client";

import type { UserRole } from "../../config/nav";
import type { BranchItem } from "../../data/mock";
import { Select } from "../ui/Select";

export function WorkspaceSwitcher({
  role,
  branches,
  selectedBranchId,
  onBranchChange,
}: {
  role: UserRole;
  branches: BranchItem[];
  selectedBranchId: string;
  onBranchChange: (branchId: string) => void;
}) {
  const activeBranch = branches.find((b) => b.id === selectedBranchId);
  const canFilterBranch = role === "superadmin" || role === "owner";

  const options = [
    { value: "all", label: `Semua UMKM & Cabang (${branches.length})` },
    ...branches.map((b) => ({ value: b.id, label: b.umkmName, hint: b.name })),
  ];

  const primaryTitle =
    role === "branch_admin"
      ? "Kopi Laris Nusantara"
      : activeBranch
        ? activeBranch.umkmName
        : "Semua UMKM";

  const secondarySubtitle =
    role === "branch_admin"
      ? "Cabang Kemang"
      : activeBranch
        ? activeBranch.name
        : `${branches.length} Cabang Aktif`;

  return (
    <div className="rounded-ctrl bg-switcher p-2.5">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-sm2 bg-ink text-[14px] font-bold text-white">
          P
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[13px] font-semibold text-ink">
            {primaryTitle}
          </span>
          <span className="block truncate text-[11px] text-ink-3">
            {secondarySubtitle}
          </span>
        </div>
      </div>

      {canFilterBranch && (
        <div className="mt-2">
          <Select
            size="sm"
            ariaLabel="Filter UMKM dan cabang"
            value={selectedBranchId}
            options={options}
            onChange={onBranchChange}
          />
        </div>
      )}
    </div>
  );
}
