import type { SQLiteDatabase } from 'expo-sqlite';

import { hashPin, newId } from './ids';

interface ModifierSeed {
  name: string;
  required: boolean;
  maxSelect: number;
  options: [name: string, priceDelta: number][];
}

interface ProductSeed {
  name: string;
  price: number;
  modifierGroupIds: string[];
}

interface CategorySeed {
  name: string;
  products: ProductSeed[];
}

const DEMO_PINS = { owner: '123456', cashier: '1234' };

/** Demo store so the app is usable before the owner dashboard exists. Replace via the dashboard later. */
export default async function seedDemoData(db: SQLiteDatabase) {
  const storeId = newId();
  const ownerId = newId();
  const cashierId = newId();
  const ownerPin = await hashPin(ownerId, DEMO_PINS.owner);
  const cashierPin = await hashPin(cashierId, DEMO_PINS.cashier);

  db.withTransactionSync(() => {
    db.runSync(
      'INSERT INTO stores (id, name, address, phone, receipt_footer) VALUES (?,?,?,?,?)',
      storeId, 'Kopi Senja', 'Jl. Merdeka No. 12', '0812-0000-0000', 'Terima kasih!',
    );
    const insertUser = 'INSERT INTO users (id, store_id, name, pin_hash, role) VALUES (?,?,?,?,?)';
    db.runSync(insertUser, ownerId, storeId, 'Pemilik', ownerPin, 'owner');
    db.runSync(insertUser, cashierId, storeId, 'Rina', cashierPin, 'cashier');

    const insertGroup = ({ name, required, maxSelect, options }: ModifierSeed) => {
      const groupId = newId();
      db.runSync(
        'INSERT INTO modifier_groups (id, store_id, name, required, max_select) VALUES (?,?,?,?,?)',
        groupId, storeId, name, required ? 1 : 0, maxSelect,
      );
      options.forEach(([optionName, priceDelta], index) =>
        db.runSync(
          'INSERT INTO modifier_options (id, group_id, name, price_delta, is_default, sort_order) VALUES (?,?,?,?,?,?)',
          newId(), groupId, optionName, priceDelta, required && index === 0 ? 1 : 0, index,
        ));
      return groupId;
    };

    const size = insertGroup({ name: 'Ukuran', required: true, maxSelect: 1, options: [['Regular', 0], ['Large', 5000]] });
    const sugar = insertGroup({ name: 'Gula', required: false, maxSelect: 1, options: [['Gula normal', 0], ['Less sugar', 0], ['Tanpa gula', 0]] });
    const ice = insertGroup({ name: 'Es', required: false, maxSelect: 1, options: [['Es normal', 0], ['Less ice', 0], ['Tanpa es', 0]] });
    const topping = insertGroup({ name: 'Topping', required: false, maxSelect: 2, options: [['Boba', 4000], ['Keju', 5000], ['Extra shot', 6000]] });

    const menu: CategorySeed[] = [
      {
        name: 'Kopi',
        products: [
          { name: 'Es Kopi Susu', price: 18000, modifierGroupIds: [size, sugar, ice, topping] },
          { name: 'Americano', price: 15000, modifierGroupIds: [size, sugar, ice] },
          { name: 'Kopi Tubruk', price: 10000, modifierGroupIds: [sugar] },
          { name: 'Cappuccino', price: 22000, modifierGroupIds: [size, sugar] },
          { name: 'Kopi Aren', price: 20000, modifierGroupIds: [size, ice, topping] },
        ],
      },
      {
        name: 'Non kopi',
        products: [
          { name: 'Es Teh Manis', price: 6000, modifierGroupIds: [sugar, ice] },
          { name: 'Matcha Latte', price: 22000, modifierGroupIds: [size, sugar, ice, topping] },
          { name: 'Coklat', price: 20000, modifierGroupIds: [size, sugar, ice, topping] },
          { name: 'Lemon Tea', price: 12000, modifierGroupIds: [sugar, ice] },
          { name: 'Air Mineral', price: 5000, modifierGroupIds: [] },
        ],
      },
      {
        name: 'Makanan',
        products: [
          { name: 'Nasi Goreng', price: 22000, modifierGroupIds: [] },
          { name: 'Mie Goreng', price: 20000, modifierGroupIds: [] },
          { name: 'Nasi Ayam Geprek', price: 25000, modifierGroupIds: [] },
          { name: 'Indomie Telur', price: 15000, modifierGroupIds: [] },
        ],
      },
      {
        name: 'Camilan',
        products: [
          { name: 'Roti Bakar Coklat', price: 18000, modifierGroupIds: [] },
          { name: 'Kentang Goreng', price: 15000, modifierGroupIds: [] },
          { name: 'Pisang Goreng', price: 12000, modifierGroupIds: [] },
          { name: 'Cireng', price: 10000, modifierGroupIds: [] },
        ],
      },
    ];

    menu.forEach((category, categoryIndex) => {
      const categoryId = newId();
      db.runSync('INSERT INTO categories (id, store_id, name, sort_order) VALUES (?,?,?,?)', categoryId, storeId, category.name, categoryIndex);
      category.products.forEach((product, productIndex) => {
        const productId = newId();
        db.runSync(
          'INSERT INTO products (id, category_id, name, price, sort_order) VALUES (?,?,?,?,?)',
          productId, categoryId, product.name, product.price, productIndex,
        );
        for (const groupId of product.modifierGroupIds) {
          db.runSync('INSERT INTO product_modifier_groups (product_id, group_id) VALUES (?,?)', productId, groupId);
        }
      });
    });

    const insertDiscount = 'INSERT INTO discounts (id, store_id, name, type, value) VALUES (?,?,?,?,?)';
    db.runSync(insertDiscount, newId(), storeId, 'Promo 10%', 'percent', 10);
    db.runSync(insertDiscount, newId(), storeId, 'Potongan Rp5.000', 'amount', 5000);
  });
}
