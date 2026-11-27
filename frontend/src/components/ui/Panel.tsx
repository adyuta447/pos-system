"use client";

import { useEffect, useRef, useState } from "react";
import { Ellipsis, Info } from "lucide-react";
import { cn } from "../../lib/cn";
import { IconButton } from "./IconButton";

export type PanelMenuItem = {
  label: string;
  onSelect: () => void;
};

export function Panel({
  title,
  infoText,
  menuItems,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  infoText?: string;
  menuItems?: PanelMenuItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowInfo(false);
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <section ref={panelRef} className={cn("tray flex flex-col", className)}>
      <header className="relative flex h-10 shrink-0 items-center justify-between gap-3 px-3">
        <div className="flex items-center gap-1.5">
          <h3 className="label-mono text-ink-3">{title}</h3>
          <button
            type="button"
            onClick={() => {
              setShowMenu(false);
              setShowInfo((v) => !v);
            }}
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
            onClick={() => {
              setShowInfo(false);
              setShowMenu((v) => !v);
            }}
            aria-label={`Opsi untuk ${title}`}
          >
            <Ellipsis className="size-3.5" />
          </IconButton>

          {showMenu && (
            <div className="animate-pop-in absolute top-full right-0 z-50 mt-1.5 min-w-[165px] rounded-ctrl border border-line bg-card p-1 shadow-pop">
              {(menuItems && menuItems.length > 0
                ? menuItems
                : [{ label: "Muat ulang tampilan", onSelect: () => {} }]
              ).map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.onSelect();
                    setShowMenu(false);
                  }}
                  className="flex w-full cursor-pointer items-center rounded-sm2 px-2.5 py-1.5 text-left text-[12.5px] text-ink-2 hover:bg-hover hover:text-ink"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>
      <div className={cn("inner-card min-h-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}
