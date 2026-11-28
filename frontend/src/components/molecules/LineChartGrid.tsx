import { LINE_CHART } from "@/hooks/useSalesLineChart";

interface LineChartGridProps {
  yTicks: { value: number; y: number; label: string }[];
  xLabels: { x: number; monthLabel: string }[];
  activeMonth?: string;
}

const { left, right, top, bottom } = LINE_CHART;

/** Garis bantu horizontal + label sumbu Y, dan garis vertikal + label bulan. */
export function LineChartGrid({ yTicks, xLabels, activeMonth }: LineChartGridProps) {
  return (
    <>
      {yTicks.map((tick) => (
        <g key={tick.value}>
          <line
            x1={left}
            x2={right}
            y1={tick.y}
            y2={tick.y}
            stroke="var(--line-subtle)"
            strokeWidth={1}
            strokeDasharray={tick.value === 0 ? undefined : "2 3"}
          />
          <text
            x={left - 10}
            y={tick.y}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-ink-3"
            style={{ font: "400 11px var(--font-mono)" }}
          >
            {tick.label}
          </text>
        </g>
      ))}

      {xLabels.map((lbl) => {
        const isActive = activeMonth === lbl.monthLabel;
        return (
          <g key={lbl.monthLabel}>
            <line x1={lbl.x} x2={lbl.x} y1={top} y2={bottom} stroke="var(--line-subtle)" strokeWidth={0.75} />
            <text
              x={lbl.x}
              y={bottom + 18}
              textAnchor="middle"
              fill={isActive ? "var(--ink)" : "var(--ink-3)"}
              style={{ font: `${isActive ? 700 : 400} 11px var(--font-mono)` }}
            >
              {lbl.monthLabel}
            </text>
          </g>
        );
      })}
    </>
  );
}
