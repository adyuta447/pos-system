import { useState, type ComponentProps } from "react";
import type { ChartTooltip } from "@/components/atoms/ChartTooltip";
import { formatRupiah } from "@/data/mock";

/** Ukuran viewBox dan batas area plot grafik batang. */
export const BREAKDOWN_CHART = { width: 260, height: 176, left: 10, right: 254, top: 6, bottom: 172, lines: 8 } as const;
const { width, left, right, top, bottom, lines } = BREAKDOWN_CHART;
const plotH = bottom - top;

function roundTop(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
}

interface UseBreakdownChartProps {
  main: number[];
  ghost: number[];
}

export function useBreakdownChart({ main, ghost }: UseBreakdownChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const pitch = (right - left) / main.length;
  const centerOf = (i: number) => left + i * pitch + pitch / 2;

  const gridYs = Array.from({ length: lines }, (_, i) => top + (i * plotH) / (lines - 1));
  const bars = main.map((m, i) => {
    const cx = centerOf(i);
    const gh = ghost[i] * plotH;
    const mh = m * plotH;
    return {
      hitX: cx - pitch / 2,
      ghostPath: roundTop(cx - 3.5, bottom - gh, 7, gh, 2),
      mainPath: roundTop(cx - 2.5, bottom - mh, 5, mh, 2),
      dimmed: hoverIdx !== null && hoverIdx !== i,
    };
  });

  let tooltip: ComponentProps<typeof ChartTooltip> | null = null;
  if (hoverIdx !== null) {
    const ratio = centerOf(hoverIdx) / width;
    tooltip = {
      title: `Hari ke-${hoverIdx + 1}`,
      rows: [
        { dot: "new", label: "Pemasukan", value: formatRupiah(Math.round(ghost[hoverIdx] * 600000)) },
        { dot: "ink", label: "Pengeluaran", value: formatRupiah(Math.round(main[hoverIdx] * 600000)) },
      ],
      style: {
        left: `calc(${ratio * 100}% + 8px)`,
        top: "12%",
        transform: ratio > 0.6 ? "translateX(calc(-100% - 16px))" : undefined,
      },
    };
  }

  return { gridYs, bars, pitch, tooltip, setHoverIdx };
}
