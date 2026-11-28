import { ChevronLeft, ChevronRight } from "lucide-react";
import type { useDatePicker } from "@/hooks/useDatePicker";
import { cn } from "@/lib/cn";
import { MONTHS_ID, WEEKDAYS_ID } from "@/lib/date";

interface DatePickerCalendarProps {
  picker: ReturnType<typeof useDatePicker>;
  highlightedDates: string[];
}

const NAV_BTN =
  "grid size-7 cursor-pointer place-items-center rounded-sm2 border border-line bg-card text-ink-2 hover:bg-hover hover:text-ink";

export function DatePickerCalendar({ picker, highlightedDates }: DatePickerCalendarProps) {
  return (
    <>
      <div className="mb-2.5 flex items-center justify-between">
        <button type="button" onClick={picker.prevMonth} aria-label="Bulan sebelumnya" className={NAV_BTN}>
          <ChevronLeft className="size-3.5" />
        </button>
        <span className="text-[13px] font-semibold text-ink">
          {MONTHS_ID[picker.viewMonth]} <span className="font-mono">{picker.viewYear}</span>
        </span>
        <button type="button" onClick={picker.nextMonth} aria-label="Bulan berikutnya" className={NAV_BTN}>
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
        {picker.daysGrid.map((cell, idx) => {
          if (!cell) return <span key={`empty-${idx}`} className="h-8" />;
          const { isSelected, isInRange } = picker.getDayState(cell);
          return (
            <button
              key={cell.label}
              type="button"
              onMouseEnter={() => picker.hoverDay(cell.date)}
              onClick={() => picker.selectDay(cell)}
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
              {highlightedDates.includes(cell.label) && (
                <span
                  className={cn("absolute bottom-1 size-1 rounded-full", isSelected ? "bg-white" : "bg-ink-3")}
                />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
