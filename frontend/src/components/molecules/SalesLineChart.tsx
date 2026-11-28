"use client";

import { ChartTooltip } from "@/components/atoms/ChartTooltip";
import type { LinePoint } from "@/data/mock";
import { LINE_CHART, useSalesLineChart } from "@/hooks/useSalesLineChart";
import { LineChartGrid } from "./LineChartGrid";

interface SalesLineChartProps {
  data: LinePoint[];
}

const { width, height, top, bottom } = LINE_CHART;

export function SalesLineChart({ data }: SalesLineChartProps) {
  const chart = useSalesLineChart({ data });
  const { active } = chart;

  return (
    <div
      className="relative outline-none"
      tabIndex={0}
      onMouseLeave={() => chart.setHoverIdx(null)}
      onKeyDown={chart.handleKeyDown}
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="block w-full" role="img" aria-label="Grafik garis tren penjualan">
        <defs>
          <linearGradient id="posLineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-ink)" stopOpacity="0.10" />
            <stop offset="100%" stopColor="var(--chart-ink)" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        <LineChartGrid yTicks={chart.yTicks} xLabels={chart.xLabels} activeMonth={active?.monthLabel} />

        <path d={chart.areaPath} fill="url(#posLineFill)" />
        <path
          key={chart.linePath}
          d={chart.linePath}
          fill="none"
          stroke="var(--chart-ink)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          className="animate-line-draw"
        />

        {active && (
          <g pointerEvents="none">
            <line x1={active.x} x2={active.x} y1={top} y2={bottom} stroke="var(--chart-ink)" strokeWidth={1} strokeDasharray="2 3" />
            <circle cx={active.x} cy={active.y} r={4.5} fill="var(--chart-ink)" stroke="#ffffff" strokeWidth={2} />
          </g>
        )}

        {chart.coords.map((pt, i) => (
          <rect
            key={pt.label + i}
            x={pt.x - chart.stepW / 2}
            y={top}
            width={chart.stepW}
            height={bottom - top}
            fill="transparent"
            onMouseEnter={() => chart.setHoverIdx(i)}
          />
        ))}
      </svg>

      {chart.tooltip && <ChartTooltip {...chart.tooltip} />}
    </div>
  );
}
