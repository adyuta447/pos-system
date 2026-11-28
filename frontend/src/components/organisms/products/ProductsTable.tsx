import { Pencil } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { StackedText } from "@/components/atoms/StackedText";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { DataTable } from "@/components/molecules/DataTable";
import { formatRupiah, umkmOfBranch, type ProductItem } from "@/data/mock";
import { stockStatus } from "@/hooks/useProductsView";

interface ProductsTableProps {
  products: ProductItem[];
  onEditStock: (product: ProductItem) => void;
}

const COLUMNS = [
  { label: "PRODUK" },
  { label: "KATEGORI" },
  { label: "UMKM / CABANG" },
  { label: "HARGA", align: "right" as const },
  { label: "STOK", align: "center" as const },
  { label: "KONDISI", align: "right" as const },
];

export function ProductsTable({ products, onEditStock }: ProductsTableProps) {
  return (
    <DataTable columns={COLUMNS} minWidth="min-w-[760px]">
      {products.map((p) => (
        <tr key={p.id} className="h-[48px] border-b border-line-subtle hover:bg-[#FAFAF8]">
          <td className="px-4 font-medium text-ink">{p.name}</td>
          <td className="px-4 text-ink-2">{p.category}</td>
          <td className="px-4">
            <StackedText primary={umkmOfBranch(p.branchId)} secondary={p.branchName} />
          </td>
          <td className="px-4 text-right font-mono text-ink">{formatRupiah(p.price)}</td>
          <td className="px-4">
            <div className="flex items-center justify-center gap-2">
              <span className="w-10 text-right font-mono font-medium text-ink">{p.stock}</span>
              <IconButton className="!size-7 !rounded-xs2" aria-label={`Ubah stok ${p.name}`} onClick={() => onEditStock(p)}>
                <Pencil className="size-3.5" />
              </IconButton>
            </div>
          </td>
          <td className="px-4 text-right">
            <StatusBadge status={stockStatus(p)} />
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
