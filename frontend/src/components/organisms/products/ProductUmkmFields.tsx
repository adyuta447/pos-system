import { FormField } from "@/components/molecules/FormField";
import { Select } from "@/components/molecules/Select";
import type { ProductForm } from "@/hooks/useProductForm";

interface ProductUmkmFieldsProps {
  form: ProductForm;
}

/** Pilihan UMKM + cabang tujuan produk (disembunyikan untuk admin cabang). */
export function ProductUmkmFields({ form }: ProductUmkmFieldsProps) {
  return (
    <>
      <FormField label="UMKM">
        {form.umkms.length > 1 ? (
          <>
            <Select
              ariaLabel="Pilih UMKM produk"
              placeholder="Pilih UMKM tujuan..."
              value={form.activeUmkm}
              options={form.umkmOptions}
              onChange={form.selectUmkm}
            />
            {form.umkmMissing && (
              <p role="alert" className="mt-1 text-[11.5px] font-medium text-ink">
                Pilih UMKM terlebih dahulu.
              </p>
            )}
          </>
        ) : (
          <p className="flex h-9 items-center justify-between rounded-ctrl border border-line-subtle bg-muted/60 px-3 text-[13px] text-ink">
            <span className="truncate font-medium">{form.activeUmkm}</span>
            <span className="shrink-0 text-[11.5px] text-ink-3">Sesuai filter UMKM</span>
          </p>
        )}
      </FormField>
      {form.activeUmkm && (
        <FormField label="Cabang">
          <Select
            ariaLabel="Cabang produk"
            value={form.activeBranchId}
            options={form.branchOptions}
            onChange={form.setBranchId}
          />
        </FormField>
      )}
    </>
  );
}
