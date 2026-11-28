import type { usePanel } from "@/hooks/usePanel";

type PanelMenuItem = ReturnType<typeof usePanel>["items"][number];

interface PanelMenuProps {
  title: string;
  items: PanelMenuItem[];
  onSelect: (item: PanelMenuItem) => void;
}

export function PanelMenu({ title, items, onSelect }: PanelMenuProps) {
  return (
    <div
      role="menu"
      aria-label={`Opsi untuk ${title}`}
      className="animate-pop-in absolute top-full right-0 z-50 mt-1.5 min-w-[180px] rounded-ctrl border border-line bg-card p-1 shadow-pop"
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          role="menuitem"
          onClick={() => onSelect(item)}
          className="flex w-full cursor-pointer items-center gap-2 rounded-sm2 px-2.5 py-1.5 text-left text-[12.5px] text-ink-2 hover:bg-hover hover:text-ink"
        >
          {item.icon && <item.icon className="size-3.5 shrink-0" strokeWidth={1.75} />}
          {item.label}
        </button>
      ))}
    </div>
  );
}
