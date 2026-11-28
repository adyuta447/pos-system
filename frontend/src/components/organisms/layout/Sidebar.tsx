import type { PageId, UserRole } from "@/config/nav";
import type { BranchItem } from "@/data/mock";
import { SidebarContent } from "./SidebarContent";

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  branches: BranchItem[];
  selectedBranchId: string;
  onBranchChange: (branchId: string) => void;
}

export function Sidebar(props: SidebarProps) {
  return (
    <aside className="hidden w-[var(--sidebar-w)] shrink-0 flex-col border-r border-line bg-sidebar p-3.5 lg:flex">
      <SidebarContent {...props} />
    </aside>
  );
}
