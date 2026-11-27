import { FileDown } from "lucide-react";
import { Button } from "../ui/Button";
import { DailyDatePill, type HeaderPeriod } from "../ui/DateControls";

export function PageHeader({
  title,
  subtitle,
  period,
  onPeriodChange,
  date,
  onDateChange,
  onExportCsv,
  action,
}: {
  title: string;
  subtitle?: string;
  period: HeaderPeriod;
  onPeriodChange: (p: HeaderPeriod) => void;
  date: string;
  onDateChange: (d: string) => void;
  onExportCsv?: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-[22px] font-medium leading-7 tracking-[-0.01em] text-ink">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[12.5px] text-ink-3">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <DailyDatePill
          period={period}
          onPeriodChange={onPeriodChange}
          date={date}
          onDateChange={onDateChange}
        />
        {onExportCsv && (
          <Button variant="dark" onClick={onExportCsv}>
            <FileDown className="size-3.5" /> Ekspor CSV
          </Button>
        )}
        {action}
      </div>
    </div>
  );
}
