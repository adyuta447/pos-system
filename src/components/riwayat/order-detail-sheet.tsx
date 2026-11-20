import { useState } from "react";
import { View } from "react-native";

import AppText from "@/components/ui/app-text";
import Button from "@/components/ui/button";
import ReceiptPaper from "@/components/ui/receipt-paper";
import Sheet from "@/components/ui/sheet";
import type { OrderSummary } from "@/db/orders";
import { printLines, shareReceipt } from "@/lib/printer";
import { formatOrderNo } from "@/lib/receipt";

import VoidOrderForm from "./void-order-form";

interface OrderDetailSheetProps {
  order: OrderSummary;
  receiptLines: string[];
  onVoid(reason: string): void;
  onClose(): void;
}

export default function OrderDetailSheet({
  order,
  receiptLines,
  onVoid,
  onClose,
}: OrderDetailSheetProps) {
  const [isVoiding, setVoiding] = useState(false);
  const [message, setMessage] = useState("");

  const handleReprint = async () =>
    setMessage(
      (await printLines(receiptLines))
        ? "Struk dicetak"
        : "Printer belum tersambung",
    );

  return (
    <Sheet
      title={`Transaksi ${formatOrderNo(order.orderNo)}`}
      onClose={onClose}
    >
      {isVoiding ? (
        <VoidOrderForm onConfirm={onVoid} onCancel={() => setVoiding(false)} />
      ) : (
        <View className="gap-3">
          <ReceiptPaper lines={receiptLines} />
          {!!message && (
            <AppText className="text-center font-label text-base">
              {message}
            </AppText>
          )}
          <View className="flex-row flex-wrap gap-2">
            <Button
              label="Cetak ulang"
              variant="orange"
              className="flex-1"
              onPress={handleReprint}
            />
            <Button
              label="WhatsApp"
              className="flex-1"
              onPress={() => shareReceipt(receiptLines)}
            />
            {order.status === "paid" && (
              <Button
                label="Batalkan transaksi"
                variant="red"
                className="flex-1"
                onPress={() => setVoiding(true)}
              />
            )}
          </View>
        </View>
      )}
    </Sheet>
  );
}
