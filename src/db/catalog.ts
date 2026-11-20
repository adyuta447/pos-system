import type { SQLiteDatabase } from 'expo-sqlite';

import type { Discount } from '@/lib/cart';

export interface Category {
  id: string;
  name: string;
}

/** What the cart and modifier sheet need to know about a product. */
export interface ProductInfo {
  id: string;
  name: string;
  price: number;
}

export interface Product extends ProductInfo {
  categoryId: string;
  isAvailable: boolean;
}

export interface ModifierOption {
  id: string;
  name: string;
  priceDelta: number;
  isDefault: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelect: number;
  options: ModifierOption[];
}

export interface Catalog {
  categories: Category[];
  products: Product[];
  /** Modifier groups per product id, required groups first. */
  modifiersByProduct: Map<string, ModifierGroup[]>;
  discounts: Discount[];
}

interface ProductRow extends ProductInfo {
  categoryId: string;
  isAvailable: number;
}

interface GroupRow {
  id: string;
  name: string;
  required: number;
  maxSelect: number;
}

interface OptionRow {
  id: string;
  groupId: string;
  name: string;
  priceDelta: number;
  isDefault: number;
}

interface LinkRow {
  productId: string;
  groupId: string;
}

export function getCatalog(db: SQLiteDatabase): Catalog {
  const categories = db.getAllSync<Category>('SELECT id, name FROM categories ORDER BY sort_order');
  const products = db
    .getAllSync<ProductRow>(
      `SELECT p.id, p.category_id AS categoryId, p.name, p.price, p.is_available AS isAvailable
       FROM products p JOIN categories c ON c.id=p.category_id
       WHERE p.active=1 ORDER BY c.sort_order, p.sort_order`,
    )
    .map((p) => ({ ...p, isAvailable: p.isAvailable === 1 }));
  const discounts = db.getAllSync<Discount>('SELECT id, name, type, value FROM discounts WHERE active=1');
  return { categories, products, modifiersByProduct: getModifiersByProduct(db), discounts };
}

function getModifiersByProduct(db: SQLiteDatabase): Map<string, ModifierGroup[]> {
  const groups = db.getAllSync<GroupRow>('SELECT id, name, required, max_select AS maxSelect FROM modifier_groups');
  const options = db.getAllSync<OptionRow>(
    'SELECT id, group_id AS groupId, name, price_delta AS priceDelta, is_default AS isDefault FROM modifier_options ORDER BY sort_order',
  );
  const links = db.getAllSync<LinkRow>('SELECT product_id AS productId, group_id AS groupId FROM product_modifier_groups');

  const groupById = new Map<string, ModifierGroup>(
    groups.map((g) => [
      g.id,
      {
        id: g.id,
        name: g.name,
        required: g.required === 1,
        maxSelect: g.maxSelect,
        options: options
          .filter((o) => o.groupId === g.id)
          .map((o) => ({ id: o.id, name: o.name, priceDelta: o.priceDelta, isDefault: o.isDefault === 1 })),
      },
    ]),
  );

  const result = new Map<string, ModifierGroup[]>();
  for (const { productId, groupId } of links) {
    const group = groupById.get(groupId);
    if (group) result.set(productId, [...(result.get(productId) ?? []), group]);
  }
  for (const list of result.values()) list.sort((a, b) => Number(b.required) - Number(a.required));
  return result;
}

export function setProductAvailable(db: SQLiteDatabase, productId: string, isAvailable: boolean) {
  db.runSync('UPDATE products SET is_available=? WHERE id=?', isAvailable ? 1 : 0, productId);
}
