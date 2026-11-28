import { useRef, useState } from "react";
import { useClickOutside } from "./useClickOutside";

interface UseSelectProps {
  optionCount: number;
  placement: "auto" | "top" | "bottom";
}

export function useSelect({ optionCount, placement }: UseSelectProps) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useClickOutside({ ref: rootRef, onOutside: () => setOpen(false), enabled: open, closeOnEscape: true });

  function toggle() {
    if (!open && rootRef.current) {
      if (placement === "top") {
        setOpenUp(true);
      } else if (placement === "bottom") {
        setOpenUp(false);
      } else {
        const rect = rootRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const estimatedHeight = Math.min(optionCount * 34 + 16, 240);
        setOpenUp(spaceBelow < estimatedHeight && rect.top > spaceBelow);
      }
    }
    setOpen((v) => !v);
  }

  return { open, openUp, rootRef, toggle, close: () => setOpen(false) };
}
