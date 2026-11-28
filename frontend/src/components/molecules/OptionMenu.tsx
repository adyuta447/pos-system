import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface OptionMenuProps {
  options: readonly string[];
  value: string;
  onSelect: (value: string) => void;
  /** Posisi & lebar menu, mis. "left-0 min-w-[140px]". */
  className?: string;
  itemClassName?: string;
}

/** Daftar pilihan dropdown sederhana dengan tanda centang pada nilai aktif. */
export function OptionMenu({ options, value, onSelect, className, itemClassName }: OptionMenuProps) {
  return (
    <div
      className={cn(
        "animate-pop-in absolute top-full z-50 mt-1.5 rounded-ctrl border border-line bg-card p-1 shadow-pop",
        className,
      )}
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(opt)}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between rounded-sm2 px-2.5 py-1.5",
            itemClassName,
            opt === value ? "bg-muted font-medium text-ink" : "text-ink-2 hover:bg-hover",
          )}
        >
          {opt}
          {opt === value && <Check className="size-3.5 text-ink" />}
        </button>
      ))}
    </div>
  );
}
