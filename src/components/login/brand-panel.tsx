import { View } from "react-native";

import AppText from "@/components/ui/app-text";

interface Props {
  storeName: string;
  address: string;
  layout: "side" | "top";
}

/** Red store panel: left column on tablets, top band on phones. */
export default function BrandPanel({ storeName, address, layout }: Props) {
  const isSide = layout === "side";
  return (
    <View className={`bg-red p-8 ${isSide ? "w-2/5 justify-between" : "pb-6"}`}>
      <AppText className="font-label text-base text-paper">Kasir</AppText>
      <View>
        <AppText
          className={`font-display text-paper ${isSide ? "text-6xl leading-[64px]" : "text-4xl"}`}
        >
          {storeName}
        </AppText>
        <AppText className="mt-2 text-lg text-paper">{address}</AppText>
      </View>
    </View>
  );
}
