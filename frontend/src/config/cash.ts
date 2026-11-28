export type CashKind = "income" | "expense";

export const CASH_COPY = {
  expense: {
    noun: "Pengeluaran",
    presets: ["Bahan baku", "Logistik", "Operasional", "Kemasan", "Lainnya"],
    formTitle: "CATAT PENGELUARAN BARU",
    listTitle: "DAFTAR PENGELUARAN VARIABEL",
    cashDelta: "Mengurangi kas laci",
    nonCashDelta: "Transfer / rekening",
    categoryPlaceholder: "Nama kategori pengeluaran",
    notePlaceholder: "Contoh: Beli es batu 2 bal",
    defaultNote: "Pengeluaran operasional",
  },
  income: {
    noun: "Pemasukan",
    presets: ["Pesanan katering", "Penjualan offline", "Konsinyasi", "Modal tambahan", "Lainnya"],
    formTitle: "CATAT PEMASUKAN BARU",
    listTitle: "DAFTAR PEMASUKAN DI LUAR KASIR",
    cashDelta: "Menambah kas laci",
    nonCashDelta: "Transfer / QRIS / rekening",
    categoryPlaceholder: "Nama kategori pemasukan",
    notePlaceholder: "Contoh: Pesanan katering 30 box",
    defaultNote: "Pemasukan di luar kasir",
  },
} as const;

export const SOURCE_OPTIONS = [
  { value: "Tunai (Laci)", label: "Tunai (Laci)" },
  { value: "Non-tunai", label: "Non-tunai" },
];
