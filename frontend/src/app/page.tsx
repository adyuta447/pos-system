"use client";

import { DashboardContent } from "@/components/organisms/DashboardContent";
import { AppShell } from "@/components/organisms/layout/AppShell";
import { PageHeader } from "@/components/organisms/layout/PageHeader";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const d = useDashboard();
  const { view } = d;

  return (
    <AppShell
      activePage={d.activePage}
      onNavigate={d.setActivePage}
      role={d.role}
      onRoleChange={d.changeRole}
      branches={d.branchStore.branches}
      selectedBranchId={d.selectedBranchId}
      onBranchChange={d.setSelectedBranchId}
      transactions={view.filteredTxns}
      lowStockCount={view.lowStockCount}
      pendingLicenseCount={view.pendingLicenseCount}
    >
      <PageHeader
        title={d.headerTitle}
        subtitle={d.headerSubtitle}
        period={d.period}
        onPeriodChange={d.setPeriod}
        date={d.selectedDate}
        onDateChange={d.setSelectedDate}
        onExportCsv={d.exportCsv}
      />
      <DashboardContent dashboard={d} />
    </AppShell>
  );
}
