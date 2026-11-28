import { cn } from "@/lib/cn";

interface TableColumn {
  label: string;
  align?: "left" | "center" | "right";
}

interface TableHeadProps {
  /** `false` untuk kolom yang disembunyikan secara kondisional. */
  columns: (TableColumn | false)[];
}

export function TableHead({ columns }: TableHeadProps) {
  return (
    <thead>
      <tr className="label-mono h-9 border-b border-line-subtle bg-[#F8F7F5] !text-[11px] text-ink-3">
        {columns.map(
          (col) =>
            col && (
              <th
                key={col.label}
                className={cn(
                  "px-4 font-medium",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                )}
              >
                {col.label}
              </th>
            ),
        )}
      </tr>
    </thead>
  );
}
