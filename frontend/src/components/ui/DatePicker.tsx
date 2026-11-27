"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
] as const;

const WEEKDAYS_ID = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] as const;

export function parseDisplayDate(label: string): Date | null {
  const parts = label.trim().split(" ");
  if (parts.length !== 3) return null;
  const day = Number(parts[0]);
  const monthIdx = MONTHS_SHORT.findIndex((m) => m.toLowerCase() === parts[1].toLowerCase());
  const year = Number(parts[2]);
  if (!day || monthIdx < 0 || !year) return null;
  return new Date(year, monthIdx, day);
}

export function formatDisplayDate(d: Date): string {
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatRangeLabel(start: Date, end: Date): string {
  if (start.getTime() === end.getTime()) return formatDisplayDate(start);
  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${start.getDate()} - ${end.getDate()} ${MONTHS_SHORT[end.getMonth()]} ${end.getFullYear()}`;
  }
  return `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`;
}

export function parseDateFilter(value: string): { start: Date; end: Date } | null {
  if (!value || value === "Semua Tanggal") return null;
  if (!value.includes(" - ")) {
    const single = parseDisplayDate(value);
    return single ? { start: single, end: single } : null;
  }
  const [left, right] = value.split(" - ").map((s) => s.trim());
  const end = parseDisplayDate(right);
  if (!end) return null;
  const start =
    parseDisplayDate(left) ??
    new Date(end.getFullYear(), end.getMonth(), Number(left) || end.getDate());
  return { start, end };
}

export function isDateInFilter(dateLabel: string, filterValue: string): boolean {
  const range = parseDateFilter(filterValue);
  if (!range) return true;
  const target = parseDisplayDate(dateLabel);
  if (!target) return true;
  const t = target.getTime();
  return t >= range.start.getTime() && t <= range.end.getTime();
}

export function DatePicker({
  value,
  onChange,
  highlightedDates = ["27 Nov 2026", "26 Nov 2026"],
}: {
  value: string;
  onChange: (dateLabel: string) => void;
  highlightedDates?: string[];
}) {
  const parsed = useMemo(() => parseDateFilter(value), [value]);
  const [mode, setMode] = useState<"single" | "range">(
    value.includes(" - ") ? "range" : "single",
  );
  const [rangeStart, setRangeStart] = useState<Date | null>(parsed?.start ?? null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(parsed?.end ?? null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const initialView = parsed?.end ?? new Date(2026, 10, 27);
  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());

  const daysGrid = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    // Konversi Minggu (0) ke indeks akhir pekan (6) agar minggu dimulai Senin.
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: Array<{ day: number | null; date?: Date; label?: string }> = [];

    for (let i = 0; i < startOffset; i++) {
      cells.push({ day: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      cells.push({ day: d, date, label: formatDisplayDate(date) });
    }
    return cells;
  }, [viewMonth, viewYear]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleDayClick(date: Date, label: string) {
    if (mode === "single") {
      onChange(label);
      return;
    }

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
      return;
    }

    const [start, end] =
      date.getTime() < rangeStart.getTime() ? [date, rangeStart] : [rangeStart, date];
    setRangeStart(start);
    setRangeEnd(end);
    onChange(formatRangeLabel(start, end));
  }

  const previewEnd = mode === "range" && rangeStart && !rangeEnd ? hoverDate : rangeEnd;
  const activeStartMs =
    rangeStart && previewEnd
      ? Math.min(rangeStart.getTime(), previewEnd.getTime())
      : rangeStart?.getTime() ?? null;
  const activeEndMs =
    rangeStart && previewEnd
      ? Math.max(rangeStart.getTime(), previewEnd.getTime())
      : rangeStart?.getTime() ?? null;

  return (
    <div className="tray w-[292px] shadow-pop">
      <div className="inner-card p-3">
        <div className="mb-2.5 flex rounded-sm2 bg-muted p-[3px]">
          {(
            [
              { id: "single", label: "Tanggal" },
              { id: "range", label: "Rentang" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setMode(tab.id);
                if (tab.id === "range") {
                  setRangeStart(null);
                  setRangeEnd(null);
                }
              }}
              className={cn(
                "flex-1 cursor-pointer rounded-xs2 py-1 text-[12px] transition-colors",
                mode === tab.id
                  ? "bg-card font-medium text-ink shadow-card"
                  : "text-ink-3 hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mb-2.5 flex items-center justify-between">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Bulan sebelumnya"
            className="grid size-7 cursor-pointer place-items-center rounded-sm2 border border-line bg-card text-ink-2 hover:bg-hover hover:text-ink"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span className="text-[13px] font-semibold text-ink">
            {MONTHS_ID[viewMonth]} <span className="font-mono">{viewYear}</span>
          </span>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Bulan berikutnya"
            className="grid size-7 cursor-pointer place-items-center rounded-sm2 border border-line bg-card text-ink-2 hover:bg-hover hover:text-ink"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS_ID.map((wd) => (
            <span key={wd} className="label-mono py-1 !text-[10px] text-ink-3">
              {wd}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {daysGrid.map((cell, idx) => {
            if (cell.day === null || !cell.label || !cell.date) {
              return <span key={`empty-${idx}`} className="h-8" />;
            }
            const ms = cell.date.getTime();
            const isSingleSelected = mode === "single" && cell.label === value;
            const isRangeCap =
              mode === "range" && (ms === activeStartMs || ms === activeEndMs);
            const isInRange =
              mode === "range" &&
              activeStartMs !== null &&
              activeEndMs !== null &&
              ms > activeStartMs &&
              ms < activeEndMs;
            const isSelected = isSingleSelected || isRangeCap;
            const hasData = highlightedDates.includes(cell.label);

            return (
              <button
                key={cell.label}
                type="button"
                onMouseEnter={() => {
                  if (mode === "range" && rangeStart && !rangeEnd) {
                    setHoverDate(cell.date!);
                  }
                }}
                onClick={() => handleDayClick(cell.date!, cell.label!)}
                className={cn(
                  "relative flex h-8 cursor-pointer flex-col items-center justify-center font-mono text-[12px] transition-colors",
                  isSelected
                    ? "rounded-sm2 bg-ink font-semibold text-white shadow-card"
                    : isInRange
                      ? "bg-muted text-ink"
                      : "rounded-sm2 text-ink hover:bg-hover",
                )}
              >
                <span>{cell.day}</span>
                {hasData && (
                  <span
                    className={cn(
                      "absolute bottom-1 size-1 rounded-full",
                      isSelected ? "bg-white" : "bg-ink-3",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        {mode === "range" && rangeStart && !rangeEnd && (
          <p className="mt-2 text-center text-[11.5px] text-ink-3">
            Pilih tanggal akhir rentang...
          </p>
        )}

        <div className="mt-3 grid grid-cols-3 gap-1.5 border-t border-line-subtle pt-2.5">
          <button
            type="button"
            onClick={() => {
              setViewYear(2026);
              setViewMonth(10);
              onChange("27 Nov 2026");
            }}
            className={cn(
              "cursor-pointer rounded-sm2 py-1.5 text-[11.5px] font-medium transition-colors",
              value === "27 Nov 2026"
                ? "bg-muted text-ink"
                : "border border-line bg-card text-ink-2 hover:bg-hover",
            )}
          >
            Hari Ini
          </button>
          <button
            type="button"
            onClick={() => {
              setViewYear(2026);
              setViewMonth(10);
              onChange("21 - 27 Nov 2026");
            }}
            className={cn(
              "cursor-pointer rounded-sm2 py-1.5 text-[11.5px] font-medium transition-colors",
              value === "21 - 27 Nov 2026"
                ? "bg-muted text-ink"
                : "border border-line bg-card text-ink-2 hover:bg-hover",
            )}
          >
            7 Hari
          </button>
          <button
            type="button"
            onClick={() => onChange("Semua Tanggal")}
            className={cn(
              "cursor-pointer rounded-sm2 py-1.5 text-[11.5px] font-medium transition-colors",
              value === "Semua Tanggal"
                ? "bg-ink text-white"
                : "border border-line bg-card text-ink-2 hover:bg-hover",
            )}
          >
            Semua
          </button>
        </div>
      </div>
    </div>
  );
}
