"use client";

import { Minus, Plus } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { TextInput } from "@/components/atoms/TextInput";
import { DialogActions } from "@/components/molecules/DialogActions";
import { Modal } from "@/components/molecules/Modal";
import type { ProductItem } from "@/data/mock";
import { useStockEdit } from "@/hooks/useStockEdit";

interface StockEditDialogProps {
  product: ProductItem;
  onClose: () => void;
  onSave: (stock: number) => void;
}

/** Ubah stok: ketik jumlah akhir langsung, atau pakai tombol -/+. */
export function StockEditDialog({ product, onClose, onSave }: StockEditDialogProps) {
  const edit = useStockEdit({ product, onSave });

  return (
    <Modal title={`Ubah Stok ${product.name}`} onClose={onClose}>
      <form className="space-y-4" onSubmit={edit.handleSubmit}>
        <div>
          <label htmlFor="stok-baru" className="mb-1 block text-[12px] font-medium text-ink-2">
            Jumlah stok
          </label>
          <div className="flex items-center gap-2">
            <IconButton
              className="!size-9 shrink-0"
              aria-label="Kurangi 1"
              disabled={edit.current <= 0}
              onClick={() => edit.step(-1)}
            >
              <Minus className="size-4" />
            </IconButton>
            <TextInput
              id="stok-baru"
              mono
              inputMode="numeric"
              autoComplete="off"
              value={edit.value}
              onChange={(e) => edit.changeValue(e.target.value)}
              onFocus={(e) => e.target.select()}
              required
              aria-describedby="stok-baru-info"
              className="min-w-0 flex-1 text-center !text-[15px] font-medium"
            />
            <IconButton className="!size-9 shrink-0" aria-label="Tambah 1" onClick={() => edit.step(1)}>
              <Plus className="size-4" />
            </IconButton>
          </div>
          <p id="stok-baru-info" aria-live="polite" className="mt-1.5 text-[11.5px] text-ink-3">
            Stok saat ini {product.stock}
            {edit.diffLabel} · {product.branchName}
          </p>
        </div>
        <DialogActions onCancel={onClose} submitLabel="Simpan Stok" />
      </form>
    </Modal>
  );
}
