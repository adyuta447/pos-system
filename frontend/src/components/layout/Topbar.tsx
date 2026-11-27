"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  ChevronRight,
  CornerDownLeft,
  Inbox,
  Menu,
  Search,
  X,
} from "lucide-react";
import { NAV, PAGE_TITLES, ROLE_META, type PageId, type UserRole } from "../../config/nav";
import { formatRupiah, type PosTxn } from "../../data/mock";
import { cn } from "../../lib/cn";
import { Avatar } from "../ui/Avatar";
import { IconButton } from "../ui/IconButton";
import { Kbd } from "../ui/Kbd";
import { StatusBadge } from "../ui/StatusBadge";

export function Topbar({
  activePage,
  role,
  onRoleChange,
  onNavigate,
  transactions,
  lowStockCount,
  pendingLicenseCount,
  onOpenMenu,
}: {
  activePage: PageId;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (page: PageId) => void;
  transactions: PosTxn[];
  lowStockCount: number;
  pendingLicenseCount: number;
  onOpenMenu?: () => void;
}) {
  const meta = ROLE_META[role];
  const [popover, setPopover] = useState<"bell" | "inbox" | "avatar" | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const rightRef = useRef<HTMLDivElement>(null);

  const navItems = useMemo(
    () => NAV.flatMap((g) => g.items).filter((i) => i.roles.includes(role)),
    [role],
  );

  const filteredNav = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return navItems;
    return navItems.filter((n) => n.label.toLowerCase().includes(q));
  }, [navItems, searchQuery]);

  const filteredTxns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return transactions.slice(0, 3);
    return transactions
      .filter(
        (t) =>
          t.receiptNo.toLowerCase().includes(q) ||
          t.branchName.toLowerCase().includes(q) ||
          t.itemsSummary.toLowerCase().includes(q),
      )
      .slice(0, 4);
  }, [searchQuery, transactions]);

  const totalResults = filteredNav.length + filteredTxns.length;

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (rightRef.current && !rightRef.current.contains(e.target as Node)) {
        setPopover(null);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        setActiveIdx(0);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
        setPopover(null);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  function selectPaletteIndex(idx: number) {
    if (idx < filteredNav.length) {
      onNavigate(filteredNav[idx].id);
    } else {
      onNavigate("transactions");
    }
    setPaletteOpen(false);
    setSearchQuery("");
  }

  const alertCount = lowStockCount + (role === "superadmin" ? pendingLicenseCount : 0);

  return (
    <header className="flex h-[var(--topbar-h)] shrink-0 items-center justify-between gap-4 border-b border-line px-5">
      <div className="flex items-center gap-2.5">
        {onOpenMenu && (
          <IconButton onClick={onOpenMenu} aria-label="Buka menu navigasi" className="lg:hidden">
            <Menu className="size-4" strokeWidth={1.5} />
          </IconButton>
        )}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px]">
          <button
            type="button"
            onClick={() => onNavigate("overview")}
            className="cursor-pointer text-ink-3 hover:text-ink"
          >
            Panel Admin
          </button>
          <ChevronRight className="size-3.5 text-ink-4" />
          <span className="font-medium text-ink">{PAGE_TITLES[activePage]}</span>
        </nav>
      </div>

      <div ref={rightRef} className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setPaletteOpen(true);
            setActiveIdx(0);
          }}
          className="flex h-8 w-[300px] cursor-pointer items-center gap-2 rounded-ctrl bg-muted px-3 text-[13px] text-ink-3 transition-colors hover:bg-hover max-md:hidden"
        >
          <Search className="size-4 shrink-0" strokeWidth={1.5} />
          <span className="flex-1 text-left">Cari data atau menu...</span>
          <span className="flex gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>

        <div className="relative">
          <IconButton
            aria-label="Notifikasi"
            onClick={() => setPopover((p) => (p === "bell" ? null : "bell"))}
          >
            <Bell className="size-4" strokeWidth={1.5} />
          </IconButton>
          {alertCount > 0 && (
            <span className="pointer-events-none absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-ink text-[10px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </div>

        <IconButton
          aria-label="Pesan masuk"
          onClick={() => setPopover((p) => (p === "inbox" ? null : "inbox"))}
        >
          <Inbox className="size-4" strokeWidth={1.5} />
        </IconButton>

        <button
          type="button"
          onClick={() => setPopover((p) => (p === "avatar" ? null : "avatar"))}
          className="cursor-pointer rounded-sm2 focus-visible:ring-2 focus-visible:ring-ink"
          aria-label="Menu akun"
        >
          <Avatar alt={meta.name} initials={meta.initials} />
        </button>

        {popover === "bell" && (
          <div className="animate-pop-in absolute top-11 right-0 z-50 w-[310px] rounded-ctrl border border-line bg-card p-2 shadow-pop">
            <p className="label-mono px-2 py-1.5 !text-[11px] text-ink-3">NOTIFIKASI SISTEM</p>
            <div className="space-y-1 text-[12.5px]">
              {lowStockCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("products");
                    setPopover(null);
                  }}
                  className="block w-full cursor-pointer rounded-sm2 p-2 text-left hover:bg-hover"
                >
                  <p className="font-medium text-ink">{lowStockCount} produk perlu restok</p>
                  <p className="text-[11.5px] text-ink-3">Klik untuk buka menu Produk & Stok</p>
                </button>
              )}
              {role === "superadmin" && pendingLicenseCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("branches");
                    setPopover(null);
                  }}
                  className="block w-full cursor-pointer rounded-sm2 p-2 text-left hover:bg-hover"
                >
                  <p className="font-medium text-ink">
                    {pendingLicenseCount} cabang menunggu aktivasi lisensi
                  </p>
                  <p className="text-[11.5px] text-ink-3">Klik untuk aktivasi lisensi cabang</p>
                </button>
              )}
              {alertCount === 0 && (
                <p className="px-2 py-3 text-ink-3">Semua operasional cabang berjalan normal.</p>
              )}
            </div>
          </div>
        )}

        {popover === "inbox" && (
          <div className="animate-pop-in absolute top-11 right-0 z-50 w-[300px] rounded-ctrl border border-line bg-card p-2 shadow-pop">
            <p className="label-mono px-2 py-1.5 !text-[11px] text-ink-3">PESAN MASUK</p>
            <div className="space-y-1 text-[12.5px]">
              <div className="rounded-sm2 p-2 hover:bg-hover">
                <p className="font-medium text-ink">Konfirmasi Pembayaran Lisensi</p>
                <p className="text-[11.5px] text-ink-3">
                  Warung Sambal Jaya (Cabang Margonda) telah mengirim bukti transfer Rp30.000.
                </p>
              </div>
              <div className="rounded-sm2 p-2 hover:bg-hover">
                <p className="font-medium text-ink">Laporan Harian Cabang Kemang</p>
                <p className="text-[11.5px] text-ink-3">
                  Kasir menutup shift pagi dengan selisih tunai Rp0.
                </p>
              </div>
            </div>
          </div>
        )}

        {popover === "avatar" && (
          <div className="animate-pop-in absolute top-11 right-0 z-50 w-[230px] rounded-ctrl border border-line bg-card p-2 shadow-pop">
            <div className="border-b border-line-subtle px-2 pb-2">
              <p className="text-[13px] font-semibold text-ink">{meta.name}</p>
              <p className="text-[11.5px] text-ink-3">{meta.title}</p>
            </div>
            <div className="mt-1.5 space-y-0.5 text-[12.5px]">
              {(["superadmin", "owner", "branch_admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    onRoleChange(r);
                    setPopover(null);
                  }}
                  className="flex w-full cursor-pointer items-center justify-between rounded-sm2 px-2 py-1.5 text-left text-ink-2 hover:bg-hover hover:text-ink"
                >
                  <span>{ROLE_META[r].title}</span>
                  {role === r && <span className="size-1.5 rounded-full bg-ink" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {paletteOpen && (
        <div
          className="animate-backdrop-in fixed inset-0 z-50 flex items-start justify-center bg-ink/25 px-4 pt-20 backdrop-blur-[2px]"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="animate-modal-in tray w-full max-w-[540px] shadow-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inner-card overflow-hidden">
              <div className="flex items-center gap-2.5 border-b border-line-subtle px-4 py-3">
                <Search className="size-4 shrink-0 text-ink-3" strokeWidth={1.5} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActiveIdx(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" && totalResults > 0) {
                      e.preventDefault();
                      setActiveIdx((i) => (i + 1) % totalResults);
                    } else if (e.key === "ArrowUp" && totalResults > 0) {
                      e.preventDefault();
                      setActiveIdx((i) => (i - 1 + totalResults) % totalResults);
                    } else if (e.key === "Enter" && totalResults > 0) {
                      e.preventDefault();
                      selectPaletteIndex(activeIdx);
                    }
                  }}
                  placeholder="Ketik nama menu, cabang, atau nomor struk..."
                  className="flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-3"
                />
                <button
                  type="button"
                  onClick={() => setPaletteOpen(false)}
                  aria-label="Tutup pencarian"
                  className="grid size-6 cursor-pointer place-items-center rounded-xs2 text-ink-3 hover:bg-hover hover:text-ink"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="no-scrollbar max-h-[340px] overflow-y-auto p-2">
                {filteredNav.length > 0 && (
                  <div className="mb-2">
                    <p className="label-mono px-2.5 py-1.5 !text-[10.5px] text-ink-3">
                      MENU NAVIGASI
                    </p>
                    <div className="space-y-0.5">
                      {filteredNav.map((item, idx) => {
                        const selected = idx === activeIdx;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onMouseEnter={() => setActiveIdx(idx)}
                            onClick={() => selectPaletteIndex(idx)}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-2.5 rounded-sm2 px-2.5 py-2 text-left text-[13px] transition-colors",
                              selected
                                ? "bg-muted font-medium text-ink"
                                : "text-ink-2 hover:bg-hover",
                            )}
                          >
                            <span
                              className={cn(
                                "grid size-7 shrink-0 place-items-center rounded-xs2 border",
                                selected
                                  ? "border-line bg-card text-ink shadow-card"
                                  : "border-line-subtle bg-sidebar text-ink-3",
                              )}
                            >
                              <item.icon className="size-3.5" strokeWidth={1.75} />
                            </span>
                            <span className="flex-1">{item.label}</span>
                            {selected && (
                              <span className="flex items-center gap-1 text-[11px] text-ink-3">
                                Buka <ArrowRight className="size-3" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {filteredTxns.length > 0 && (
                  <div>
                    <p className="label-mono px-2.5 py-1.5 !text-[10.5px] text-ink-3">
                      TRANSAKSI TERKAIT
                    </p>
                    <div className="space-y-0.5">
                      {filteredTxns.map((t, idx) => {
                        const globalIdx = filteredNav.length + idx;
                        const selected = globalIdx === activeIdx;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onMouseEnter={() => setActiveIdx(globalIdx)}
                            onClick={() => selectPaletteIndex(globalIdx)}
                            className={cn(
                              "flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm2 px-2.5 py-2 text-left text-[12.5px] transition-colors",
                              selected ? "bg-muted text-ink" : "hover:bg-hover",
                            )}
                          >
                            <span className="font-mono text-[12px] text-ink-3">{t.receiptNo}</span>
                            <span className="min-w-0 flex-1 truncate px-2 font-medium text-ink">
                              {t.itemsSummary}
                            </span>
                            <StatusBadge status={t.status} />
                            <span className="font-mono font-semibold text-ink">
                              {formatRupiah(t.total)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {totalResults === 0 && (
                  <p className="px-3 py-8 text-center text-[13px] text-ink-3">
                    Tidak ada hasil untuk &ldquo;{searchQuery}&rdquo;.
                  </p>
                )}
              </div>

              <footer className="flex items-center justify-between border-t border-line-subtle bg-sidebar px-4 py-2 text-[11.5px] text-ink-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                    <span className="ml-0.5">Navigasi</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Kbd>
                      <CornerDownLeft className="size-2.5" />
                    </Kbd>
                    <span className="ml-0.5">Pilih</span>
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Kbd>Esc</Kbd>
                  <span className="ml-0.5">Tutup</span>
                </span>
              </footer>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
