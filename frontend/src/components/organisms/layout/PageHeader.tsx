import type { ReactNode } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { DailyDatePill, type HeaderPeriod } from "@/components/molecules/DailyDatePill";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  period: HeaderPeriod;
  onPeriodChange: (p: HeaderPeriod) => void;
  date: string;
  onDateChange: (d: string) => void;
  onExportCsv?: () => void;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, onExportCsv, action, ...dateProps }: PageHeaderProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-[22px] font-medium leading-7 tracking-[-0.01em] text-ink">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[12.5px] text-ink-3">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <DailyDatePill {...dateProps} />
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
