import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PopoverCardProps {
  title?: string;
  /** Lebar kartu, mis. "w-[300px]". */
  width: string;
  children: ReactNode;
}

/** Kartu popover di bawah tombol topbar (notifikasi, pesan, akun). */
export function PopoverCard({ title, width, children }: PopoverCardProps) {
  return (
    <div
      className={cn(
        "animate-pop-in absolute top-11 right-0 z-50 rounded-ctrl border border-line bg-card p-2 shadow-pop",
        width,
      )}
    >
      {title && <p className="label-mono px-2 py-1.5 !text-[11px] text-ink-3">{title}</p>}
      {children}
    </div>
  );
}
