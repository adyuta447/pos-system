import { useState, type FormEvent } from "react";
import type { ProductItem } from "@/data/mock";

interface UseStockEditProps {
  product: ProductItem;
  onSave: (stock: number) => void;
}

export function useStockEdit({ product, onSave }: UseStockEditProps) {
  const [value, setValue] = useState(String(product.stock));
  const current = Math.max(0, Math.round(Number(value) || 0));
  const diff = current - product.stock;

  return {
    value,
    changeValue: (v: string) => setValue(v.replace(/\D/g, "")),
    current,
    diffLabel: diff !== 0 ? ` → ${current} (${diff > 0 ? "+" : ""}${diff})` : "",
    step: (delta: number) => setValue(String(Math.max(0, current + delta))),
    handleSubmit: (e: FormEvent) => {
      e.preventDefault();
      onSave(current);
    },
  };
}
