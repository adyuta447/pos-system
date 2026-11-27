"use client";

import { useMemo, useState } from "react";
import { formatRupiah, type LinePoint } from "../../data/mock";
import { ChartTooltip } from "./ChartTooltip";

const VBW = 720;
const VBH = 240;
const PADL = 58;
const PADR = 16;
const PADT = 14;
const PADB = 30;

function niceMax(points: LinePoint[]): number {
  const maxVal = Math.max(...points.map((p) => p.value), 1000);
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxVal)));
  const normalized = maxVal / magnitude;
  if (normalized <= 1) return magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

function formatAxisK(valInThousands: number): string {
  if (valInThousands === 0) return "Rp0";
  if (valInThousands >= 1000) {
    const jt = valInThousands / 1000;
    return `Rp${Number.isInteger(jt) ? jt : jt.toFixed(1)}jt`;
  }
  return `Rp${valInThousands}rb`;
}

export function SalesLineChart({ data }: { data: LinePoint[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const yMax = useMemo(() => niceMax(data), [data]);
  const plotW = VBW - PADL - PADR;
  const plotH = VBH - PADT - PADB;
  const n = data.length;

  const coords = useMemo(
    () =>
      data.map((d, i) => {
        const x = PADL + (n > 1 ? (i / (n - 1)) * plotW : plotW / 2);
        const y = PADT + plotH - (d.value / yMax) * plotH;
        return { x, y, ...d };
      }),
    [data, n, plotH, plotW, yMax],
  );

  const linePath = useMemo(() => {
    if (coords.length === 0) return "";
    return coords.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  }, [coords]);

  const areaPath = useMemo(() => {
    if (coords.length === 0) return "";
    const first = coords[0];
    const last = coords[coords.length - 1];
    return `${linePath} L${last.x.toFixed(1)},${(PADT + plotH).toFixed(1)} L${first.x.toFixed(1)},${(PADT + plotH).toFixed(1)} Z`;
  }, [coords, linePath, plotH]);

  const yTicks = useMemo(() => {
    const steps = 5;
    return Array.from({ length: steps + 1 }, (_, i) => Math.round((yMax / steps) * i));
  }, [yMax]);

  const xLabels = useMemo(() => {
    const seen = new Set<string>();
    return coords.filter((c) => {
      if (seen.has(c.monthLabel)) return false;
      seen.add(c.monthLabel);
      return true;
    });
  }, [coords]);

  const active = hoverIdx !== null ? coords[hoverIdx] : null;

  return (
    <div
      className="relative outline-none"
      tabIndex={0}
      onMouseLeave={() => setHoverIdx(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setHoverIdx((prev) => (prev === null ? 0 : Math.min(n - 1, prev + 1)));
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          setHoverIdx((prev) => (prev === null ? n - 1 : Math.max(0, prev - 1)));
        }
      }}
    >
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        className="block w-full"
        role="img"
        aria-label="Grafik garis tren penjualan"
      >
        <defs>
          <linearGradient id="posLineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-ink)" stopOpacity="0.10" />
            <stop offset="100%" stopColor="var(--chart-ink)" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = PADT + plotH - (tick / yMax) * plotH;
          return (
            <g key={tick}>
              <line
                x1={PADL}
                x2={VBW - PADR}
                y1={y}
                y2={y}
                stroke="var(--line-subtle)"
                strokeWidth={1}
                strokeDasharray={tick === 0 ? undefined : "2 3"}
              />
              <text
                x={PADL - 10}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-ink-3"
                style={{ font: "400 11px var(--font-mono)" }}
              >
                {formatAxisK(tick)}
              </text>
            </g>
          );
        })}

        {xLabels.map((lbl) => (
          <g key={lbl.monthLabel}>
            <line
              x1={lbl.x}
              x2={lbl.x}
              y1={PADT}
              y2={PADT + plotH}
              stroke="var(--line-subtle)"
              strokeWidth={0.75}
            />
            <text
              x={lbl.x}
              y={PADT + plotH + 18}
              textAnchor="middle"
              fill={active?.monthLabel === lbl.monthLabel ? "var(--ink)" : "var(--ink-3)"}
              style={{
                font: `${active?.monthLabel === lbl.monthLabel ? 700 : 400} 11px var(--font-mono)`,
              }}
            >
              {lbl.monthLabel}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#posLineFill)" />
        <path
          key={linePath}
          d={linePath}
          fill="none"
          stroke="var(--chart-ink)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          className="animate-line-draw"
        />

        {active && (
          <g pointerEvents="none">
            <line
              x1={active.x}
              x2={active.x}
              y1={PADT}
              y2={PADT + plotH}
              stroke="var(--chart-ink)"
              strokeWidth={1}
              strokeDasharray="2 3"
            />
            <circle
              cx={active.x}
              cy={active.y}
              r={4.5}
              fill="var(--chart-ink)"
              stroke="#ffffff"
              strokeWidth={2}
            />
          </g>
        )}

        {coords.map((pt, i) => {
          const stepW = n > 1 ? plotW / (n - 1) : plotW;
          return (
            <rect
              key={pt.label + i}
              x={pt.x - stepW / 2}
              y={PADT}
              width={stepW}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
            />
          );
        })}
      </svg>

      {active && (
        <ChartTooltip
          title={active.label}
          rows={[{ dot: "ink", label: "Penjualan", value: formatRupiah(active.value * 1000) }]}
          style={{
            left: `calc(${(active.x / VBW) * 100}% + 10px)`,
            top: `${Math.min(68, Math.max(8, (active.y / VBH) * 100))}%`,
            transform: active.x / VBW > 0.72 ? "translateX(calc(-100% - 20px))" : undefined,
          }}
        />
      )}
    </div>
  );
}
