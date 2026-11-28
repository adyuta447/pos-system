import { useState } from "react";
import type { ProductItem } from "@/data/mock";
import { useDisclosure } from "./useDisclosure";

interface UseProductsViewProps {
  onAdjustStock: (id: string, delta: number) => void;
}

export function useProductsView({ onAdjustStock }: UseProductsViewProps) {
  const modal = useDisclosure();
  const [stockTarget, setStockTarget] = useState<ProductItem | null>(null);

  function saveStock(next: number) {
    if (stockTarget && next !== stockTarget.stock) onAdjustStock(stockTarget.id, next - stockTarget.stock);
    setStockTarget(null);
  }

  return { modal, stockTarget, setStockTarget, saveStock };
}

/** Kondisi stok sebagai status badge: habis, menipis, atau aman. */
export function stockStatus(p: ProductItem) {
  if (p.stock <= 0) return "Dibatalkan" as const;
  return p.stock <= p.minStock ? ("Tertunda" as const) : ("Selesai" as const);
}
