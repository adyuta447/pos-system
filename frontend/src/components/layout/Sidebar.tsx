"use client";

import { X } from "lucide-react";
import { NAV, type PageId, type UserRole } from "../../config/nav";
import type { BranchItem } from "../../data/mock";
import { cn } from "../../lib/cn";
import { UserCard } from "./UserCard";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

type SidebarProps = {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  branches: BranchItem[];
  selectedBranchId: string;
  onBranchChange: (branchId: string) => void;
  onCloseMobile?: () => void;
};

function SidebarContent({
  activePage,
  onNavigate,
  role,
  onRoleChange,
  branches,
  selectedBranchId,
  onBranchChange,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      <WorkspaceSwitcher
        role={role}
        branches={branches}
        selectedBranchId={selectedBranchId}
        onBranchChange={onBranchChange}
      />
      <nav aria-label="Navigasi Utama" className="no-scrollbar mt-4 flex-1 overflow-y-auto pr-0.5">
        {NAV.map((group, idx) => {
          const visibleItems = group.items.filter((item) => item.roles.includes(role));
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.title} className={cn(idx > 0 && "mt-3 border-t border-line pt-3")}>
              <p className="px-2 pb-2 text-[12px] font-medium text-ink-2">{group.title}</p>
              <ul className="space-y-0.5">
                {visibleItems.map(({ id, label, icon: Icon }) => {
                  const isActive = id === activePage;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate(id);
                          onCloseMobile?.();
                        }}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex h-[32px] w-full cursor-pointer items-center gap-2.5 rounded-sm2 px-2.5 text-left text-[13.5px] font-medium transition-colors",
                          isActive
                            ? "border border-line-subtle bg-card text-ink shadow-card"
                            : "text-ink-3 hover:bg-hover hover:text-ink",
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-4 shrink-0",
                            isActive ? "text-ink" : "text-ink-3",
                          )}
                          strokeWidth={isActive ? 2 : 1.5}
                          fill="none"
                        />
                        <span className="truncate">{label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
      <div className="pt-3">
        <UserCard role={role} onRoleChange={onRoleChange} />
      </div>
    </>
  );
}

export function Sidebar(props: Omit<SidebarProps, "onCloseMobile">) {
  return (
    <aside className="hidden w-[var(--sidebar-w)] shrink-0 flex-col border-r border-line bg-sidebar p-3.5 lg:flex">
      <SidebarContent {...props} />
    </aside>
  );
}

export function MobileSidebarDrawer({
  open,
  onClose,
  ...props
}: Omit<SidebarProps, "onCloseMobile"> & { open: boolean; onClose: () => void }) {
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
