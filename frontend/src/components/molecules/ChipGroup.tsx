import { Chip } from "@/components/atoms/Chip";

interface ChipGroupProps {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}

/** Deretan chip untuk memilih kategori cepat di atas input teks. */
export function ChipGroup({ options, value, onChange, ariaLabel }: ChipGroupProps) {
  return (
    <div className="mb-2 flex flex-wrap gap-1.5" role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <Chip key={opt} active={value === opt} onClick={() => onChange(opt)}>
          {opt}
        </Chip>
      ))}
    </div>
  );
}
