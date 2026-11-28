import { useMemo, useState, type KeyboardEvent } from "react";
import { formatRupiah, type LinePoint } from "@/data/mock";

/** Ukuran viewBox dan batas area plot grafik garis. */
export const LINE_CHART = { width: 720, height: 240, left: 58, right: 704, top: 14, bottom: 210 } as const;
const { width, height, left, right, top, bottom } = LINE_CHART;
const plotW = right - left;
const plotH = bottom - top;

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

interface UseSalesLineChartProps {
  data: LinePoint[];
}

export function useSalesLineChart({ data }: UseSalesLineChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const n = data.length;
  const yMax = useMemo(() => niceMax(data), [data]);
  const yOf = (value: number) => top + plotH - (value / yMax) * plotH;

  const coords = data.map((d, i) => ({
    ...d,
    x: left + (n > 1 ? (i / (n - 1)) * plotW : plotW / 2),
    y: yOf(d.value),
  }));
  const linePath = coords.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = coords.length
    ? `${linePath} L${coords[n - 1].x.toFixed(1)},${bottom.toFixed(1)} L${coords[0].x.toFixed(1)},${bottom.toFixed(1)} Z`
    : "";
  const yTicks = Array.from({ length: 6 }, (_, i) => {
    const value = Math.round((yMax / 5) * i);
    return { value, y: yOf(value), label: formatAxisK(value) };
  });
  const xLabels = coords.filter((c, i) => coords.findIndex((o) => o.monthLabel === c.monthLabel) === i);
  const active = hoverIdx !== null ? coords[hoverIdx] : null;

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setHoverIdx((prev) => (prev === null ? 0 : Math.min(n - 1, prev + 1)));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setHoverIdx((prev) => (prev === null ? n - 1 : Math.max(0, prev - 1)));
    }
  }

  const tooltip = active && {
    title: active.label,
    rows: [{ dot: "ink" as const, label: "Penjualan", value: formatRupiah(active.value * 1000) }],
    style: {
      left: `calc(${(active.x / width) * 100}% + 10px)`,
      top: `${Math.min(68, Math.max(8, (active.y / height) * 100))}%`,
      transform: active.x / width > 0.72 ? "translateX(calc(-100% - 20px))" : undefined,
    },
  };

  return {
    coords,
    linePath,
    areaPath,
    yTicks,
    xLabels,
    active,
    stepW: n > 1 ? plotW / (n - 1) : plotW,
    tooltip,
    setHoverIdx,
    handleKeyDown,
  };
}
