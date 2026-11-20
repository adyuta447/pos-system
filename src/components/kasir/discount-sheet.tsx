import { View } from 'react-native';

import Button from '@/components/ui/button';
import Sheet from '@/components/ui/sheet';
import type { Discount } from '@/lib/cart';

interface Props {
  discounts: Discount[];
  selectedId: string | null;
  onSelect(discount: Discount | null): void;
  onClose(): void;
}

export default function DiscountSheet({ discounts, selectedId, onSelect, onClose }: Props) {
  return (
    <Sheet title="Pilih diskon" onClose={onClose}>
      <View className="gap-2">
        {discounts.map((discount) => (
          <Button key={discount.id} label={discount.name} size="lg" selected={selectedId === discount.id} onPress={() => onSelect(discount)} />
        ))}
        <Button label="Tanpa diskon" size="lg" variant="orange" onPress={() => onSelect(null)} />
      </View>
    </Sheet>
  );
}
