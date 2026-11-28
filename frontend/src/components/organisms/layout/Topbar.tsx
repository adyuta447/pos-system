"use client";

import { Bell, ChevronRight, Inbox, Menu } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { IconButton } from "@/components/atoms/IconButton";
import { SearchTrigger } from "@/components/molecules/SearchTrigger";
import { PAGE_TITLES, type PageId, type UserRole } from "@/config/nav";
import type { PosTxn } from "@/data/mock";
import { useTopbar } from "@/hooks/useTopbar";
import { AccountPopover } from "./AccountPopover";
import { CommandPalette } from "./CommandPalette";
import { InboxPopover } from "./InboxPopover";
import { NotificationPopover } from "./NotificationPopover";

interface TopbarProps {
  activePage: PageId;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (page: PageId) => void;
  transactions: PosTxn[];
  lowStockCount: number;
  pendingLicenseCount: number;
  onOpenMenu?: () => void;
}

export function Topbar(props: TopbarProps) {
  const { activePage, role, onNavigate, transactions, onOpenMenu } = props;
  const {
    meta, popoverRef, activePopover, togglePopover, paletteOpen, openPalette, closePalette,
    alertCount, showLicenseAlert, navigateFromPopover, changeRole,
  } = useTopbar(props);

  return (
    <header className="flex h-[var(--topbar-h)] shrink-0 items-center justify-between gap-4 border-b border-line px-5">
      <div className="flex items-center gap-2.5">
        {onOpenMenu && (
          <IconButton onClick={onOpenMenu} aria-label="Buka menu navigasi" className="lg:hidden">
            <Menu className="size-4" strokeWidth={1.5} />
          </IconButton>
        )}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px]">
          <button type="button" onClick={() => onNavigate("overview")} className="cursor-pointer text-ink-3 hover:text-ink">
            Panel Admin
          </button>
          <ChevronRight className="size-3.5 text-ink-4" />
          <span className="font-medium text-ink">{PAGE_TITLES[activePage]}</span>
        </nav>
      </div>

      <div ref={popoverRef} className="relative flex items-center gap-2">
        <SearchTrigger onClick={openPalette} />

        <div className="relative">
          <IconButton aria-label="Notifikasi" onClick={() => togglePopover("bell")}>
            <Bell className="size-4" strokeWidth={1.5} />
          </IconButton>
          {alertCount > 0 && (
            <span className="pointer-events-none absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-ink text-[10px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </div>
        <IconButton aria-label="Pesan masuk" onClick={() => togglePopover("inbox")}>
          <Inbox className="size-4" strokeWidth={1.5} />
        </IconButton>
        <button
          type="button"
          onClick={() => togglePopover("avatar")}
          className="cursor-pointer rounded-sm2 focus-visible:ring-2 focus-visible:ring-ink"
          aria-label="Menu akun"
        >
          <Avatar alt={meta.name} initials={meta.initials} />
        </button>

        {activePopover === "bell" && (
          <NotificationPopover
            lowStockCount={props.lowStockCount}
            pendingLicenseCount={props.pendingLicenseCount}
            showLicenseAlert={showLicenseAlert}
            alertCount={alertCount}
            onNavigate={navigateFromPopover}
          />
        )}
        {activePopover === "inbox" && <InboxPopover />}
        {activePopover === "avatar" && <AccountPopover role={role} onRoleChange={changeRole} />}
      </div>

      {paletteOpen && (
        <CommandPalette role={role} transactions={transactions} onNavigate={onNavigate} onClose={closePalette} />
      )}
    </header>
  );
}
