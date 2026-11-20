import { useState } from "react";
import { View } from "react-native";

import AppText from "@/components/ui/app-text";
import Button from "@/components/ui/button";
import TextField from "@/components/ui/text-field";

interface Props {
  onConfirm(reason: string): void;
  onCancel(): void;
}

const COMMON_REASONS = [
  "Salah input",
  "Pembeli batal",
  "Dana QRIS tidak masuk",
];

export default function VoidOrderForm({ onConfirm, onCancel }: Props) {
  const [reason, setReason] = useState("");
  const trimmed = reason.trim();
  return (
    <View className="gap-3">
      <AppText className="text-lg">
        Alasan pembatalan wajib diisi. Transaksi tetap tercatat sebagai
        dibatalkan.
      </AppText>
      <View className="flex-row flex-wrap gap-2">
        {COMMON_REASONS.map((r) => (
          <Button
            key={r}
            label={r}
            selected={reason === r}
            onPress={() => setReason(r)}
          />
        ))}
      </View>
      <TextField
        value={reason}
        onChangeText={setReason}
        placeholder="Atau tulis alasan"
        accessibilityLabel="Alasan pembatalan"
      />
      <View className="flex-row gap-2">
        <Button label="Jangan batalkan" onPress={onCancel} />
        <Button
          label="Batalkan transaksi"
          variant="red"
          className="flex-1"
          disabled={!trimmed}
          onPress={() => onConfirm(trimmed)}
        />
      </View>
    </View>
  );
}
