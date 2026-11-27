import { Search } from "lucide-react";
import { cn } from "../../lib/cn";
import { Kbd } from "./Kbd";

export function SearchInput({
  placeholder,
  kbd,
  variant = "muted",
  className,
  value,
  onChange,
}: {
  placeholder: string;
  kbd?: boolean;
  variant?: "muted" | "white";
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label
      className={cn(
        "flex h-8 items-center gap-2 rounded-ctrl px-3 text-[13px] text-ink-3 focus-within:ring-2 focus-within:ring-ink/10",
        variant === "muted" ? "bg-muted" : "border border-line bg-card shadow-card",
        className,
      )}
    >
      <Search className="size-4 shrink-0" strokeWidth={1.5} />
      <input
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-3"
        placeholder={placeholder}
      />
      {kbd && (
        <span className="flex gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      )}
    </label>
  );
}
