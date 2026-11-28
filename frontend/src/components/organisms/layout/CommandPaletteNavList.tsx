import { ArrowRight } from "lucide-react";
import type { NavItem } from "@/config/nav";
import { cn } from "@/lib/cn";

interface CommandPaletteNavListProps {
  items: NavItem[];
  activeIdx: number;
  onHover: (idx: number) => void;
  onSelect: (idx: number) => void;
}

export function CommandPaletteNavList({ items, activeIdx, onHover, onSelect }: CommandPaletteNavListProps) {
  return (
    <div className="mb-2">
      <p className="label-mono px-2.5 py-1.5 !text-[10.5px] text-ink-3">MENU NAVIGASI</p>
      <div className="space-y-0.5">
        {items.map((item, idx) => {
          const selected = idx === activeIdx;
          return (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => onHover(idx)}
              onClick={() => onSelect(idx)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2.5 rounded-sm2 px-2.5 py-2 text-left text-[13px] transition-colors",
                selected ? "bg-muted font-medium text-ink" : "text-ink-2 hover:bg-hover",
              )}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-xs2 border",
                  selected ? "border-line bg-card text-ink shadow-card" : "border-line-subtle bg-sidebar text-ink-3",
                )}
              >
                <item.icon className="size-3.5" strokeWidth={1.75} />
              </span>
              <span className="flex-1">{item.label}</span>
              {selected && (
                <span className="flex items-center gap-1 text-[11px] text-ink-3">
                  Buka <ArrowRight className="size-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
