import { CornerDownLeft } from "lucide-react";
import { Kbd } from "@/components/atoms/Kbd";

export function CommandPaletteFooter() {
  return (
    <footer className="flex items-center justify-between border-t border-line-subtle bg-sidebar px-4 py-2 text-[11.5px] text-ink-3">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <span className="ml-0.5">Navigasi</span>
        </span>
        <span className="flex items-center gap-1">
          <Kbd>
            <CornerDownLeft className="size-2.5" />
          </Kbd>
          <span className="ml-0.5">Pilih</span>
        </span>
      </div>
      <span className="flex items-center gap-1">
        <Kbd>Esc</Kbd>
        <span className="ml-0.5">Tutup</span>
      </span>
    </footer>
  );
}
