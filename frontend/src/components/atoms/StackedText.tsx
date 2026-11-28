interface StackedTextProps {
  primary: string;
  secondary: string;
}

/** Dua baris dalam sel tabel: judul tebal + keterangan kecil (mis. UMKM + cabang). */
export function StackedText({ primary, secondary }: StackedTextProps) {
  return (
    <>
      <p className="font-medium text-ink">{primary}</p>
      <p className="text-[11.5px] text-ink-3">{secondary}</p>
    </>
  );
}
