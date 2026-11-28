import { KpiCard } from "@/components/molecules/KpiCard";
import { TransactionsTable } from "@/components/organisms/transactions/TransactionsTable";
import type { PageId } from "@/config/nav";
import { formatRupiah, type PosTxn, type PosTxnStatus } from "@/data/mock";
import { RevenueBreakdown } from "./RevenueBreakdown";
import { SalesTrend } from "./SalesTrend";

interface OverviewViewProps {
  totalIncome: number;
  totalExpense: number;
  expenseCount: number;
  validTxnCount: number;
  branchFactor: number;
  transactions: PosTxn[];
  onNavigate: (page: PageId) => void;
  onUpdateStatus: (id: string, status: PosTxnStatus) => void;
}

export function OverviewView(props: OverviewViewProps) {
  const { totalIncome, totalExpense, onNavigate } = props;
  return (
    <div className="grid gap-3.5">
      <section aria-label="Ringkasan metrik utama" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
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
          delta={`${props.expenseCount} catatan`}
          bars={[0.5, 0.8, 0.4, 0.9, 0.45, 0.7, 1, 0.5, 0.75, 0.4, 0.6, 0.55]}
          hi={[6]}
        />
        <KpiCard
          label="LABA BERSIH"
          value={formatRupiah(totalIncome - totalExpense)}
          delta="+8,2%"
          bars={[0.7, 0.5, 0.85, 0.4, 0.9, 0.6, 0.5, 1, 0.45, 0.7, 0.55, 0.65]}
          hi={[7]}
        />
        <KpiCard
          label="TOTAL TRANSAKSI"
          value={`${props.validTxnCount}`}
          unit="Transaksi"
          delta="+4,1%"
          bars={[0.4, 0.75, 0.55, 0.9, 0.45, 0.8, 1, 0.5, 0.65, 0.35, 0.7, 0.5]}
          hi={[6]}
        />
      </section>

      <section className="grid gap-3.5 xl:grid-cols-[2.2fr_1fr]">
        <SalesTrend branchFactor={props.branchFactor} />
        <RevenueBreakdown
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          onOpenReports={() => onNavigate("reports")}
        />
      </section>

      <TransactionsTable
        transactions={props.transactions}
        onAddExpense={() => onNavigate("expenses")}
        onUpdateStatus={props.onUpdateStatus}
      />
    </div>
  );
}
