"use client";

import { useDatePicker } from "@/hooks/useDatePicker";
import { cn } from "@/lib/cn";
import { DatePickerCalendar } from "./DatePickerCalendar";

interface DatePickerProps {
  value: string;
  onChange: (dateLabel: string) => void;
  highlightedDates?: string[];
}

const MODES = [
  { id: "single", label: "Tanggal" },
  { id: "range", label: "Rentang" },
] as const;

const PRESETS = [
  { label: "Hari Ini", value: "27 Nov 2026", resetView: true, activeClass: "bg-muted text-ink" },
  { label: "7 Hari", value: "21 - 27 Nov 2026", resetView: true, activeClass: "bg-muted text-ink" },
  { label: "Semua", value: "Semua Tanggal", resetView: false, activeClass: "bg-ink text-white" },
] as const;

export function DatePicker({
  value,
  onChange,
  highlightedDates = ["27 Nov 2026", "26 Nov 2026"],
}: DatePickerProps) {
  const picker = useDatePicker({ value, onChange });

  return (
    <div className="tray w-[292px] shadow-pop">
      <div className="inner-card p-3">
        <div className="mb-2.5 flex rounded-sm2 bg-muted p-[3px]">
          {MODES.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => picker.selectMode(tab.id)}
              className={cn(
                "flex-1 cursor-pointer rounded-xs2 py-1 text-[12px] transition-colors",
                picker.mode === tab.id ? "bg-card font-medium text-ink shadow-card" : "text-ink-3 hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <DatePickerCalendar picker={picker} highlightedDates={highlightedDates} />

        {picker.awaitingRangeEnd && (
          <p className="mt-2 text-center text-[11.5px] text-ink-3">Pilih tanggal akhir rentang...</p>
        )}

        <div className="mt-3 grid grid-cols-3 gap-1.5 border-t border-line-subtle pt-2.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => picker.applyPreset(p.value, p.resetView)}
              className={cn(
                "cursor-pointer rounded-sm2 py-1.5 text-[11.5px] font-medium transition-colors",
                value === p.value ? p.activeClass : "border border-line bg-card text-ink-2 hover:bg-hover",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
