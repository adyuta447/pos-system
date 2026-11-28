"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import { usePopover } from "@/hooks/usePopover";
import { OptionMenu } from "./OptionMenu";

export const RANGE_OPTIONS = ["1 Nov - 27 Nov", "1 Okt - 27 Nov", "1 Jan - 27 Nov"] as const;

interface DateRangePillProps {
  label: string;
  onChange: (value: string) => void;
}

export function DateRangePill({ label, onChange }: DateRangePillProps) {
  const { ref, active, toggle, close } = usePopover<"range">();

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => toggle("range")}
        className="flex h-8 cursor-pointer items-center gap-2 whitespace-nowrap rounded-ctrl border border-line bg-card px-2.5 text-[12px] shadow-card hover:bg-[#FAFAF8]"
      >
        <CalendarDays className="size-3.5 shrink-0 text-ink-3" />
        <span>{label}</span>
        <ChevronDown className="size-3.5 shrink-0 text-ink-3" />
      </button>

      {active === "range" && (
        <OptionMenu
          options={RANGE_OPTIONS}
          value={label}
          onSelect={(opt) => {
            onChange(opt);
            close();
          }}
          className="right-0 min-w-[165px]"
          itemClassName="text-[12px] whitespace-nowrap"
        />
      )}
    </div>
  );
}
