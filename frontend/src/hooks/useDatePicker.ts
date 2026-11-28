import { useMemo, useState } from "react";
import { buildMonthGrid, formatRangeLabel, parseDateFilter } from "@/lib/date";

type DayCell = NonNullable<ReturnType<typeof buildMonthGrid>[number]>;

export type DatePickerMode = "single" | "range";

interface UseDatePickerProps {
  value: string;
  onChange: (dateLabel: string) => void;
}

const TODAY = new Date(2026, 10, 27);

export function useDatePicker({ value, onChange }: UseDatePickerProps) {
  const parsed = useMemo(() => parseDateFilter(value), [value]);
  const [mode, setMode] = useState<DatePickerMode>(value.includes(" - ") ? "range" : "single");
  const [rangeStart, setRangeStart] = useState<Date | null>(parsed?.start ?? null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(parsed?.end ?? null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const initialView = parsed?.end ?? TODAY;
  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());

  const daysGrid = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewMonth, viewYear]);

  function shiftMonth(delta: 1 | -1) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function selectMode(next: DatePickerMode) {
    setMode(next);
    if (next === "range") {
      setRangeStart(null);
      setRangeEnd(null);
    }
  }

  function selectDay({ date, label }: DayCell) {
    if (mode === "single") return onChange(label);
    if (!rangeStart || rangeEnd) {
      setRangeStart(date);
      setRangeEnd(null);
      return;
    }
    const [start, end] = date < rangeStart ? [date, rangeStart] : [rangeStart, date];
    setRangeStart(start);
    setRangeEnd(end);
    onChange(formatRangeLabel(start, end));
  }

  const awaitingRangeEnd = mode === "range" && !!rangeStart && !rangeEnd;
  const previewEnd = awaitingRangeEnd ? hoverDate : rangeEnd;
  const startMs = rangeStart?.getTime() ?? null;
  const endMs = previewEnd?.getTime() ?? null;
  const lo = startMs !== null && endMs !== null ? Math.min(startMs, endMs) : startMs;
  const hi = startMs !== null && endMs !== null ? Math.max(startMs, endMs) : startMs;

  function getDayState({ date, label }: DayCell) {
    const ms = date.getTime();
    const inRangeMode = mode === "range";
    return {
      isSelected: (!inRangeMode && label === value) || (inRangeMode && (ms === lo || ms === hi)),
      isInRange: inRangeMode && lo !== null && hi !== null && ms > lo && ms < hi,
    };
  }

  return {
    mode,
    selectMode,
    viewYear,
    viewMonth,
    daysGrid,
    prevMonth: () => shiftMonth(-1),
    nextMonth: () => shiftMonth(1),
    selectDay,
    hoverDay: (date: Date) => {
      if (awaitingRangeEnd) setHoverDate(date);
    },
    getDayState,
    awaitingRangeEnd,
    applyPreset: (label: string, resetView: boolean) => {
      if (resetView) {
        setViewYear(TODAY.getFullYear());
        setViewMonth(TODAY.getMonth());
      }
      onChange(label);
    },
  };
}
