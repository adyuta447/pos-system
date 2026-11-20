import { Pressable, View } from 'react-native';

import AppText from '@/components/ui/app-text';
import type { Product } from '@/db/catalog';
import { formatRupiah } from '@/lib/money';

interface Props {
  product: Product;
  /** How many are already in the cart. */
  quantity: number;
  width: number;
  onPress(product: Product): void;
  onLongPress(product: Product): void;
}

export default function ProductCard({ product, quantity, width, onPress, onLongPress }: Props) {
  const soldOut = !product.isAvailable;
  const surface = soldOut ? 'bg-line' : quantity ? 'bg-orange' : 'bg-paper';
  // Red price only on white: red on orange fails contrast.
  const priceColor = soldOut || quantity ? '' : 'text-red';
  const a11yLabel = [product.name, formatRupiah(product.price), soldOut && 'habis', quantity && `${quantity} di keranjang`]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      onPress={() => onPress(product)}
      onLongPress={() => onLongPress(product)}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint="Tekan lama untuk tandai habis atau tersedia"
      style={{ width }}
      className={`min-h-28 justify-between rounded-2xl p-3 active:scale-95 ${surface}`}>
      <AppText className="font-heading text-lg leading-6" numberOfLines={2}>
        {product.name}
      </AppText>
      <View className="flex-row items-end justify-between">
        <AppText className={`font-display text-xl ${priceColor}`}>{soldOut ? 'Habis' : formatRupiah(product.price)}</AppText>
        {quantity > 0 && (
          <View className="h-9 min-w-9 items-center justify-center rounded-full bg-ink px-2">
            <AppText className="font-display text-base text-paper">{quantity}</AppText>
          </View>
        )}
      </View>
    </Pressable>
  );
}
