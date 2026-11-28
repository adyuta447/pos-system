"use client";

import { AdminsView } from "@/components/organisms/admins/AdminsView";
import { CashEntriesView } from "@/components/organisms/cash/CashEntriesView";
import { OverviewView } from "@/components/organisms/overview/OverviewView";
import { ProductsView } from "@/components/organisms/products/ProductsView";
import { BranchesView } from "@/components/organisms/system/BranchesView";
import { LogsView } from "@/components/organisms/system/LogsView";
import { ReportsView } from "@/components/organisms/system/ReportsView";
import { SettingsView } from "@/components/organisms/system/SettingsView";
import { TransactionsTable } from "@/components/organisms/transactions/TransactionsTable";
import type { Dashboard } from "@/hooks/useDashboard";

interface DashboardContentProps {
  dashboard: Dashboard;
}

/** Isi halaman sesuai menu aktif; menu yang tidak diizinkan untuk peran ini tidak dirender. */
export function DashboardContent({ dashboard: d }: DashboardContentProps) {
  const { role, activePage, view, cash } = d;
  const { branches } = d.branchStore;
  const goToExpenses = () => d.setActivePage("expenses");

  return (
    <div key={activePage} className="animate-page-in">
      {activePage === "overview" && (
        <OverviewView
          totalIncome={view.totalIncome}
          totalExpense={view.totalExpense}
          expenseCount={view.filteredExpenses.length}
          validTxnCount={view.validTxnCount}
          branchFactor={view.branchFactor}
          transactions={view.filteredTxns}
          onNavigate={d.setActivePage}
          onUpdateStatus={d.txnStore.updateStatus}
        />
      )}
      {activePage === "transactions" && (
        <TransactionsTable
          transactions={view.filteredTxns}
          title="SEMUA TRANSAKSI"
          fadeBottom={false}
          onAddExpense={goToExpenses}
          onUpdateStatus={d.txnStore.updateStatus}
        />
      )}
      {(activePage === "incomes" || activePage === "expenses") && (
        <CashEntriesView
          key={activePage}
          kind={activePage === "incomes" ? "income" : "expense"}
          entries={activePage === "incomes" ? view.filteredIncomes : view.filteredExpenses}
          branches={view.visibleBranches}
          role={role}
          onAdd={activePage === "incomes" ? cash.addIncome : cash.addExpense}
          onDelete={activePage === "incomes" ? cash.deleteIncome : cash.deleteExpense}
        />
      )}
      {activePage === "reports" && (
        <ReportsView
          transactions={view.filteredTxns}
          incomes={view.filteredIncomes}
          expenses={view.filteredExpenses}
          branches={view.visibleBranches}
        />
      )}
      {activePage === "products" && (
        <ProductsView
          products={view.filteredProducts}
          branches={view.visibleBranches}
          role={role}
          onAdjustStock={d.productStore.adjustStock}
          onAddProduct={d.productStore.addProduct}
        />
      )}
      {activePage === "branches" && role !== "branch_admin" && (
        <BranchesView branches={branches} role={role} onToggleLicense={d.branchStore.toggleLicense} />
      )}
      {activePage === "admins" && role !== "branch_admin" && (
        <AdminsView
          admins={d.adminStore.admins}
          branches={branches}
          currentRole={role}
          onSaveAdmin={d.adminStore.saveAdmin}
          onToggleStatus={d.adminStore.toggleStatus}
          onDeleteAdmin={d.adminStore.deleteAdmin}
        />
      )}
      {activePage === "logs" && role === "superadmin" && <LogsView logs={d.logs} />}
      {activePage === "settings" && <SettingsView role={role} />}
    </div>
  );
}
