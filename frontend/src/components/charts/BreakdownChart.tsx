"use client";

import { useState } from "react";
import { formatRupiah } from "../../data/mock";
import { ChartTooltip } from "./ChartTooltip";

type Props = {
  main: number[];
  ghost: number[];
};

const VBW = 260;
const VBH = 176;
const PADL = 10;
const PADR = 6;
const LINES = 8;
const TOP = 6;
const BOT = VBH - 4;

function roundTop(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
}

export function BreakdownChart({ main, ghost }: Props) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const n = main.length;
  const plotW = VBW - PADL - PADR;
  const pitch = plotW / n;
  const plotH = BOT - TOP;
  const lineGap = plotH / (LINES - 1);

  const activeCx = hoverIdx !== null ? PADL + hoverIdx * pitch + pitch / 2 : 0;

  return (
    <div className="relative" onMouseLeave={() => setHoverIdx(null)}>
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        className="block w-full"
        role="img"
        aria-label="Perbandingan pemasukan dan pengeluaran harian"
      >
        {Array.from({ length: LINES }, (_, i) => {
          const y = TOP + i * lineGap;
          return (
            <g key={i}>
              <line
                x1={PADL}
                x2={VBW - PADR}
                y1={y}
                y2={y}
                stroke="var(--chart-grid)"
                strokeWidth={1}
                strokeDasharray="1.5 3"
              />
              <line x1={0} x2={4} y1={y} y2={y} stroke="var(--ink-3)" strokeWidth={1} />
            </g>
          );
        })}
        {main.map((m, i) => {
          const cx = PADL + i * pitch + pitch / 2;
          const gh = ghost[i] * plotH;
          const mh = m * plotH;
          const dimmed = hoverIdx !== null && hoverIdx !== i;
          return (
            <g
              key={i}
              style={{ opacity: dimmed ? 0.45 : 1, transition: "opacity 120ms ease" }}
              onMouseEnter={() => setHoverIdx(i)}
            >
              <rect
                x={cx - pitch / 2}
                y={TOP}
                width={pitch}
                height={plotH}
                fill="transparent"
              />
              <path d={roundTop(cx - 3.5, BOT - gh, 7, gh, 2)} fill="var(--chart-new)" />
              <path d={roundTop(cx - 2.5, BOT - mh, 5, mh, 2)} fill="var(--chart-ink)" />
            </g>
          );
        })}
      </svg>

      {hoverIdx !== null && (
        <ChartTooltip
          title={`Hari ke-${hoverIdx + 1}`}
          rows={[
            {
              dot: "new",
              label: "Pemasukan",
              value: formatRupiah(Math.round(ghost[hoverIdx] * 600000)),
            },
            {
              dot: "ink",
              label: "Pengeluaran",
              value: formatRupiah(Math.round(main[hoverIdx] * 600000)),
            },
          ]}
          style={{
            left: `calc(${(activeCx / VBW) * 100}% + 8px)`,
            top: "12%",
            transform: activeCx / VBW > 0.6 ? "translateX(calc(-100% - 16px))" : undefined,
          }}
        />
      )}

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
