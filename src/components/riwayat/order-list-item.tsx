import { Pressable } from "react-native";

import AppText from "@/components/ui/app-text";
import type { OrderSummary } from "@/db/orders";
import { formatRupiah } from "@/lib/money";
import { formatOrderNo } from "@/lib/receipt";

interface Props {
  order: OrderSummary;
  onPress(order: OrderSummary): void;
}

const formatTime = (iso: string) => new Date(iso).toTimeString().slice(0, 5);

export default function OrderListItem({ order, onPress }: Props) {
  const isVoid = order.status === "void";
  const status = isVoid
    ? `Dibatalkan: ${order.voidReason}`
    : order.method === "cash"
      ? "Tunai"
      : "QRIS";
  return (
    <Pressable
      onPress={() => onPress(order)}
      accessibilityRole="button"
      className={`min-h-16 flex-row items-center gap-4 rounded-2xl px-4 active:scale-95 ${isVoid ? "bg-line" : "bg-paper"}`}
    >
      <AppText className="w-20 font-display text-lg">
        {formatOrderNo(order.orderNo)}
      </AppText>
      <AppText className="w-14 text-base">
        {formatTime(order.createdAt)}
      </AppText>
      <AppText className="flex-1 font-label text-base">{status}</AppText>
      <AppText
        className={`font-heading text-lg ${isVoid ? "line-through" : ""}`}
      >
        {formatRupiah(order.total)}
      </AppText>
    </Pressable>
  );
}
