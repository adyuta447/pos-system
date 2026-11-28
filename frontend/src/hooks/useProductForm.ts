import { useMemo, useState, type FormEvent } from "react";
import type { BranchItem, ProductItem } from "@/data/mock";

const PRODUCT_CATEGORIES = ["Minuman", "Makanan", "Kemasan", "Lainnya"];

interface UseProductFormProps {
  products: ProductItem[];
  branches: BranchItem[];
  onAddProduct: (item: Omit<ProductItem, "id" | "active">) => void;
  onSaved: () => void;
}

/** State form tambah produk; dipanggil di ProductsView agar draf tetap ada saat modal ditutup. */
export function useProductForm({ products, branches, onAddProduct, onSaved }: UseProductFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Minuman");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("20");
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "cab-kemang");
  const [umkm, setUmkm] = useState("");
  const [umkmMissing, setUmkmMissing] = useState(false);

  // `branches` sudah mengikuti filter sidebar: satu UMKM terpilih = langsung di-assign.
  const umkms = useMemo(() => [...new Set(branches.map((b) => b.umkmName))], [branches]);
  const activeUmkm = umkms.length === 1 ? umkms[0] : umkms.includes(umkm) ? umkm : "";
  const umkmBranches = branches.filter((b) => b.umkmName === activeUmkm);
  const activeBranch = umkmBranches.find((b) => b.id === branchId) ?? umkmBranches[0];
  // Kategori baru cukup diketik; setelah disimpan ia muncul dari daftar produk.
  const categories = useMemo(
    () => [...new Set([...PRODUCT_CATEGORIES, ...products.map((p) => p.category)])],
    [products],
  );
  const trimmed = category.trim();
  const existingCategory = categories.find((c) => c.toLowerCase() === trimmed.toLowerCase());

  function handleSave(e: FormEvent) {
    e.preventDefault();
    const numericPrice = Number(price);
    if (!activeBranch) return setUmkmMissing(true);
    if (!name.trim() || !trimmed || !Number.isFinite(numericPrice) || numericPrice <= 0) return;
    onAddProduct({
      branchId: activeBranch.id,
      branchName: activeBranch.name,
      name: name.trim(),
      // Pakai ejaan kategori yang sudah ada bila hanya beda huruf besar/kecil.
      category: existingCategory ?? trimmed,
      price: Math.round(numericPrice),
      stock: Math.max(0, Math.round(Number(stock) || 0)),
      minStock: 8,
    });
    setName("");
    setPrice("");
    setStock("20");
    onSaved();
  }

  return {
    name,
    setName,
    category,
    setCategory,
    price,
    setPrice,
    stock,
    changeStock: (v: string) => setStock(v.replace(/\D/g, "")),
    umkms,
    activeUmkm,
    umkmMissing,
    umkmOptions: umkms.map((u) => ({
      value: u,
      label: u,
      hint: `${branches.filter((b) => b.umkmName === u).length} cabang`,
    })),
    selectUmkm: (v: string) => {
      setUmkm(v);
      setUmkmMissing(false);
    },
    activeBranchId: activeBranch?.id ?? "",
    branchOptions: umkmBranches.map((b) => ({ value: b.id, label: b.name })),
    setBranchId,
    categories,
    isNewCategory: trimmed !== "" && !existingCategory,
    handleSave,
  };
}

export type ProductForm = ReturnType<typeof useProductForm>;
