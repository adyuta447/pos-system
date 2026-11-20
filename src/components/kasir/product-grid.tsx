import { FlatList } from 'react-native';

import AppText from '@/components/ui/app-text';
import type { Product } from '@/db/catalog';

import ProductCard from './product-card';

interface Props {
  products: Product[];
  qtyByProduct: Map<string, number>;
  /** Width available for the grid, without padding. */
  width: number;
  onPressProduct(product: Product): void;
  onLongPressProduct(product: Product): void;
}

const MIN_CARD_WIDTH = 190;
const GAP = 12; // matches gap-3

export default function ProductGrid({ products, qtyByProduct, width, onPressProduct, onLongPressProduct }: Props) {
  const columns = Math.max(2, Math.floor(width / MIN_CARD_WIDTH));
  // Fixed card width so a short last row does not stretch.
  const cardWidth = (width - GAP * (columns - 1)) / columns;

  return (
    <FlatList
      key={columns}
      data={products}
      numColumns={columns}
      keyExtractor={(product) => product.id}
      columnWrapperClassName="gap-3"
      contentContainerClassName="gap-3 pb-28"
      ListEmptyComponent={<AppText className="p-6 text-center text-lg">Menu tidak ditemukan</AppText>}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          quantity={qtyByProduct.get(item.id) ?? 0}
          width={cardWidth}
          onPress={onPressProduct}
          onLongPress={onLongPressProduct}
        />
      )}
    />
  );
}
