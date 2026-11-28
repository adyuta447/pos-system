import { useState } from "react";
import type { HeaderPeriod } from "@/components/molecules/DailyDatePill";
import { PAGE_TITLES, ROLE_META, type PageId, type UserRole } from "@/config/nav";
import { downloadCsv } from "@/lib/csv";
import { scopeLabel } from "@/lib/scope";
import { useAdminStore } from "./store/useAdminStore";
import { useAuditLog } from "./store/useAuditLog";
import { useBranchStore } from "./store/useBranchStore";
import { useCashStore } from "./store/useCashStore";
import { useDashboardScope } from "./store/useDashboardScope";
import { useProductStore } from "./store/useProductStore";
import { useTxnStore } from "./store/useTxnStore";

/** Seluruh state halaman dashboard: navigasi, peran, filter, dan data per modul. */
export function useDashboard() {
  const [role, setRole] = useState<UserRole>("superadmin");
  const [activePage, setActivePage] = useState<PageId>("overview");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [period, setPeriod] = useState<HeaderPeriod>("Harian");
  const [selectedDate, setSelectedDate] = useState<string>("27 Nov 2026");

  const audit = useAuditLog({ role });
  const { appendLog } = audit;
  const branchStore = useBranchStore({ appendLog });
  const txnStore = useTxnStore({ appendLog });
  const cash = useCashStore({ appendLog });
  const productStore = useProductStore({ appendLog });
  const adminStore = useAdminStore({ appendLog, branches: branchStore.branches });

  const scope = role === "branch_admin" ? (ROLE_META.branch_admin.branchId ?? "cab-kemang") : selectedBranchId;
  const view = useDashboardScope({
    scope,
    selectedDate,
    branches: branchStore.branches,
    txns: txnStore.txns,
    expenses: cash.expenses,
    incomes: cash.incomes,
    products: productStore.products,
  });

  function changeRole(nextRole: UserRole) {
    setRole(nextRole);
    // Superadmin memfilter per UMKM, owner per cabang: pilihan lama tidak berlaku lagi.
    setSelectedBranchId("all");
    const hidden: PageId[] = nextRole === "branch_admin" ? ["branches", "admins", "logs"] : nextRole === "owner" ? ["logs"] : [];
    if (hidden.includes(activePage)) setActivePage("overview");
  }

  function exportCsv() {
    const header = ["No Struk", "Tanggal", "Cabang", "Kasir", "Item", "Metode", "Pesanan", "Status", "Total"];
    const rows = view.filteredTxns.map((t) => [
      t.receiptNo, t.date, t.branchName, t.cashier, t.itemsSummary, t.method, t.orderType, t.status, String(t.total),
    ]);
    downloadCsv(`laporan-pos-${scope.replace(/[^a-z0-9-]+/gi, "-")}`, [header, ...rows]);
  }

  const headerTitle =
    activePage === "overview" ? `Selamat datang, ${ROLE_META[role].name.split(" ")[0]}` : PAGE_TITLES[activePage];
  const headerSubtitle =
    role === "branch_admin"
      ? "Laporan penjualan dan operasional Cabang Kemang"
      : scope === "all"
        ? `Menampilkan data seluruh cabang (${period}, ${selectedDate})`
        : `Menampilkan data ${scopeLabel(branchStore.branches, scope)} (${period}, ${selectedDate})`;

  return {
    role, changeRole, activePage, setActivePage, selectedBranchId, setSelectedBranchId,
    period, setPeriod, selectedDate, setSelectedDate, headerTitle, headerSubtitle, exportCsv,
    view, logs: audit.logs, branchStore, txnStore, cash, productStore, adminStore,
  };
}

export type Dashboard = ReturnType<typeof useDashboard>;
