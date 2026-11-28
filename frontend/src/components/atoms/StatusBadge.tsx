import { CircleCheck, Clock, XCircle } from "lucide-react";
import type { BranchStatus, PosTxnStatus } from "@/data/mock";

export type BadgeStatus = PosTxnStatus | BranchStatus;

interface StatusBadgeProps {
  status: BadgeStatus;
}

const MAP: Record<BadgeStatus, { Icon: typeof CircleCheck; icon: string; text: string }> = {
  Selesai: { Icon: CircleCheck, icon: "text-success", text: "text-success-ink" },
  Aktif: { Icon: CircleCheck, icon: "text-success", text: "text-success-ink" },
  Tertunda: { Icon: Clock, icon: "text-warning", text: "text-warning-ink" },
  "Menunggu Aktivasi": { Icon: Clock, icon: "text-warning", text: "text-warning-ink" },
  Dibatalkan: { Icon: XCircle, icon: "text-neutralstatus", text: "text-neutralstatus" },
  Nonaktif: { Icon: XCircle, icon: "text-neutralstatus", text: "text-neutralstatus" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { Icon, icon, text } = MAP[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-card px-2.5 py-1 text-[12px] font-medium ${text}`}
    >
      <Icon className={`size-3.5 ${icon}`} strokeWidth={2} />
      {status}
    </span>
  );
}
