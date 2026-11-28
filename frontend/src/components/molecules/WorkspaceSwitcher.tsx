"use client";

import type { UserRole } from "@/config/nav";
import type { BranchItem } from "@/data/mock";
import { useWorkspaceSwitcher } from "@/hooks/useWorkspaceSwitcher";
import { Select } from "./Select";

interface WorkspaceSwitcherProps {
  role: UserRole;
  branches: BranchItem[];
  selectedBranchId: string;
  onBranchChange: (branchId: string) => void;
}

export function WorkspaceSwitcher({ role, branches, selectedBranchId, onBranchChange }: WorkspaceSwitcherProps) {
  const ws = useWorkspaceSwitcher({ role, branches, selectedBranchId });

  return (
    <div className="rounded-ctrl bg-switcher p-2.5">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-sm2 bg-ink text-[14px] font-bold text-white">
          P
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[13px] font-semibold text-ink">{ws.primaryTitle}</span>
          <span className="block truncate text-[11px] text-ink-3">{ws.secondarySubtitle}</span>
        </div>
      </div>

      {ws.canFilterBranch && (
        <div className="mt-2">
          <Select
            size="sm"
            ariaLabel={ws.filterLabel}
            value={selectedBranchId}
            options={ws.options}
            onChange={onBranchChange}
          />
        </div>
      )}
    </div>
  );
}
