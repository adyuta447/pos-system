import { useEffect, useState } from "react";
import { ROLE_META, type PageId, type UserRole } from "@/config/nav";
import { usePopover } from "./usePopover";

export type TopbarPopover = "bell" | "inbox" | "avatar";

interface UseTopbarProps {
  role: UserRole;
  lowStockCount: number;
  pendingLicenseCount: number;
  onNavigate: (page: PageId) => void;
  onRoleChange: (role: UserRole) => void;
}

export function useTopbar({ role, lowStockCount, pendingLicenseCount, onNavigate, onRoleChange }: UseTopbarProps) {
  const { ref: popoverRef, active: activePopover, toggle: togglePopover, close: closePopover } =
    usePopover<TopbarPopover>({ closeOnEscape: true });
  const [paletteOpen, setPaletteOpen] = useState(false);

  // ⌘K / Ctrl+K membuka palet pencarian dari mana saja; Escape menutupnya.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const showLicenseAlert = role === "superadmin" && pendingLicenseCount > 0;

  return {
    meta: ROLE_META[role],
    popoverRef,
    activePopover,
    togglePopover,
    paletteOpen,
    openPalette: () => setPaletteOpen(true),
    closePalette: () => setPaletteOpen(false),
    alertCount: lowStockCount + (role === "superadmin" ? pendingLicenseCount : 0),
    showLicenseAlert,
    navigateFromPopover: (page: PageId) => {
      onNavigate(page);
      closePopover();
    },
    changeRole: (next: UserRole) => {
      onRoleChange(next);
      closePopover();
    },
  };
}
