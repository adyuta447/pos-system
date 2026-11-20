import { View } from "react-native";

import AppText from "@/components/ui/app-text";
import Keypad from "@/components/ui/keypad";
import type { KeypadKey } from "@/lib/keypad";

interface Props {
  userName: string;
  length: number;
  error: string;
  onKeyPress(key: KeypadKey): void;
}

const MIN_DOTS = 4;

export default function PinEntry({
  userName,
  length,
  error,
  onKeyPress,
}: Props) {
  return (
    <View className="gap-5">
      <View className="items-center gap-2">
        <AppText className="font-label text-base">PIN {userName}</AppText>
        <View
          className="h-6 flex-row gap-3"
          accessibilityLabel={`${length} angka diisi`}
        >
          {Array.from({ length: Math.max(MIN_DOTS, length) }, (_, i) => (
            <View
              key={i}
              className={`h-5 w-5 rounded-full ${i < length ? "bg-red" : "border-2 border-ink bg-paper"}`}
            />
          ))}
        </View>
        <AppText
          className="h-7 font-heading text-xl text-red"
          accessibilityLiveRegion="polite"
        >
          {error}
        </AppText>
      </View>
      <Keypad mode="pin" onKeyPress={onKeyPress} />
    </View>
  );
}
