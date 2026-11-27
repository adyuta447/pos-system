import {
  Activity,
  Banknote,
  Building2,
  ChartColumn,
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type UserRole = "superadmin" | "owner" | "branch_admin";

export type PageId =
  | "overview"
  | "transactions"
  | "expenses"
  | "reports"
  | "products"
  | "branches"
  | "admins"
  | "logs"
  | "settings";

export type NavItem = {
  id: PageId;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const NAV: NavGroup[] = [
  {
    title: "Menu Utama",
    items: [
      {
        id: "overview",
        label: "Ringkasan",
        icon: LayoutDashboard,
        roles: ["superadmin", "owner", "branch_admin"],
      },
      {
        id: "transactions",
        label: "Transaksi",
        icon: Banknote,
        roles: ["superadmin", "owner", "branch_admin"],
      },
      {
        id: "expenses",
        label: "Pengeluaran",
        icon: Wallet,
        roles: ["superadmin", "owner", "branch_admin"],
      },
      {
        id: "reports",
        label: "Laporan Keuangan",
        icon: ChartColumn,
        roles: ["superadmin", "owner", "branch_admin"],
      },
      {
        id: "products",
        label: "Produk & Stok",
        icon: Package,
        roles: ["superadmin", "owner", "branch_admin"],
      },
    ],
  },
  {
    title: "Manajemen Sistem",
    items: [
      {
        id: "branches",
        label: "Cabang & Lisensi",
        icon: Building2,
        roles: ["superadmin", "owner"],
      },
      {
        id: "admins",
        label: "Manajemen Admin",
        icon: ShieldCheck,
        roles: ["superadmin", "owner"],
      },
      {
        id: "logs",
        label: "Log Aktivitas",
        icon: Activity,
        roles: ["superadmin"],
      },
      {
        id: "settings",
        label: "Pengaturan",
        icon: Settings,
        roles: ["superadmin", "owner", "branch_admin"],
      },
    ],
  },
];

export const PAGE_TITLES: Record<PageId, string> = {
  overview: "Ringkasan Penjualan",
  transactions: "Riwayat Transaksi",
  expenses: "Pengeluaran Variabel",
  reports: "Laporan Pemasukan dan Pengeluaran",
  products: "Produk dan Stok",
  branches: "Manajemen Cabang dan Lisensi",
  admins: "Manajemen Akun Admin",
  logs: "Log Aktivitas Sistem",
  settings: "Pengaturan Sistem",
};

export const ROLE_META: Record<
  UserRole,
  { name: string; title: string; initials: string; branchId?: string }
> = {
  superadmin: {
    name: "Farel Ramadhan",
    title: "Superadmin Platform",
    initials: "FR",
  },
  owner: {
    name: "Yuta Pratama",
    title: "Admin Pusat (Owner)",
    initials: "YP",
  },
  branch_admin: {
    name: "Siti Rahmawati",
    title: "Admin Cabang Kemang",
    initials: "SR",
    branchId: "cab-kemang",
  },
};
