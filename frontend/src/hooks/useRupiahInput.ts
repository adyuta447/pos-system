import { useLayoutEffect, useRef, type ChangeEvent } from "react";

interface UseRupiahInputProps {
  value: string;
  onChange: (digits: string) => void;
}

/** "1500000" -> "1.500.000". Regex, bukan Number, agar angka panjang tidak kehilangan presisi. */
function formatThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function useRupiahInput({ value, onChange }: UseRupiahInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  // Jumlah digit di kiri kursor, agar kursor tidak loncat ke akhir saat titik ditambah/dihapus.
  const digitsBeforeCaret = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const target = digitsBeforeCaret.current;
    if (!el || target === null || document.activeElement !== el) return;
    digitsBeforeCaret.current = null;
    let pos = 0;
    for (let seen = 0; pos < el.value.length && seen < target; pos++) {
      if (/\d/.test(el.value[pos])) seen++;
    }
    el.setSelectionRange(pos, pos);
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const caret = e.target.selectionStart ?? raw.length;
    digitsBeforeCaret.current = raw.slice(0, caret).replace(/\D/g, "").length;
    onChange(raw.replace(/\D/g, "").replace(/^0+(?=\d)/, ""));
  }

  return { ref, displayValue: formatThousands(value), handleChange };
}
