import { useState, type Dispatch, type SetStateAction } from "react";
import { formatRupiah, INITIAL_EXPENSES, INITIAL_INCOMES, type CashEntry } from "@/data/mock";
import type { AppendLog } from "./useAuditLog";

interface UseCashStoreProps {
  appendLog: AppendLog;
}

type NewCashEntry = Omit<CashEntry, "id" | "date">;

/** Tambah/hapus satu jenis catatan kas, beserta log audit dengan kata benda yang sesuai. */
function cashActions(
  list: CashEntry[],
  setList: Dispatch<SetStateAction<CashEntry[]>>,
  appendLog: AppendLog,
  noun: "Pengeluaran" | "Pemasukan",
  idPrefix: string,
) {
  return {
    add(item: NewCashEntry) {
      setList((prev) => [{ ...item, id: `${idPrefix}-${Date.now()}`, date: "27 Nov 2026" }, ...prev]);
      appendLog(`Catat ${noun}`, item.branchName, `${item.category} ${formatRupiah(item.amount)} (${item.source})`);
    },
    remove(id: string) {
      const target = list.find((e) => e.id === id);
      setList((prev) => prev.filter((e) => e.id !== id));
      if (target) {
        appendLog(`Hapus ${noun}`, target.branchName, `${target.category} ${formatRupiah(target.amount)} dihapus`);
      }
    },
  };
}

export function useCashStore({ appendLog }: UseCashStoreProps) {
  const [expenses, setExpenses] = useState<CashEntry[]>(INITIAL_EXPENSES);
  const [incomes, setIncomes] = useState<CashEntry[]>(INITIAL_INCOMES);
  const expenseActions = cashActions(expenses, setExpenses, appendLog, "Pengeluaran", "exp");
  const incomeActions = cashActions(incomes, setIncomes, appendLog, "Pemasukan", "inc");

  return {
    expenses,
    incomes,
    addExpense: expenseActions.add,
    deleteExpense: expenseActions.remove,
    addIncome: incomeActions.add,
    deleteIncome: incomeActions.remove,
  };
}
