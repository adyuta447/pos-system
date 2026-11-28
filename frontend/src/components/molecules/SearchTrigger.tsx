import { Search } from "lucide-react";
import { Kbd } from "@/components/atoms/Kbd";

interface SearchTriggerProps {
  onClick: () => void;
}

/** Tombol berbentuk kolom pencarian yang membuka palet perintah (⌘K). */
export function SearchTrigger({ onClick }: SearchTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 w-[300px] cursor-pointer items-center gap-2 rounded-ctrl bg-muted px-3 text-[13px] text-ink-3 transition-colors hover:bg-hover max-md:hidden"
    >
      <Search className="size-4 shrink-0" strokeWidth={1.5} />
      <span className="flex-1 text-left">Cari data atau menu...</span>
      <span className="flex gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
}
