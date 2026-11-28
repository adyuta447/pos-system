import type { ReactNode } from "react";

interface KbdProps {
  children: ReactNode;
}

export function Kbd({ children }: KbdProps) {
  return (
    <kbd className="grid size-5 place-items-center rounded-[5px] border border-line bg-card font-sans text-[11px] font-medium text-ink-3">
      {children}
    </kbd>
  );
}
