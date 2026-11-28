"use client";

import { Search, X } from "lucide-react";
import type { PageId, UserRole } from "@/config/nav";
import type { PosTxn } from "@/data/mock";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { CommandPaletteFooter } from "./CommandPaletteFooter";
import { CommandPaletteNavList } from "./CommandPaletteNavList";
import { CommandPaletteTxnList } from "./CommandPaletteTxnList";

interface CommandPaletteProps {
  role: UserRole;
  transactions: PosTxn[];
  onNavigate: (page: PageId) => void;
  onClose: () => void;
}

export function CommandPalette(props: CommandPaletteProps) {
  const p = useCommandPalette(props);

  return (
    <div
      className="animate-backdrop-in fixed inset-0 z-50 flex items-start justify-center bg-ink/25 px-4 pt-20 backdrop-blur-[2px]"
      onClick={props.onClose}
    >
      <div className="animate-modal-in tray w-full max-w-[540px] shadow-window" onClick={(e) => e.stopPropagation()}>
        <div className="inner-card overflow-hidden">
          <div className="flex items-center gap-2.5 border-b border-line-subtle px-4 py-3">
            <Search className="size-4 shrink-0 text-ink-3" strokeWidth={1.5} />
            <input
              autoFocus
              value={p.query}
              onChange={(e) => p.changeQuery(e.target.value)}
              onKeyDown={p.handleKeyDown}
              placeholder="Ketik nama menu, cabang, atau nomor struk..."
              className="flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-3"
            />
            <button
              type="button"
              onClick={props.onClose}
              aria-label="Tutup pencarian"
              className="grid size-6 cursor-pointer place-items-center rounded-xs2 text-ink-3 hover:bg-hover hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="no-scrollbar max-h-[340px] overflow-y-auto p-2">
            {p.filteredNav.length > 0 && (
              <CommandPaletteNavList
                items={p.filteredNav}
                activeIdx={p.activeIdx}
                onHover={p.setActiveIdx}
                onSelect={p.select}
              />
            )}
            {p.filteredTxns.length > 0 && (
              <CommandPaletteTxnList
                transactions={p.filteredTxns}
                offset={p.filteredNav.length}
                activeIdx={p.activeIdx}
                onHover={p.setActiveIdx}
                onSelect={p.select}
              />
            )}
            {p.totalResults === 0 && (
              <p className="px-3 py-8 text-center text-[13px] text-ink-3">
                Tidak ada hasil untuk &ldquo;{p.query}&rdquo;.
              </p>
            )}
          </div>

          <CommandPaletteFooter />
        </div>
      </div>
    </div>
  );
}
