import { useEffect, useRef, type RefObject } from "react";

interface UseClickOutsideProps {
  ref: RefObject<HTMLElement | null>;
  onOutside: () => void;
  enabled?: boolean;
  closeOnEscape?: boolean;
}

/** Jalankan `onOutside` saat klik di luar `ref` (dan saat Escape bila `closeOnEscape`). */
export function useClickOutside({
  ref,
  onOutside,
  enabled = true,
  closeOnEscape = false,
}: UseClickOutsideProps) {
  const handler = useRef(onOutside);
  useEffect(() => {
    handler.current = onOutside;
  });

  useEffect(() => {
    if (!enabled) return;
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) handler.current();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (closeOnEscape && e.key === "Escape") handler.current();
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, enabled, closeOnEscape]);
}
