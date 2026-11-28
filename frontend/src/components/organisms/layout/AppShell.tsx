"use client";

import type { ReactNode } from "react";
import { useDisclosure } from "@/hooks/useDisclosure";
import { MobileSidebarDrawer } from "./MobileSidebarDrawer";
import type { PageId, UserRole } from "@/config/nav";
import type { BranchItem, PosTxn } from "@/data/mock";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  branches: BranchItem[];
  selectedBranchId: string;
  onBranchChange: (branchId: string) => void;
  transactions: PosTxn[];
  lowStockCount: number;
  pendingLicenseCount: number;
  children: ReactNode;
}

export function AppShell({ children, transactions, lowStockCount, pendingLicenseCount, ...nav }: AppShellProps) {
  const drawer = useDisclosure();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-app">
      <Sidebar {...nav} />
      <MobileSidebarDrawer {...nav} open={drawer.isOpen} onClose={drawer.close} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          activePage={nav.activePage}
          role={nav.role}
          onRoleChange={nav.onRoleChange}
          onNavigate={nav.onNavigate}
          transactions={transactions}
          lowStockCount={lowStockCount}
          pendingLicenseCount={pendingLicenseCount}
          onOpenMenu={drawer.open}
        />
        <main className="no-scrollbar flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
