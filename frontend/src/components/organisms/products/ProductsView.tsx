"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Panel } from "@/components/molecules/Panel";
import type { UserRole } from "@/config/nav";
import type { BranchItem, ProductItem } from "@/data/mock";
import { useProductForm } from "@/hooks/useProductForm";
import { useProductsView } from "@/hooks/useProductsView";
import { ProductFormDialog } from "./ProductFormDialog";
import { ProductsTable } from "./ProductsTable";
import { StockEditDialog } from "./StockEditDialog";

interface ProductsViewProps {
  products: ProductItem[];
  branches: BranchItem[];
  role: UserRole;
  onAdjustStock: (id: string, delta: number) => void;
  onAddProduct: (item: Omit<ProductItem, "id" | "active">) => void;
}

export function ProductsView({ products, branches, role, onAdjustStock, onAddProduct }: ProductsViewProps) {
  const view = useProductsView({ onAdjustStock });
  const form = useProductForm({ products, branches, onAddProduct, onSaved: view.modal.close });

  return (
    <>
      <Panel
        title="DAFTAR PRODUK DAN STOK"
        actions={
          <Button size="sm" variant="dark" onClick={view.modal.open}>
            <Plus className="size-3.5" /> Tambah Produk
          </Button>
        }
        bodyClassName="overflow-hidden"
      >
        <ProductsTable products={products} onEditStock={view.setStockTarget} />
      </Panel>

      {view.modal.isOpen && <ProductFormDialog form={form} role={role} onClose={view.modal.close} />}

      {view.stockTarget && (
        <StockEditDialog
          product={view.stockTarget}
          onClose={() => view.setStockTarget(null)}
          onSave={view.saveStock}
        />
      )}
    </>
  );
}
