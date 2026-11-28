import { useMemo, useState, type KeyboardEvent } from "react";
import { NAV, type PageId, type UserRole } from "@/config/nav";
import type { PosTxn } from "@/data/mock";

interface UseCommandPaletteProps {
  role: UserRole;
  transactions: PosTxn[];
  onNavigate: (page: PageId) => void;
  onClose: () => void;
}

export function useCommandPalette({ role, transactions, onNavigate, onClose }: UseCommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const navItems = useMemo(() => NAV.flatMap((g) => g.items).filter((i) => i.roles.includes(role)), [role]);
  const q = query.trim().toLowerCase();
  const filteredNav = q ? navItems.filter((n) => n.label.toLowerCase().includes(q)) : navItems;
  const filteredTxns = q
    ? transactions
        .filter((t) => [t.receiptNo, t.branchName, t.itemsSummary].some((f) => f.toLowerCase().includes(q)))
        .slice(0, 4)
    : transactions.slice(0, 3);
  const totalResults = filteredNav.length + filteredTxns.length;

  /** Indeks gabungan: item menu dulu, lalu transaksi (yang membuka halaman Transaksi). */
  function select(idx: number) {
    onNavigate(idx < filteredNav.length ? filteredNav[idx].id : "transactions");
    onClose();
  }

  function changeQuery(value: string) {
    setQuery(value);
    setActiveIdx(0);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (totalResults === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % totalResults);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + totalResults) % totalResults);
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(activeIdx);
    }
  }

  return { query, changeQuery, activeIdx, setActiveIdx, filteredNav, filteredTxns, totalResults, select, handleKeyDown };
}
