import type { ComponentProps, ReactNode } from "react";
import { TableHead } from "./TableHead";

interface DataTableProps {
  columns: ComponentProps<typeof TableHead>["columns"];
  /** Lebar minimum tabel sebelum di-scroll horizontal, mis. "min-w-[720px]". */
  minWidth: string;
  children: ReactNode;
}

/** Tabel dengan scroll horizontal; isi baris (`<tr>`) diberikan lewat children. */
export function DataTable({ columns, minWidth, children }: DataTableProps) {
  return (
    <div className="no-scrollbar overflow-x-auto">
      <table className={`w-full ${minWidth} border-collapse text-left text-[13px]`}>
        <TableHead columns={columns} />
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
