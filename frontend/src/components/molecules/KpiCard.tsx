import { CircleArrowUp } from "lucide-react";
import { SparkBars } from "@/components/atoms/SparkBars";

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  delta: string;
  bars: number[];
  hi: number[];
}

export function KpiCard({ label, value, unit, delta, bars, hi }: KpiCardProps) {
  return (
    <article className="tray transition-transform duration-150 hover:-translate-y-0.5">
      <div className="inner-card flex items-start justify-between gap-3 px-4 py-3.5 transition-colors duration-150 hover:border-line">
        <div className="min-w-0">
          <p className="label-mono text-ink-2">{label}</p>
          <p className="mt-2.5 flex items-baseline gap-2">
            <span className="font-mono text-[22px] font-bold leading-6 tracking-[-0.01em] text-ink">
              {value}
            </span>
            {unit && <span className="text-[12px] text-ink-3">{unit}</span>}
          </p>
        </div>
        <SparkBars values={bars} highlight={hi} />
      </div>
      <footer className="flex items-center justify-between px-3 py-2 text-[12px] text-ink-3">
        <CircleArrowUp className="size-3.5 text-ink-4" strokeWidth={1.5} aria-hidden />
        <span>
          <b className="font-mono font-medium text-success-ink">{delta}</b> periode lalu
        </span>
      </footer>
    </article>
  );
}
