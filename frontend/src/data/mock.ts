import type { UserRole } from "../config/nav";

export type BranchStatus = "Aktif" | "Menunggu Aktivasi" | "Nonaktif";

export type BranchItem = {
  id: string;
  name: string;
  umkmName: string;
  city: string;
  adminName: string;
  status: BranchStatus;
  licenseKey: string;
  validUntil: string;
  monthlyFee: number;
};

export type PosTxnStatus = "Selesai" | "Tertunda" | "Dibatalkan";

export type PosTxn = {
  id: string;
  receiptNo: string;
  branchId: string;
  branchName: string;
  cashier: string;
  itemsSummary: string;
  itemCount: number;
  method: "Tunai" | "QRIS";
  orderType: "Reguler" | "Online";
  status: PosTxnStatus;
  total: number;
  createdAt: string;
  date: string;
};

export type ExpenseSource = "Tunai (Laci)" | "Non-tunai";

export type ExpenseItem = {
  id: string;
  branchId: string;
  branchName: string;
  category: string;
  note: string;
  source: ExpenseSource;
  amount: number;
  date: string;
};

export type ProductItem = {
  id: string;
  branchId: string;
  branchName: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  active: boolean;
};

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId: string | "all";
  branchLabel: string;
  status: "Aktif" | "Nonaktif";
  lastLogin: string;
};

export type AuditLogItem = {
  id: string;
  timestamp: string;
  actor: string;
  roleLabel: string;
  action: string;
  target: string;
  detail: string;
};

export function formatRupiah(amount: number): string {
  const abs = Math.abs(Math.round(amount));
  const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return amount < 0 ? `-Rp${formatted}` : `Rp${formatted}`;
}

export function umkmOfBranch(branchId: string): string {
  return INITIAL_BRANCHES.find((b) => b.id === branchId)?.umkmName ?? "Kopi Laris Nusantara";
}

export const INITIAL_BRANCHES: BranchItem[] = [
  {
    id: "cab-kemang",
    name: "Cabang Kemang",
    umkmName: "Kopi Laris Nusantara",
    city: "Jakarta Selatan",
    adminName: "Siti Rahmawati",
    status: "Aktif",
    licenseKey: "POS-KMG-2026-8812",
    validUntil: "27 Des 2026",
    monthlyFee: 30000,
  },
  {
    id: "cab-tebet",
    name: "Cabang Tebet",
    umkmName: "Kopi Laris Nusantara",
    city: "Jakarta Selatan",
    adminName: "Budi Santoso",
    status: "Aktif",
    licenseKey: "POS-TBT-2026-4409",
    validUntil: "19 Des 2026",
    monthlyFee: 30000,
  },
  {
    id: "cab-depok",
    name: "Cabang Margonda",
    umkmName: "Warung Sambal Jaya",
    city: "Depok",
    adminName: "Andi Wijaya",
    status: "Menunggu Aktivasi",
    licenseKey: "POS-DPK-2026-1190",
    validUntil: "Menunggu konfirmasi",
    monthlyFee: 30000,
  },
];

export const INITIAL_TXNS: PosTxn[] = [
  {
    id: "trx-1",
    receiptNo: "INV-261127-0018",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    cashier: "Siti Rahmawati",
    itemsSummary: "6x Kopi Susu Gula Aren, 4x Croissant",
    itemCount: 10,
    method: "QRIS",
    orderType: "Online",
    status: "Selesai",
    total: 432000,
    createdAt: "10:42",
    date: "27 Nov 2026",
  },
  {
    id: "trx-2",
    receiptNo: "INV-261127-0017",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    cashier: "Siti Rahmawati",
    itemsSummary: "8x Americano Dingin, 5x Roti Bakar",
    itemCount: 13,
    method: "Tunai",
    orderType: "Reguler",
    status: "Selesai",
    total: 394000,
    createdAt: "10:15",
    date: "27 Nov 2026",
  },
  {
    id: "trx-3",
    receiptNo: "INV-261127-0016",
    branchId: "cab-tebet",
    branchName: "Cabang Tebet",
    cashier: "Budi Santoso",
    itemsSummary: "10x Matcha Latte, 6x Pisang Goreng",
    itemCount: 16,
    method: "QRIS",
    orderType: "Reguler",
    status: "Selesai",
    total: 520000,
    createdAt: "09:50",
    date: "27 Nov 2026",
  },
  {
    id: "trx-4",
    receiptNo: "INV-261127-0015",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    cashier: "Siti Rahmawati",
    itemsSummary: "3x Paket Kopi 1 Liter",
    itemCount: 3,
    method: "QRIS",
    orderType: "Online",
    status: "Tertunda",
    total: 276000,
    createdAt: "09:30",
    date: "27 Nov 2026",
  },
  {
    id: "trx-5",
    receiptNo: "INV-261127-0014",
    branchId: "cab-tebet",
    branchName: "Cabang Tebet",
    cashier: "Budi Santoso",
    itemsSummary: "2x Es Teh Manis, 1x Nasi Goreng",
    itemCount: 3,
    method: "Tunai",
    orderType: "Reguler",
    status: "Dibatalkan",
    total: 42000,
    createdAt: "09:05",
    date: "27 Nov 2026",
  },
  {
    id: "trx-6",
    receiptNo: "INV-261126-0092",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    cashier: "Siti Rahmawati",
    itemsSummary: "12x Kopi Susu Gula Aren, 4x Croissant",
    itemCount: 16,
    method: "Tunai",
    orderType: "Reguler",
    status: "Selesai",
    total: 464000,
    createdAt: "19:20",
    date: "26 Nov 2026",
  },
  {
    id: "trx-7",
    receiptNo: "INV-261127-0013",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    cashier: "Siti Rahmawati",
    itemsSummary: "4x Kopi Susu Gula Aren, 2x Croissant",
    itemCount: 6,
    method: "QRIS",
    orderType: "Reguler",
    status: "Selesai",
    total: 138000,
    createdAt: "08:52",
    date: "27 Nov 2026",
  },
  {
    id: "trx-8",
    receiptNo: "INV-261127-0012",
    branchId: "cab-tebet",
    branchName: "Cabang Tebet",
    cashier: "Budi Santoso",
    itemsSummary: "5x Matcha Latte",
    itemCount: 5,
    method: "Tunai",
    orderType: "Reguler",
    status: "Selesai",
    total: 130000,
    createdAt: "08:45",
    date: "27 Nov 2026",
  },
  {
    id: "trx-9",
    receiptNo: "INV-261127-0011",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    cashier: "Siti Rahmawati",
    itemsSummary: "2x Paket Kopi 1 Liter, 3x Americano Dingin",
    itemCount: 5,
    method: "QRIS",
    orderType: "Online",
    status: "Selesai",
    total: 238000,
    createdAt: "08:30",
    date: "27 Nov 2026",
  },
  {
    id: "trx-10",
    receiptNo: "INV-261127-0010",
    branchId: "cab-tebet",
    branchName: "Cabang Tebet",
    cashier: "Budi Santoso",
    itemsSummary: "3x Matcha Latte, 3x Croissant",
    itemCount: 6,
    method: "QRIS",
    orderType: "Online",
    status: "Selesai",
    total: 153000,
    createdAt: "08:18",
    date: "27 Nov 2026",
  },
  {
    id: "trx-11",
    receiptNo: "INV-261127-0009",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    cashier: "Siti Rahmawati",
    itemsSummary: "5x Americano Dingin",
    itemCount: 5,
    method: "Tunai",
    orderType: "Reguler",
    status: "Selesai",
    total: 90000,
    createdAt: "08:05",
    date: "27 Nov 2026",
  },
  {
    id: "trx-12",
    receiptNo: "INV-261127-0008",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    cashier: "Siti Rahmawati",
    itemsSummary: "3x Kopi Susu Gula Aren, 1x Roti Bakar",
    itemCount: 4,
    method: "Tunai",
    orderType: "Reguler",
    status: "Selesai",
    total: 88000,
    createdAt: "07:50",
    date: "27 Nov 2026",
  },
  {
    id: "trx-13",
    receiptNo: "INV-261127-0007",
    branchId: "cab-tebet",
    branchName: "Cabang Tebet",
    cashier: "Budi Santoso",
    itemsSummary: "4x Paket Kopi 1 Liter",
    itemCount: 4,
    method: "QRIS",
    orderType: "Online",
    status: "Selesai",
    total: 368000,
    createdAt: "07:40",
    date: "27 Nov 2026",
  },
  {
    id: "trx-14",
    receiptNo: "INV-261127-0006",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    cashier: "Siti Rahmawati",
    itemsSummary: "2x Matcha Latte, 2x Croissant",
    itemCount: 4,
    method: "QRIS",
    orderType: "Reguler",
    status: "Selesai",
    total: 102000,
    createdAt: "07:25",
    date: "27 Nov 2026",
  },
  {
    id: "trx-15",
    receiptNo: "INV-261126-0091",
    branchId: "cab-tebet",
    branchName: "Cabang Tebet",
    cashier: "Budi Santoso",
    itemsSummary: "6x Kopi Susu Gula Aren",
    itemCount: 6,
    method: "Tunai",
    orderType: "Reguler",
    status: "Selesai",
    total: 132000,
    createdAt: "18:45",
    date: "26 Nov 2026",
  },
  {
    id: "trx-16",
    receiptNo: "INV-261126-0090",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    cashier: "Siti Rahmawati",
    itemsSummary: "7x Americano Dingin, 2x Croissant",
    itemCount: 9,
    method: "QRIS",
    orderType: "Online",
    status: "Selesai",
    total: 176000,
    createdAt: "17:10",
    date: "26 Nov 2026",
  },
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: "exp-1",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    category: "Bahan baku",
    note: "Susu UHT 12 liter dan es batu 2 bal",
    source: "Tunai (Laci)",
    amount: 215000,
    date: "27 Nov 2026",
  },
  {
    id: "exp-2",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    category: "Kemasan",
    note: "Gelas plastik 16oz dan sedotan",
    source: "Non-tunai",
    amount: 140000,
    date: "27 Nov 2026",
  },
  {
    id: "exp-3",
    branchId: "cab-tebet",
    branchName: "Cabang Tebet",
    category: "Logistik",
    note: "Ongkos kirim biji kopi dari roastery",
    source: "Tunai (Laci)",
    amount: 45000,
    date: "27 Nov 2026",
  },
  {
    id: "exp-4",
    branchId: "cab-tebet",
    branchName: "Cabang Tebet",
    category: "Operasional",
    note: "Token listrik prabayar cabang",
    source: "Non-tunai",
    amount: 200000,
    date: "26 Nov 2026",
  },
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prd-1",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    name: "Kopi Susu Gula Aren",
    category: "Minuman",
    price: 22000,
    stock: 48,
    minStock: 10,
    active: true,
  },
  {
    id: "prd-2",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    name: "Americano Dingin",
    category: "Minuman",
    price: 18000,
    stock: 6,
    minStock: 10,
    active: true,
  },
  {
    id: "prd-3",
    branchId: "cab-kemang",
    branchName: "Cabang Kemang",
    name: "Croissant Mentega",
    category: "Makanan",
    price: 25000,
    stock: 15,
    minStock: 5,
    active: true,
  },
  {
    id: "prd-4",
    branchId: "cab-tebet",
    branchName: "Cabang Tebet",
    name: "Matcha Latte",
    category: "Minuman",
    price: 26000,
    stock: 22,
    minStock: 8,
    active: true,
  },
  {
    id: "prd-5",
    branchId: "cab-tebet",
    branchName: "Cabang Tebet",
    name: "Paket Kopi 1 Liter",
    category: "Minuman",
    price: 92000,
    stock: 0,
    minStock: 4,
    active: true,
  },
];

export const INITIAL_ADMINS: AdminAccount[] = [
  {
    id: "adm-1",
    name: "Farel Ramadhan",
    email: "farel@posumkm.id",
    role: "superadmin",
    branchId: "all",
    branchLabel: "Seluruh Platform",
    status: "Aktif",
    lastLogin: "27 Nov 2026, 11:05",
  },
  {
    id: "adm-2",
    name: "Yuta Pratama",
    email: "yuta@kopilaris.id",
    role: "owner",
    branchId: "all",
    branchLabel: "Kopi Laris (Semua Cabang)",
    status: "Aktif",
    lastLogin: "27 Nov 2026, 10:12",
  },
  {
    id: "adm-3",
    name: "Siti Rahmawati",
    email: "siti.kemang@kopilaris.id",
    role: "branch_admin",
    branchId: "cab-kemang",
    branchLabel: "Cabang Kemang",
    status: "Aktif",
    lastLogin: "27 Nov 2026, 08:30",
  },
  {
    id: "adm-4",
    name: "Budi Santoso",
    email: "budi.tebet@kopilaris.id",
    role: "branch_admin",
    branchId: "cab-tebet",
    branchLabel: "Cabang Tebet",
    status: "Aktif",
    lastLogin: "27 Nov 2026, 08:45",
  },
];

export const INITIAL_LOGS: AuditLogItem[] = [
  {
    id: "log-1",
    timestamp: "27 Nov 2026, 10:42",
    actor: "Siti Rahmawati",
    roleLabel: "Admin Cabang",
    action: "Transaksi Selesai",
    target: "INV-261127-0018",
    detail: "Pembayaran QRIS pesanan Online sebesar Rp432.000",
  },
  {
    id: "log-2",
    timestamp: "27 Nov 2026, 09:15",
    actor: "Farel Ramadhan",
    roleLabel: "Superadmin",
    action: "Aktivasi Lisensi",
    target: "Cabang Tebet",
    detail: "Memperpanjang masa aktif lisensi POS-TBT-2026-4409",
  },
  {
    id: "log-3",
    timestamp: "27 Nov 2026, 09:05",
    actor: "Budi Santoso",
    roleLabel: "Admin Cabang",
    action: "Batalkan Transaksi",
    target: "INV-261127-0014",
    detail: "Transaksi Rp42.000 dibatalkan dan stok dikembalikan",
  },
  {
    id: "log-4",
    timestamp: "27 Nov 2026, 08:20",
    actor: "Yuta Pratama",
    roleLabel: "Admin Pusat",
    action: "Catat Pengeluaran",
    target: "Cabang Kemang",
    detail: "Bahan baku Rp215.000 dari Tunai (Laci)",
  },
];

export const SALES_CATEGORIES = [
  "Semua",
  "Minuman",
  "Makanan",
  "Kemasan",
  "Bahan Baku",
  "Lainnya",
] as const;

export type SalesCategory = (typeof SALES_CATEGORIES)[number];
export type SalesRange = "Mingguan" | "Bulanan" | "Tahunan";
export const YEAR_OPTIONS = ["2026", "2025", "2024"] as const;
export const YEAR_RANGE_OPTIONS = ["2024 - 2026", "2022 - 2026"] as const;

export type LinePoint = {
  label: string;
  monthLabel: string;
  value: number;
};

const WEEKLY_BASE: LinePoint[] = [
  { label: "Sen", monthLabel: "Sen", value: 1850 },
  { label: "Sel", monthLabel: "Sel", value: 2300 },
  { label: "Rab", monthLabel: "Rab", value: 2750 },
  { label: "Kam", monthLabel: "Kam", value: 3200 },
  { label: "Jum", monthLabel: "Jum", value: 3950 },
  { label: "Sab", monthLabel: "Sab", value: 4650 },
  { label: "Min", monthLabel: "Min", value: 4200 },
];

const MONTHLY_BASE: LinePoint[] = [
  { label: "Jan", monthLabel: "Jan", value: 14200 },
  { label: "Feb", monthLabel: "Feb", value: 18500 },
  { label: "Mar", monthLabel: "Mar", value: 16800 },
  { label: "Apr", monthLabel: "Apr", value: 24500 },
  { label: "Mei", monthLabel: "Mei", value: 29100 },
  { label: "Jun", monthLabel: "Jun", value: 26400 },
  { label: "Jul", monthLabel: "Jul", value: 34800 },
  { label: "Agu", monthLabel: "Agu", value: 38200 },
  { label: "Sep", monthLabel: "Sep", value: 35600 },
  { label: "Okt", monthLabel: "Okt", value: 42100 },
  { label: "Nov", monthLabel: "Nov", value: 46500 },
  { label: "Des", monthLabel: "Des", value: 49200 },
];

const YEARLY_DATA: Record<string, LinePoint[]> = {
  "2024 - 2026": [
    { label: "2024", monthLabel: "2024", value: 215000 },
    { label: "2025", monthLabel: "2025", value: 298000 },
    { label: "2026", monthLabel: "2026", value: 376500 },
  ],
  "2022 - 2026": [
    { label: "2022", monthLabel: "2022", value: 128000 },
    { label: "2023", monthLabel: "2023", value: 169000 },
    { label: "2024", monthLabel: "2024", value: 215000 },
    { label: "2025", monthLabel: "2025", value: 298000 },
    { label: "2026", monthLabel: "2026", value: 376500 },
  ],
};

const YEAR_FACTOR: Record<string, number> = {
  "2026": 1,
  "2025": 0.82,
  "2024": 0.65,
};

const CATEGORY_FACTOR: Record<SalesCategory, number> = {
  Semua: 1,
  Minuman: 0.68,
  Makanan: 0.42,
  Kemasan: 0.25,
  "Bahan Baku": 0.34,
  Lainnya: 0.18,
};

export function getLineSeries({
  range,
  category,
  year,
  yearRange,
  branchFactor = 1,
}: {
  range: SalesRange;
  category: SalesCategory;
  year: string;
  yearRange: string;
  branchFactor?: number;
}): LinePoint[] {
  const catFactor = CATEGORY_FACTOR[category] * branchFactor;
  if (range === "Tahunan") {
    const base = YEARLY_DATA[yearRange] ?? YEARLY_DATA["2024 - 2026"];
    return base.map((pt) => ({
      ...pt,
      value: Math.round(pt.value * catFactor),
    }));
  }

  const yf = YEAR_FACTOR[year] ?? 1;
  const source = range === "Mingguan" ? WEEKLY_BASE : MONTHLY_BASE;
  return source.map((pt) => ({
    ...pt,
    label: range === "Bulanan" ? `${pt.label} ${year}` : `${pt.label} (${year})`,
    value: Math.round(pt.value * catFactor * yf),
  }));
}

export const BREAKDOWN_SERIES = {
  income: [0.6, 0.62, 0.46, 0.9, 0.62, 0.4, 0.55, 0.45, 0.97, 0.52, 0.5, 0.8, 0.42, 0.66, 0.38, 0.6],
  expense: [0.28, 0.35, 0.22, 0.45, 0.3, 0.18, 0.27, 0.22, 0.48, 0.25, 0.26, 0.38, 0.2, 0.31, 0.19, 0.29],
};
