import { useState } from "react";
import { formatRupiah, INITIAL_PRODUCTS, type ProductItem } from "@/data/mock";
import type { AppendLog } from "./useAuditLog";

interface UseProductStoreProps {
  appendLog: AppendLog;
}

export function useProductStore({ appendLog }: UseProductStoreProps) {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);

  function adjustStock(id: string, delta: number) {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)));
    if (target) {
      appendLog("Penyesuaian Stok", target.name, `Stok diperbarui menjadi ${Math.max(0, target.stock + delta)}`);
    }
  }

  function addProduct(item: Omit<ProductItem, "id" | "active">) {
    setProducts((prev) => [{ ...item, id: `prd-${Date.now()}`, active: true }, ...prev]);
    appendLog("Tambah Produk", item.name, `Ditambahkan ke ${item.branchName} (${formatRupiah(item.price)})`);
  }

  return { products, adjustStock, addProduct };
}
