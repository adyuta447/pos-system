"use client";

import { useMemo, useState } from "react";
import {
  AdminsView,
  BranchesView,
  ExpensesView,
  LogsView,
  ProductsView,
  ReportsView,
  SettingsView,
} from "../components/dashboard/AdminViews";
import { KpiCard } from "../components/dashboard/KpiCard";
import { RevenueBreakdown } from "../components/dashboard/RevenueBreakdown";
import { SalesTrend } from "../components/dashboard/SalesTrend";
import { TransactionsTable } from "../components/dashboard/TransactionsTable";
import { AppShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { type HeaderPeriod } from "../components/ui/DateControls";
import { isDateInFilter } from "../components/ui/DatePicker";
import { PAGE_TITLES, ROLE_META, type PageId, type UserRole } from "../config/nav";
import {
  formatRupiah,
  INITIAL_ADMINS,
  INITIAL_BRANCHES,
  INITIAL_EXPENSES,
  INITIAL_LOGS,
  INITIAL_PRODUCTS,
  INITIAL_TXNS,
  type AdminAccount,
  type AuditLogItem,
  type BranchItem,
  type ExpenseItem,
  type PosTxn,
  type PosTxnStatus,
  type ProductItem,
} from "../data/mock";

export default function DashboardPage() {
  const [role, setRole] = useState<UserRole>("superadmin");
  const [activePage, setActivePage] = useState<PageId>("overview");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [period, setPeriod] = useState<HeaderPeriod>("Harian");
  const [selectedDate, setSelectedDate] = useState<string>("27 Nov 2026");

  const [branches, setBranches] = useState<BranchItem[]>(INITIAL_BRANCHES);
  const [txns, setTxns] = useState<PosTxn[]>(INITIAL_TXNS);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [admins, setAdmins] = useState<AdminAccount[]>(INITIAL_ADMINS);
  const [logs, setLogs] = useState<AuditLogItem[]>(INITIAL_LOGS);

  const effectiveBranchId =
    role === "branch_admin" ? (ROLE_META.branch_admin.branchId ?? "cab-kemang") : selectedBranchId;

  function appendLog(action: string, target: string, detail: string) {
    const actor = ROLE_META[role];
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: "27 Nov 2026, Baru saja",
        actor: actor.name,
        roleLabel:
          role === "superadmin"
            ? "Superadmin"
            : role === "owner"
              ? "Admin Pusat"
              : "Admin Cabang",
        action,
        target,
        detail,
      },
      ...prev,
    ]);
  }

  const filteredTxns = useMemo(
    () =>
      txns.filter((t) => {
        const branchOk = effectiveBranchId === "all" || t.branchId === effectiveBranchId;
        const dateOk = isDateInFilter(t.date, selectedDate);
        return branchOk && dateOk;
      }),
    [effectiveBranchId, selectedDate, txns],
  );

  const filteredExpenses = useMemo(
    () =>
      expenses.filter((e) => {
        const branchOk = effectiveBranchId === "all" || e.branchId === effectiveBranchId;
        const dateOk = isDateInFilter(e.date, selectedDate);
        return branchOk && dateOk;
      }),
    [effectiveBranchId, expenses, selectedDate],
  );

  const filteredProducts = useMemo(
    () =>
      effectiveBranchId === "all"
        ? products
        : products.filter((p) => p.branchId === effectiveBranchId),
    [effectiveBranchId, products],
  );

  const visibleBranches = useMemo(
    () =>
      effectiveBranchId === "all"
        ? branches
        : branches.filter((b) => b.id === effectiveBranchId),
    [branches, effectiveBranchId],
  );

  const validTxns = useMemo(
    () => filteredTxns.filter((t) => t.status === "Selesai"),
    [filteredTxns],
  );

  const totalIncome = useMemo(
    () => validTxns.reduce((sum, t) => sum + t.total, 0),
    [validTxns],
  );
  const totalExpense = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses],
  );
  const netProfit = totalIncome - totalExpense;
  const branchFactor = effectiveBranchId === "all" ? 1 : 0.62;

  const lowStockCount = useMemo(
    () => filteredProducts.filter((p) => p.stock <= p.minStock).length,
    [filteredProducts],
  );
  const pendingLicenseCount = useMemo(
    () => branches.filter((b) => b.status === "Menunggu Aktivasi").length,
    [branches],
  );

  function handleRoleChange(nextRole: UserRole) {
    setRole(nextRole);
    if (nextRole === "branch_admin" && ["branches", "admins", "logs"].includes(activePage)) {
      setActivePage("overview");
    } else if (nextRole === "owner" && activePage === "logs") {
      setActivePage("overview");
    }
  }

  function handleUpdateTxnStatus(id: string, status: PosTxnStatus) {
    const target = txns.find((t) => t.id === id);
    setTxns((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    if (target) {
      appendLog(
        status === "Dibatalkan" ? "Batalkan Transaksi" : "Ubah Status Transaksi",
        target.receiptNo,
        `Status diubah menjadi ${status} (${formatRupiah(target.total)})`,
      );
    }
  }

  function handleAddExpense(item: Omit<ExpenseItem, "id" | "date">) {
    setExpenses((prev) => [
      { ...item, id: `exp-${Date.now()}`, date: "27 Nov 2026" },
      ...prev,
    ]);
    appendLog(
      "Catat Pengeluaran",
      item.branchName,
      `${item.category} ${formatRupiah(item.amount)} (${item.source})`,
    );
  }

  function handleDeleteExpense(id: string) {
    const target = expenses.find((e) => e.id === id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (target) {
      appendLog(
        "Hapus Pengeluaran",
        target.branchName,
        `${target.category} ${formatRupiah(target.amount)} dihapus`,
      );
    }
  }

  function handleAdjustStock(id: string, delta: number) {
    const target = products.find((p) => p.id === id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)),
    );
    if (target) {
      const nextStock = Math.max(0, target.stock + delta);
      appendLog("Penyesuaian Stok", target.name, `Stok diperbarui menjadi ${nextStock}`);
    }
  }

  function handleAddProduct(item: Omit<ProductItem, "id" | "active">) {
    setProducts((prev) => [{ ...item, id: `prd-${Date.now()}`, active: true }, ...prev]);
    appendLog("Tambah Produk", item.name, `Ditambahkan ke ${item.branchName} (${formatRupiah(item.price)})`);
  }

  function handleToggleLicense(branchId: string) {
    const target = branches.find((b) => b.id === branchId);
    setBranches((prev) =>
      prev.map((b) => {
        if (b.id !== branchId) return b;
        const activate = b.status !== "Aktif";
        return {
          ...b,
          status: activate ? "Aktif" : "Nonaktif",
          validUntil: activate ? "27 Des 2026" : "Dinonaktifkan",
        };
      }),
    );
    if (target) {
      const nextState = target.status !== "Aktif" ? "Aktif" : "Nonaktif";
      appendLog("Ubah Status Lisensi", target.name, `Lisensi ${target.licenseKey} -> ${nextState}`);
    }
  }

  function handleSaveAdmin(payload: {
    id?: string;
    name: string;
    email: string;
    role: UserRole;
    branchId: string;
  }) {
    const branchLabel =
      payload.role === "superadmin"
        ? "Seluruh Platform"
        : payload.role === "owner"
          ? "Kopi Laris (Semua Cabang)"
          : (branches.find((b) => b.id === payload.branchId)?.name ?? "Cabang Kemang");

    if (payload.id) {
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === payload.id
            ? {
                ...a,
                name: payload.name,
                email: payload.email,
                role: payload.role,
                branchId: payload.branchId,
                branchLabel,
              }
            : a,
        ),
      );
      appendLog("Ubah Akun Admin", payload.name, `Peran: ${payload.role} (${branchLabel})`);
      return;
    }

    setAdmins((prev) => [
      {
        id: `adm-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        branchId: payload.branchId,
        branchLabel,
        status: "Aktif",
        lastLogin: "Belum pernah",
      },
      ...prev,
    ]);
    appendLog("Tambah Akun Admin", payload.name, `Email ${payload.email} (${branchLabel})`);
  }

  function handleToggleAdminStatus(id: string) {
    const target = admins.find((a) => a.id === id);
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === "Aktif" ? "Nonaktif" : "Aktif" } : a,
      ),
    );
    if (target) {
      appendLog(
        "Ubah Status Admin",
        target.name,
        `Status menjadi ${target.status === "Aktif" ? "Nonaktif" : "Aktif"}`,
      );
    }
  }

  function handleDeleteAdmin(id: string) {
    const target = admins.find((a) => a.id === id);
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    if (target) {
      appendLog("Hapus Akun Admin", target.name, `Akun ${target.email} dihapus`);
    }
  }

  function handleExportCsv() {
    const header = "No Struk,Tanggal,Cabang,Kasir,Item,Metode,Pesanan,Status,Total\n";
    const rows = filteredTxns
      .map(
        (t) =>
          `"${t.receiptNo}","${t.date}","${t.branchName}","${t.cashier}","${t.itemsSummary}","${t.method}","${t.orderType}","${t.status}",${t.total}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-pos-${effectiveBranchId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const meta = ROLE_META[role];
  const headerTitle =
    activePage === "overview" ? `Selamat datang, ${meta.name.split(" ")[0]}` : PAGE_TITLES[activePage];
  const headerSubtitle =
    role === "branch_admin"
      ? "Laporan penjualan dan operasional Cabang Kemang"
      : effectiveBranchId === "all"
        ? `Menampilkan data seluruh cabang (${period}, ${selectedDate})`
        : `Menampilkan data ${branches.find((b) => b.id === effectiveBranchId)?.name ?? ""} (${period}, ${selectedDate})`;

  return (
    <AppShell
      activePage={activePage}
      onNavigate={setActivePage}
      role={role}
      onRoleChange={handleRoleChange}
      branches={branches}
      selectedBranchId={selectedBranchId}
      onBranchChange={setSelectedBranchId}
      transactions={filteredTxns}
      lowStockCount={lowStockCount}
      pendingLicenseCount={pendingLicenseCount}
    >
      <PageHeader
        title={headerTitle}
        subtitle={headerSubtitle}
        period={period}
        onPeriodChange={setPeriod}
        date={selectedDate}
        onDateChange={setSelectedDate}
        onExportCsv={handleExportCsv}
      />

      <div key={activePage} className="animate-page-in">
        {activePage === "overview" && (
        <div className="grid gap-3.5">
          <section
            aria-label="Ringkasan metrik utama"
            className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4"
          >
            <KpiCard
              label="TOTAL PEMASUKAN"
              value={formatRupiah(totalIncome)}
              delta="+12,4%"
              bars={[0.45, 0.7, 0.35, 0.8, 0.55, 0.75, 0.4, 1, 0.6, 0.5, 0.65, 0.45]}
              hi={[7]}
            />
            <KpiCard
              label="TOTAL PENGELUARAN"
              value={formatRupiah(totalExpense)}
              delta={`${filteredExpenses.length} catatan`}
              bars={[0.5, 0.8, 0.4, 0.9, 0.45, 0.7, 1, 0.5, 0.75, 0.4, 0.6, 0.55]}
              hi={[6]}
            />
            <KpiCard
              label="LABA BERSIH"
              value={formatRupiah(netProfit)}
              delta="+8,2%"
              bars={[0.7, 0.5, 0.85, 0.4, 0.9, 0.6, 0.5, 1, 0.45, 0.7, 0.55, 0.65]}
              hi={[7]}
            />
            <KpiCard
              label="TOTAL TRANSAKSI"
              value={`${validTxns.length}`}
              unit="Transaksi"
              delta="+4,1%"
              bars={[0.4, 0.75, 0.55, 0.9, 0.45, 0.8, 1, 0.5, 0.65, 0.35, 0.7, 0.5]}
              hi={[6]}
            />
          </section>

          <section className="grid gap-3.5 xl:grid-cols-[2.2fr_1fr]">
            <SalesTrend totalIncome={totalIncome} branchFactor={branchFactor} />
            <RevenueBreakdown
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              onOpenReports={() => setActivePage("reports")}
            />
          </section>

          <TransactionsTable
            transactions={filteredTxns}
            onAddExpense={() => setActivePage("expenses")}
            onUpdateStatus={handleUpdateTxnStatus}
          />
        </div>
      )}

      {activePage === "transactions" && (
        <TransactionsTable
          transactions={filteredTxns}
          title="SEMUA TRANSAKSI"
          fadeBottom={false}
          onAddExpense={() => setActivePage("expenses")}
          onUpdateStatus={handleUpdateTxnStatus}
        />
      )}

      {activePage === "expenses" && (
        <ExpensesView
          expenses={filteredExpenses}
          branches={visibleBranches}
          role={role}
          onAddExpense={handleAddExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      )}

      {activePage === "reports" && (
        <ReportsView
          transactions={filteredTxns}
          expenses={filteredExpenses}
          branches={visibleBranches}
        />
      )}

      {activePage === "products" && (
        <ProductsView
          products={filteredProducts}
          branches={visibleBranches}
          role={role}
          onAdjustStock={handleAdjustStock}
          onAddProduct={handleAddProduct}
        />
      )}

      {activePage === "branches" && role !== "branch_admin" && (
        <BranchesView
          branches={branches}
          role={role}
          onToggleLicense={handleToggleLicense}
        />
      )}

      {activePage === "admins" && role !== "branch_admin" && (
        <AdminsView
          admins={admins}
          branches={branches}
          currentRole={role}
          onSaveAdmin={handleSaveAdmin}
          onToggleStatus={handleToggleAdminStatus}
          onDeleteAdmin={handleDeleteAdmin}
        />
      )}

      {activePage === "logs" && role === "superadmin" && <LogsView logs={logs} />}

      {activePage === "settings" && <SettingsView role={role} />}
      </div>
    </AppShell>
  );
}
