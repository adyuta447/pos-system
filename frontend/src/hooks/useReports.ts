import type { BranchItem, CashEntry, PosTxn } from "@/data/mock";

interface UseReportsProps {
  transactions: PosTxn[];
  incomes: CashEntry[];
  expenses: CashEntry[];
  branches: BranchItem[];
}

const sumTotal = (list: PosTxn[]) => list.reduce((s, t) => s + t.total, 0);
const sumAmount = (list: CashEntry[]) => list.reduce((s, e) => s + e.amount, 0);
const isCash = (e: CashEntry) => e.source === "Tunai (Laci)";

export function useReports({ transactions, incomes, expenses, branches }: UseReportsProps) {
  // Transaksi berstatus Dibatalkan tidak dihitung dalam total pemasukan.
  const validTxns = transactions.filter((t) => t.status === "Selesai");
  const pemasukan = sumTotal(validTxns) + sumAmount(incomes);
  const pengeluaran = sumAmount(expenses);
  const tunaiMasuk = sumTotal(validTxns.filter((t) => t.method === "Tunai")) + sumAmount(incomes.filter(isCash));
  const tunaiKeluar = sumAmount(expenses.filter(isCash));

  const branchRows = branches.map((b) => {
    const income =
      sumTotal(validTxns.filter((t) => t.branchId === b.id)) + sumAmount(incomes.filter((e) => e.branchId === b.id));
    const expense = sumAmount(expenses.filter((e) => e.branchId === b.id));
    return { branch: b, income, expense, net: income - expense };
  });

  return {
    validTxnCount: validTxns.length,
    pemasukan,
    pengeluaran,
    selisihBersih: pemasukan - pengeluaran,
    sisaTunai: tunaiMasuk - tunaiKeluar,
    qrisMasuk: sumTotal(validTxns.filter((t) => t.method === "QRIS")),
    branchRows,
  };
}

export type ReportsData = ReturnType<typeof useReports>;
