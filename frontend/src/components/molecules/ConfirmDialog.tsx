"use client";

import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Konfirmasi aksi berbahaya (hapus). Fokus awal di "Batal" agar Enter tidak langsung menghapus. */
export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Hapus",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="text-[13px] leading-relaxed text-ink-2">{message}</div>
      <div className="mt-4 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} autoFocus>
          Batal
        </Button>
        <Button
          type="button"
          variant="dark"
          className="flex-1"
          onClick={() => {
            onConfirm();
            onCancel();
          }}
        >
          <Trash2 className="size-3.5" strokeWidth={1.75} /> {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
