import { useEffect, useRef, useState } from "react";
import { Copy, Download, type LucideIcon } from "lucide-react";
import { downloadCsv, readTable, slugify, toTsv } from "@/lib/csv";
import { useClickOutside } from "./useClickOutside";

interface PanelMenuItem {
  label: string;
  onSelect: () => void;
  icon?: LucideIcon;
}

interface UsePanelProps {
  title: string;
  menuItems?: PanelMenuItem[];
}

export function usePanel({ title, menuItems }: UsePanelProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [menuHasTable, setMenuHasTable] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  // Elemen body lewat state (bukan ref) agar boleh dipakai di handler yang dibuat saat render.
  const [body, setBody] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(t);
  }, [notice]);

  useClickOutside({
    ref: panelRef,
    onOutside: () => {
      setShowInfo(false);
      setShowMenu(false);
    },
  });

  const tableItems: PanelMenuItem[] = [
    {
      label: "Ekspor CSV",
      icon: Download,
      onSelect: () => {
        const rows = readTable(body);
        downloadCsv(slugify(title), rows);
        setNotice(`${Math.max(0, rows.length - 1)} baris diekspor ke CSV`);
      },
    },
    {
      label: "Salin tabel",
      icon: Copy,
      onSelect: () => {
        const rows = readTable(body);
        navigator.clipboard.writeText(toTsv(rows)).then(
          () => setNotice(`${Math.max(0, rows.length - 1)} baris disalin, siap ditempel ke spreadsheet`),
          () => setNotice("Gagal menyalin. Izinkan akses clipboard di browser."),
        );
      },
    },
  ];

  function toggleInfo() {
    setShowMenu(false);
    setShowInfo((v) => !v);
  }

  function toggleMenu() {
    setShowInfo(false);
    setMenuHasTable(!!body?.querySelector("table"));
    setShowMenu((v) => !v);
  }

  function selectItem(item: PanelMenuItem) {
    item.onSelect();
    setShowMenu(false);
  }

  return {
    panelRef,
    setBody,
    showInfo,
    showMenu,
    notice,
    hasCustomItems: !!menuItems && menuItems.length > 0,
    items: [...(menuItems ?? []), ...(menuHasTable ? tableItems : [])],
    toggleInfo,
    toggleMenu,
    selectItem,
  };
}
