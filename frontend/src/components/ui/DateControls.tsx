"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";
import { DatePicker } from "./DatePicker";

export const PERIOD_OPTIONS = ["Harian", "Mingguan", "Bulanan"] as const;
export type HeaderPeriod = (typeof PERIOD_OPTIONS)[number];

export const RANGE_OPTIONS = [
  "1 Nov - 27 Nov",
  "1 Okt - 27 Nov",
  "1 Jan - 27 Nov",
] as const;

export function DailyDatePill({
  period,
  onPeriodChange,
  date,
  onDateChange,
}: {
  period: HeaderPeriod;
  onPeriodChange: (p: HeaderPeriod) => void;
  date: string;
  onDateChange: (d: string) => void;
}) {
  const [openMenu, setOpenMenu] = useState<"period" | "date" | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenMenu(null);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative flex h-9 items-stretch rounded-ctrl border border-line bg-card text-[13px] shadow-card"
    >
      <button
        type="button"
        onClick={() => setOpenMenu((m) => (m === "period" ? null : "period"))}
        className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-l-ctrl px-3 hover:bg-hover"
      >
        {period}
        <ChevronDown className="size-3.5 text-ink-3" />
      </button>
      <span className="w-px bg-line" />
      <button
        type="button"
        onClick={() => setOpenMenu((m) => (m === "date" ? null : "date"))}
        className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-r-ctrl px-3 hover:bg-hover"
      >
        <CalendarDays className="size-3.5 text-ink-3" />
        <span>{date}</span>
      </button>

      {openMenu === "period" && (
        <div className="animate-pop-in absolute top-full left-0 z-50 mt-1.5 min-w-[140px] rounded-ctrl border border-line bg-card p-1 shadow-pop">
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                onPeriodChange(p);
                setOpenMenu(null);
              }}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between rounded-sm2 px-2.5 py-1.5 text-[12.5px]",
                p === period ? "bg-muted font-medium text-ink" : "text-ink-2 hover:bg-hover",
              )}
            >
              {p}
              {p === period && <Check className="size-3.5 text-ink" />}
            </button>
          ))}
        </div>
      )}

      {openMenu === "date" && (
        <div className="animate-pop-in absolute top-full right-0 z-50 mt-1.5">
          <DatePicker
            value={date}
            onChange={(picked) => {
              onDateChange(picked);
              setOpenMenu(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

export function DateRangePill({
  label,
  onChange,
}: {
  label: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 cursor-pointer items-center gap-2 whitespace-nowrap rounded-ctrl border border-line bg-card px-2.5 text-[12px] shadow-card hover:bg-[#FAFAF8]"
      >
        <CalendarDays className="size-3.5 shrink-0 text-ink-3" />
        <span>{label}</span>
        <ChevronDown className="size-3.5 shrink-0 text-ink-3" />
      </button>

      {open && (
        <div className="animate-pop-in absolute top-full right-0 z-50 mt-1.5 min-w-[165px] rounded-ctrl border border-line bg-card p-1 shadow-pop">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between rounded-sm2 px-2.5 py-1.5 text-[12px] whitespace-nowrap",
                opt === label ? "bg-muted font-medium text-ink" : "text-ink-2 hover:bg-hover",
              )}
            >
              {opt}
              {opt === label && <Check className="size-3.5 text-ink" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
