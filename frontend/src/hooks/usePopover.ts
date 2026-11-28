import { useRef, useState } from "react";
import { useClickOutside } from "./useClickOutside";

interface UsePopoverProps {
  closeOnEscape?: boolean;
}

/** Satu popover aktif per grup (key), tertutup saat klik di luar `ref`. */
export function usePopover<T>({ closeOnEscape = false }: UsePopoverProps = {}) {
  const [active, setActive] = useState<T | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside({ ref, onOutside: () => setActive(null), closeOnEscape });
  return {
    ref,
    active,
    toggle: (key: T) => setActive((cur) => (cur === key ? null : key)),
    close: () => setActive(null),
  };
}
