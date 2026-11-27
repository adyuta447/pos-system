import { cn } from "../../lib/cn";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="tablist" className="inline-flex rounded-ctrl bg-muted p-[3px]">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={option === value}
          onClick={() => onChange(option)}
          className={cn(
            "cursor-pointer rounded-sm2 px-3.5 py-1.5 text-[12px] text-ink-3 transition-colors hover:text-ink",
            option === value && "bg-card font-medium text-ink shadow-card",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
