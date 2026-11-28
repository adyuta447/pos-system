import { useMemo } from "react";
import type { BranchItem, CashEntry, PosTxn, ProductItem } from "@/data/mock";
import { isDateInFilter } from "@/lib/date";
import { branchIdsInScope, inScope } from "@/lib/scope";

interface UseDashboardScopeProps {
  scope: string;
  selectedDate: string;
  branches: BranchItem[];
  txns: PosTxn[];
  expenses: CashEntry[];
  incomes: CashEntry[];
  products: ProductItem[];
}

const sumAmount = (list: CashEntry[]) => list.reduce((s, e) => s + e.amount, 0);

/** Data yang sudah difilter cabang/UMKM + tanggal, beserta total untuk KPI. */
export function useDashboardScope({ scope, selectedDate, branches, txns, expenses, incomes, products }: UseDashboardScopeProps) {
  const scopeIds = useMemo(() => branchIdsInScope(branches, scope), [branches, scope]);
  const inScopeAndDate = (x: { branchId: string; date: string }) =>
    inScope(scopeIds, x.branchId) && isDateInFilter(x.date, selectedDate);

  const filteredTxns = txns.filter(inScopeAndDate);
  const filteredExpenses = expenses.filter(inScopeAndDate);
  const filteredIncomes = incomes.filter(inScopeAndDate);
  const filteredProducts = products.filter((p) => inScope(scopeIds, p.branchId));
  const validTxns = filteredTxns.filter((t) => t.status === "Selesai");
  const totalIncome = validTxns.reduce((s, t) => s + t.total, 0) + sumAmount(filteredIncomes);
  const totalExpense = sumAmount(filteredExpenses);

  return {
    filteredTxns,
    filteredExpenses,
    filteredIncomes,
    filteredProducts,
    visibleBranches: branches.filter((b) => inScope(scopeIds, b.id)),
    validTxnCount: validTxns.length,
    totalIncome,
    totalExpense,
    branchFactor: scope === "all" ? 1 : 0.62,
    lowStockCount: filteredProducts.filter((p) => p.stock <= p.minStock).length,
    pendingLicenseCount: branches.filter((b) => b.status === "Menunggu Aktivasi").length,
  };
}
