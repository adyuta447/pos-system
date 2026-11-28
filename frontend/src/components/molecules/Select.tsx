"use client";

import { Check, ChevronDown } from "lucide-react";
import { useSelect } from "@/hooks/useSelect";
import { cn } from "@/lib/cn";

interface SelectOption {
  value: string;
  label: string;
  hint?: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  size?: "sm" | "md";
  placement?: "auto" | "top" | "bottom";
  className?: string;
  ariaLabel?: string;
}

export function Select({
  value,
  options,
  onChange,
  placeholder = "Pilih...",
  size = "md",
  placement = "auto",
  className,
  ariaLabel,
}: SelectProps) {
  const { open, openUp, rootRef, toggle, close } = useSelect({
    optionCount: options.length,
    placement,
  });
  const current = options.find((o) => o.value === value);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={toggle}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-2 rounded-ctrl border border-line bg-card text-left text-ink shadow-card transition-colors hover:bg-[#FAFAF8] focus-visible:border-ink",
          size === "sm" ? "h-8 px-2.5 text-[12px]" : "h-9 px-3 text-[13px]",
        )}
      >
        <span className="truncate font-medium">{current ? current.label : placeholder}</span>
        <ChevronDown
          className={cn("size-3.5 shrink-0 text-ink-3 transition-transform duration-150", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "animate-pop-in no-scrollbar absolute left-0 z-50 max-h-[240px] min-w-full w-max max-w-[260px] overflow-y-auto rounded-ctrl border border-line bg-card p-1 shadow-pop",
            openUp ? "bottom-full mb-1.5" : "top-full mt-1.5",
          )}
        >
          {options.map((opt) => {
            const selected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(opt.value);
                  close();
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm2 px-2.5 py-1.5 text-left text-[12.5px] transition-colors",
                  selected ? "bg-muted font-medium text-ink" : "text-ink-2 hover:bg-hover hover:text-ink",
                )}
              >
                <span className="min-w-0 flex-1 truncate">
                  {opt.label}
                  {opt.hint && <span className="ml-1.5 text-[11px] text-ink-3">{opt.hint}</span>}
                </span>
                {selected && <Check className="size-3.5 shrink-0 text-ink" strokeWidth={2} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
