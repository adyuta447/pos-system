"use client";

import { X } from "lucide-react";
import type { PageId, UserRole } from "@/config/nav";
import type { BranchItem } from "@/data/mock";
import { SidebarContent } from "./SidebarContent";

interface MobileSidebarDrawerProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  branches: BranchItem[];
  selectedBranchId: string;
  onBranchChange: (branchId: string) => void;
  open: boolean;
  onClose: () => void;
}

export function MobileSidebarDrawer({ open, onClose, ...props }: MobileSidebarDrawerProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="fixed inset-0 bg-ink/25 backdrop-blur-[1px]" onClick={onClose} />
      <aside className="relative z-10 flex h-full w-[260px] flex-col border-r border-line bg-sidebar p-3.5 shadow-window">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu navigasi"
            className="grid size-7 place-items-center rounded-sm2 border border-line bg-card text-ink-2"
          >
            <X className="size-4" />
          </button>
        </div>
        <SidebarContent {...props} onCloseMobile={onClose} />
      </aside>
    </div>
  );
}
