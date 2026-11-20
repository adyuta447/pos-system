import { useMemo, useState } from 'react';
import { View } from 'react-native';

import TextField from '@/components/ui/text-field';
import type { Catalog, Product } from '@/db/catalog';

import CategoryTabs from './category-tabs';
import ProductGrid from './product-grid';

interface Props {
  catalog: Catalog;
  qtyByProduct: Map<string, number>;
  width: number;
  onPressProduct(product: Product): void;
  onLongPressProduct(product: Product): void;
}

const PADDING = 16; // matches p-4

/** Left side of the register: search, category tabs, product grid. Owns its own filter state. */
export default function MenuPanel({ catalog, qtyByProduct, width, onPressProduct, onLongPressProduct }: Props) {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // A search looks through every category.
  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return catalog.products.filter((p) => p.name.toLowerCase().includes(q));
    return categoryId ? catalog.products.filter((p) => p.categoryId === categoryId) : catalog.products;
  }, [catalog.products, categoryId, query]);

  const selectCategory = (id: string | null) => {
    setQuery('');
    setCategoryId(id);
  };

  return (
    <View className="flex-1 gap-3 p-4">
      <TextField value={query} onChangeText={setQuery} placeholder="Cari menu" accessibilityLabel="Cari menu" />
      <CategoryTabs categories={catalog.categories} selectedId={query ? undefined : categoryId} onSelect={selectCategory} />
      <ProductGrid
        products={products}
        qtyByProduct={qtyByProduct}
        width={width - PADDING * 2}
        onPressProduct={onPressProduct}
        onLongPressProduct={onLongPressProduct}
      />
    </View>
  );
}
