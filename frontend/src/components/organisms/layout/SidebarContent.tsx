"use client";

import { UserCard } from "@/components/molecules/UserCard";
import { WorkspaceSwitcher } from "@/components/molecules/WorkspaceSwitcher";
import type { PageId, UserRole } from "@/config/nav";
import type { BranchItem } from "@/data/mock";
import { useSidebarNav } from "@/hooks/useSidebarNav";
import { cn } from "@/lib/cn";

interface SidebarContentProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  branches: BranchItem[];
  selectedBranchId: string;
  onBranchChange: (branchId: string) => void;
  onCloseMobile?: () => void;
}

export function SidebarContent({ activePage, onNavigate, role, onRoleChange, onCloseMobile, ...ws }: SidebarContentProps) {
  const groups = useSidebarNav({ role });

  return (
    <>
      <WorkspaceSwitcher role={role} {...ws} />
      <nav aria-label="Navigasi Utama" className="no-scrollbar mt-4 flex-1 overflow-y-auto pr-0.5">
        {groups.map((group, idx) => (
          <div key={group.title} className={cn(idx > 0 && "mt-3 border-t border-line pt-3")}>
            <p className="px-2 pb-2 text-[12px] font-medium text-ink-2">{group.title}</p>
            <ul className="space-y-0.5">
              {group.items.map(({ id, label, icon: Icon }) => {
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
                        className={cn("size-4 shrink-0", isActive ? "text-ink" : "text-ink-3")}
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
        ))}
      </nav>
      <div className="pt-3">
        <UserCard role={role} onRoleChange={onRoleChange} />
      </div>
    </>
  );
}
