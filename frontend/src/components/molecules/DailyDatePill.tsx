"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import { usePopover } from "@/hooks/usePopover";
import { DatePicker } from "./DatePicker";
import { OptionMenu } from "./OptionMenu";

export const PERIOD_OPTIONS = ["Harian", "Mingguan", "Bulanan"] as const;
export type HeaderPeriod = (typeof PERIOD_OPTIONS)[number];

interface DailyDatePillProps {
  period: HeaderPeriod;
  onPeriodChange: (p: HeaderPeriod) => void;
  date: string;
  onDateChange: (d: string) => void;
}

const SEGMENT = "flex cursor-pointer items-center gap-2 whitespace-nowrap px-3 hover:bg-hover";

export function DailyDatePill({ period, onPeriodChange, date, onDateChange }: DailyDatePillProps) {
  const { ref, active, toggle, close } = usePopover<"period" | "date">({ closeOnEscape: true });

  return (
    <div
      ref={ref}
      className="relative flex h-9 items-stretch rounded-ctrl border border-line bg-card text-[13px] shadow-card"
    >
      <button type="button" onClick={() => toggle("period")} className={`${SEGMENT} rounded-l-ctrl`}>
        {period}
        <ChevronDown className="size-3.5 text-ink-3" />
      </button>
      <span className="w-px bg-line" />
      <button type="button" onClick={() => toggle("date")} className={`${SEGMENT} rounded-r-ctrl`}>
        <CalendarDays className="size-3.5 text-ink-3" />
        <span>{date}</span>
      </button>

      {active === "period" && (
        <OptionMenu
          options={PERIOD_OPTIONS}
          value={period}
          onSelect={(p) => {
            onPeriodChange(p as HeaderPeriod);
            close();
          }}
          className="left-0 min-w-[140px]"
          itemClassName="text-[12.5px]"
        />
      )}

      {active === "date" && (
        <div className="animate-pop-in absolute top-full right-0 z-50 mt-1.5">
          <DatePicker
            value={date}
            onChange={(picked) => {
              onDateChange(picked);
              close();
            }}
          />
        </div>
      )}
    </div>
  );
}
