import { KpiCard } from "@/components/molecules/KpiCard";
import { formatRupiah, type BranchItem, type CashEntry, type PosTxn } from "@/data/mock";
import { useReports } from "@/hooks/useReports";
import { ReportsBranchTable } from "./ReportsBranchTable";

interface ReportsViewProps {
  transactions: PosTxn[];
  incomes: CashEntry[];
  expenses: CashEntry[];
  branches: BranchItem[];
}

export function ReportsView(props: ReportsViewProps) {
  const r = useReports(props);

  return (
    <div className="grid gap-4">
      <section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="PEMASUKAN BERSIH"
          value={formatRupiah(r.pemasukan)}
          delta={`${r.validTxnCount} transaksi + ${props.incomes.length} catatan lain`}
          bars={[0.45, 0.7, 0.55, 0.85, 0.6, 0.9, 0.75, 1]}
          hi={[7]}
        />
        <KpiCard
          label="PENGELUARAN"
          value={formatRupiah(r.pengeluaran)}
          delta={`${props.expenses.length} catatan biaya`}
          bars={[0.3, 0.45, 0.55, 0.4, 0.6, 0.5, 0.7, 0.45]}
          hi={[6]}
        />
        <KpiCard
          label="SELISIH BERSIH"
          value={formatRupiah(r.selisihBersih)}
          delta="Pemasukan - Pengeluaran"
          bars={[0.4, 0.6, 0.5, 0.8, 0.7, 0.85, 0.9, 0.95]}
          hi={[7]}
        />
        <KpiCard
          label="SISA TUNAI LACI"
          value={formatRupiah(r.sisaTunai)}
          delta={`QRIS: ${formatRupiah(r.qrisMasuk)}`}
          bars={[0.5, 0.6, 0.45, 0.75, 0.65, 0.8, 0.7, 0.85]}
          hi={[5]}
        />
      </section>
      <ReportsBranchTable rows={r.branchRows} />
    </div>
  );
}
