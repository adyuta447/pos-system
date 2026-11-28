"use client";

import { RupiahInput } from "@/components/atoms/RupiahInput";
import { TextInput } from "@/components/atoms/TextInput";
import { ChipGroup } from "@/components/molecules/ChipGroup";
import { DialogActions } from "@/components/molecules/DialogActions";
import { FormField } from "@/components/molecules/FormField";
import { Modal } from "@/components/molecules/Modal";
import type { UserRole } from "@/config/nav";
import type { ProductForm } from "@/hooks/useProductForm";
import { ProductUmkmFields } from "./ProductUmkmFields";

interface ProductFormDialogProps {
  form: ProductForm;
  role: UserRole;
  onClose: () => void;
}

export function ProductFormDialog({ form, role, onClose }: ProductFormDialogProps) {
  return (
    <Modal title="Tambah Produk Baru" onClose={onClose}>
      <form onSubmit={form.handleSave} className="space-y-3">
        {role !== "branch_admin" && <ProductUmkmFields form={form} />}
        <FormField label="Nama Produk" htmlFor="produk-nama">
          <TextInput
            id="produk-nama"
            value={form.name}
            onChange={(e) => form.setName(e.target.value)}
            required
            placeholder="Contoh: Es Kopi Susu"
          />
        </FormField>
        <FormField label="Kategori" htmlFor="produk-kategori" labelGap="md">
          <ChipGroup options={form.categories} value={form.category} onChange={form.setCategory} ariaLabel="Kategori tersedia" />
          <TextInput
            id="produk-kategori"
            value={form.category}
            onChange={(e) => form.setCategory(e.target.value)}
            required
            placeholder="Pilih di atas atau ketik kategori baru"
            aria-describedby="produk-kategori-hint"
          />
          <p id="produk-kategori-hint" className="mt-1 text-[11.5px] text-ink-3">
            {form.isNewCategory
              ? `Kategori baru "${form.category.trim()}" akan ditambahkan.`
              : "Ketik nama lain untuk menambah kategori baru."}
          </p>
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Harga (Rp)" htmlFor="produk-harga">
            <RupiahInput id="produk-harga" value={form.price} onChange={form.setPrice} required placeholder="20.000" />
          </FormField>
          <FormField label="Stok Awal" htmlFor="produk-stok">
            <TextInput
              id="produk-stok"
              mono
              inputMode="numeric"
              autoComplete="off"
              value={form.stock}
              onChange={(e) => form.changeStock(e.target.value)}
              required
            />
          </FormField>
        </div>
        <DialogActions onCancel={onClose} submitLabel="Simpan Produk" className="pt-2" />
      </form>
    </Modal>
  );
}
