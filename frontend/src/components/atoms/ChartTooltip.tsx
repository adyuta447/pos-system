import type { CSSProperties } from "react";

interface ChartTooltipRow {
  dot: "new" | "ink";
  label: string;
  value: string;
}

interface ChartTooltipProps {
  title: string;
  rows: ChartTooltipRow[];
  style?: CSSProperties;
}

export function ChartTooltip({ title, rows, style }: ChartTooltipProps) {
  return (
    <div
      style={style}
      className="animate-pop-in pointer-events-none absolute z-10 w-[160px] rounded-ctrl bg-card p-1.5 shadow-pop"
    >
      <div className="rounded-xs2 bg-muted px-2.5 py-1.5 text-[12px] text-ink-3">{title}</div>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] text-ink-3">
          <span
            className={
              r.dot === "ink"
                ? "size-1.5 shrink-0 rounded-full bg-chart-ink"
                : "size-1.5 shrink-0 rounded-full border border-line bg-chart-new"
            }
          />
          <span className="flex-1 truncate">{r.label}</span>
          <span className="font-mono text-[14px] font-bold text-ink">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
