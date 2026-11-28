import { PopoverCard } from "@/components/molecules/PopoverCard";
import { PopoverItem } from "@/components/molecules/PopoverItem";
import type { PageId } from "@/config/nav";

interface NotificationPopoverProps {
  lowStockCount: number;
  pendingLicenseCount: number;
  showLicenseAlert: boolean;
  alertCount: number;
  onNavigate: (page: PageId) => void;
}

export function NotificationPopover({
  lowStockCount,
  pendingLicenseCount,
  showLicenseAlert,
  alertCount,
  onNavigate,
}: NotificationPopoverProps) {
  return (
    <PopoverCard title="NOTIFIKASI SISTEM" width="w-[310px]">
      <div className="space-y-1 text-[12.5px]">
        {lowStockCount > 0 && (
          <PopoverItem
            title={`${lowStockCount} produk perlu restok`}
            description="Klik untuk buka menu Produk & Stok"
            onClick={() => onNavigate("products")}
          />
        )}
        {showLicenseAlert && (
          <PopoverItem
            title={`${pendingLicenseCount} cabang menunggu aktivasi lisensi`}
            description="Klik untuk aktivasi lisensi cabang"
            onClick={() => onNavigate("branches")}
          />
        )}
        {alertCount === 0 && (
          <p className="px-2 py-3 text-ink-3">Semua operasional cabang berjalan normal.</p>
        )}
      </div>
    </PopoverCard>
  );
}
