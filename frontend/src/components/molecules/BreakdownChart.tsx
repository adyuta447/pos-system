"use client";

import { ChartTooltip } from "@/components/atoms/ChartTooltip";
import { BREAKDOWN_CHART, useBreakdownChart } from "@/hooks/useBreakdownChart";

interface BreakdownChartProps {
  main: number[];
  ghost: number[];
}

const { width, height, left, right, top, bottom } = BREAKDOWN_CHART;

export function BreakdownChart({ main, ghost }: BreakdownChartProps) {
  const chart = useBreakdownChart({ main, ghost });

  return (
    <div className="relative" onMouseLeave={() => chart.setHoverIdx(null)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block w-full"
        role="img"
        aria-label="Perbandingan pemasukan dan pengeluaran harian"
      >
        {chart.gridYs.map((y, i) => (
          <g key={i}>
            <line x1={left} x2={right} y1={y} y2={y} stroke="var(--chart-grid)" strokeWidth={1} strokeDasharray="1.5 3" />
            <line x1={0} x2={4} y1={y} y2={y} stroke="var(--ink-3)" strokeWidth={1} />
          </g>
        ))}
        {chart.bars.map((bar, i) => (
          <g
            key={i}
            style={{ opacity: bar.dimmed ? 0.45 : 1, transition: "opacity 120ms ease" }}
            onMouseEnter={() => chart.setHoverIdx(i)}
          >
            <rect x={bar.hitX} y={top} width={chart.pitch} height={bottom - top} fill="transparent" />
            <path d={bar.ghostPath} fill="var(--chart-new)" />
            <path d={bar.mainPath} fill="var(--chart-ink)" />
          </g>
        ))}
      </svg>

      {chart.tooltip && <ChartTooltip {...chart.tooltip} />}

      <div className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase text-ink-3">
        <span>1 NOV</span>
        <span className="size-1 rounded-full bg-ink-3" />
        <span className="h-px flex-1 border-t border-dotted border-chart-grid" />
        <span className="size-1 rounded-full bg-ink-3" />
        <span>27 NOV 2026</span>
      </div>
    </div>
  );
}
