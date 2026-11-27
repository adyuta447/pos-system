"use client";

import { useState } from "react";
import type { PageId, UserRole } from "../../config/nav";
import type { BranchItem, PosTxn } from "../../data/mock";
import { MobileSidebarDrawer, Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({
  activePage,
  onNavigate,
  role,
  onRoleChange,
  branches,
  selectedBranchId,
  onBranchChange,
  transactions,
  lowStockCount,
  pendingLicenseCount,
  children,
}: {
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
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-app">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        role={role}
        onRoleChange={onRoleChange}
        branches={branches}
        selectedBranchId={selectedBranchId}
        onBranchChange={onBranchChange}
      />
      <MobileSidebarDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activePage={activePage}
        onNavigate={onNavigate}
        role={role}
        onRoleChange={onRoleChange}
        branches={branches}
        selectedBranchId={selectedBranchId}
        onBranchChange={onBranchChange}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          activePage={activePage}
          role={role}
          onRoleChange={onRoleChange}
          onNavigate={onNavigate}
          transactions={transactions}
          lowStockCount={lowStockCount}
          pendingLicenseCount={pendingLicenseCount}
          onOpenMenu={() => setDrawerOpen(true)}
        />
        <main className="no-scrollbar flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
