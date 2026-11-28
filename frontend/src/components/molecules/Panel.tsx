"use client";

import type { ReactNode } from "react";
import { Ellipsis, Info } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { usePanel } from "@/hooks/usePanel";
import { cn } from "@/lib/cn";
import { PanelMenu } from "./PanelMenu";

interface PanelProps {
  title: string;
  infoText?: string;
  menuItems?: Parameters<typeof usePanel>[0]["menuItems"];
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({ title, infoText, menuItems, actions, children, className, bodyClassName }: PanelProps) {
  const { panelRef, setBody, showInfo, showMenu, notice, hasCustomItems, items, toggleInfo, toggleMenu, selectItem } =
    usePanel({ title, menuItems });

  return (
    <section ref={panelRef} className={cn("tray group/panel flex flex-col", className)}>
      <header className="relative flex h-10 shrink-0 items-center justify-between gap-3 px-3">
        <div className="flex items-center gap-1.5">
          <h3 className="label-mono text-ink-3">{title}</h3>
          <button
            type="button"
            onClick={toggleInfo}
            aria-label={`Informasi ${title}`}
            className="grid size-5 cursor-pointer place-items-center rounded-full text-ink-4 transition-colors hover:bg-hover hover:text-ink-2"
          >
            <Info className="size-3.5" strokeWidth={1.5} />
          </button>
          {showInfo && (
            <div className="animate-pop-in absolute top-9 left-3 z-40 max-w-[260px] rounded-ctrl border border-line bg-card p-2.5 text-[12px] leading-relaxed text-ink-2 shadow-pop">
              {infoText ?? `Menampilkan ringkasan data ${title.toLowerCase()} secara langsung.`}
            </div>
          )}
        </div>

        <div className="relative flex items-center gap-2">
          {actions}
          <IconButton
            round
            // Tanpa menu khusus, tombol hanya muncul bila panel berisi tabel.
            className={hasCustomItems ? undefined : "hidden group-has-[table]/panel:grid"}
            aria-expanded={showMenu}
            aria-haspopup="menu"
            onClick={toggleMenu}
            aria-label={`Opsi untuk ${title}`}
          >
            <Ellipsis className="size-3.5" />
          </IconButton>
          {showMenu && <PanelMenu title={title} items={items} onSelect={selectItem} />}
          {notice && (
            <div
              role="status"
              className="animate-pop-in absolute top-full right-0 z-50 mt-1.5 w-max max-w-[260px] rounded-ctrl bg-ink px-2.5 py-1.5 text-[12px] text-white shadow-pop"
            >
              {notice}
            </div>
          )}
        </div>
      </header>
      <div ref={setBody} className={cn("inner-card min-h-0 flex-1", bodyClassName)}>
        {children}
      </div>
    </section>
  );
}
