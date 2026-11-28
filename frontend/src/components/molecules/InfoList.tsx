import { cn } from "@/lib/cn";

interface InfoListItem {
  label: string;
  value: string;
  mono?: boolean;
}

interface InfoListProps {
  items: InfoListItem[];
}

/** Daftar label–nilai dengan garis pemisah antar baris. */
export function InfoList({ items }: InfoListProps) {
  return (
    <div className="space-y-3 p-4 text-[13px]">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={cn("flex justify-between", i < items.length - 1 && "border-b border-line-subtle pb-2")}
        >
          <span className="text-ink-3">{item.label}</span>
          <span className={cn("font-medium text-ink", item.mono && "font-mono")}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
