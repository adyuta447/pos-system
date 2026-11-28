import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/cn";

interface DialogActionsProps {
  onCancel: () => void;
  /** Isi tombol utama (submit). */
  submitLabel: ReactNode;
  className?: string;
}

/** Baris tombol "Batal" + tombol submit di bawah form dialog. */
export function DialogActions({ onCancel, submitLabel, className }: DialogActionsProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
        Batal
      </Button>
      <Button type="submit" variant="dark" className="flex-1">
        {submitLabel}
      </Button>
    </div>
  );
}
