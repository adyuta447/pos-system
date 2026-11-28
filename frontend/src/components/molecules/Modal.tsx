"use client";

import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { IconButton } from "@/components/atoms/IconButton";
import { useModal } from "@/hooks/useModal";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Dialog modal di atas seluruh layar. Di-portal ke <body> karena halaman memakai
 * animasi transform (animate-page-in) yang membuat `fixed` hanya menutupi halaman.
 */
export function Modal({ title, onClose, children }: ModalProps) {
  const { titleId, panelRef } = useModal({ onClose });

  return createPortal(
    <div
      className="animate-backdrop-in fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Pola "tray-in-card" (DESIGN_SYSTEM 4.5): header di tray abu, isi di kartu putih. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="tray animate-modal-in my-auto flex w-full max-w-[440px] flex-col shadow-window"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-10 shrink-0 items-center justify-between gap-3 pr-1.5 pl-3">
          <h2 id={titleId} className="label-mono truncate text-ink-3">
            {title}
          </h2>
          <IconButton round onClick={onClose} aria-label="Tutup dialog">
            <X className="size-3.5" />
          </IconButton>
        </div>
        <div className="inner-card p-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
