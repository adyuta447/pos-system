"use client";

import { useMemo, useState } from "react";
import { Minus, Pencil, Plus, Trash2, X } from "lucide-react";
import type { UserRole } from "../../config/nav";
import {
  formatRupiah,
  umkmOfBranch,
  type AdminAccount,
  type AuditLogItem,
  type BranchItem,
  type ExpenseItem,
  type ExpenseSource,
  type PosTxn,
  type ProductItem,
} from "../../data/mock";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { Panel } from "../ui/Panel";
import { SearchInput } from "../ui/SearchInput";
import { Select } from "../ui/Select";
import { StatusBadge } from "../ui/StatusBadge";
import { KpiCard } from "./KpiCard";

const EXPENSE_PRESETS = ["Bahan baku", "Logistik", "Operasional", "Kemasan", "Lainnya"];

export function ExpensesView({
  expenses,
  branches,
  role,
  onAddExpense,
  onDeleteExpense,
}: {
  expenses: ExpenseItem[];
  branches: BranchItem[];
  role: UserRole;
  onAddExpense: (item: Omit<ExpenseItem, "id" | "date">) => void;
  onDeleteExpense: (id: string) => void;
}) {
  const [category, setCategory] = useState("Bahan baku");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<ExpenseSource>("Tunai (Laci)");
  const [note, setNote] = useState("");
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "cab-kemang");

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCash = expenses
    .filter((e) => e.source === "Tunai (Laci)")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalNonCash = total - totalCash;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numeric = Number(amount);
    if (!category.trim() || !Number.isFinite(numeric) || numeric <= 0) return;
    const branch = branches.find((b) => b.id === branchId) ?? branches[0];
    onAddExpense({
      branchId: branch.id,
      branchName: branch.name,
      category: category.trim(),
      amount: Math.round(numeric),
      source,
      note: note.trim() || "Pengeluaran operasional",
    });
    setAmount("");
    setNote("");
  }

  return (
    <div className="grid gap-4">
      <section className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <KpiCard
          label="TOTAL PENGELUARAN"
          value={formatRupiah(total)}
          delta={`${expenses.length} catatan`}
          bars={[0.4, 0.65, 0.5, 0.85, 0.6, 0.7, 0.9, 0.55]}
          hi={[6]}
        />
        <KpiCard
          label="PENGELUARAN TUNAI (LACI)"
          value={formatRupiah(totalCash)}
          delta="Mengurangi kas laci"
          bars={[0.5, 0.4, 0.75, 0.6, 0.8, 0.5, 0.65, 0.7]}
          hi={[4]}
        />
        <KpiCard
          label="PENGELUARAN NON-TUNAI"
          value={formatRupiah(totalNonCash)}
          delta="Transfer / rekening"
          bars={[0.3, 0.5, 0.45, 0.7, 0.55, 0.85, 0.6, 0.4]}
          hi={[5]}
        />
      </section>

      <div className="grid gap-3.5 xl:grid-cols-[1fr_2fr]">
        <Panel title="CATAT PENGELUARAN BARU">
          <form onSubmit={handleSubmit} className="space-y-3.5 p-4">
            {role !== "branch_admin" && (
              <div>
                <label className="mb-1 block text-[12px] font-medium text-ink-2">
                  UMKM / Cabang
                </label>
                <Select
                  ariaLabel="Pilih UMKM dan cabang pengeluaran"
                  value={branchId}
                  options={branches.map((b) => ({
                    value: b.id,
                    label: b.umkmName,
                    hint: b.name,
                  }))}
                  onChange={setBranchId}
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-ink-2">
                Variabel / Kategori
              </label>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {EXPENSE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCategory(preset)}
                    className={`cursor-pointer rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                      category === preset
                        ? "bg-ink text-white"
                        : "border border-line bg-muted/60 text-ink-2 hover:bg-hover"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Nama kategori pengeluaran"
                required
                className="h-9 w-full rounded-ctrl border border-line bg-card px-3 text-[13px] text-ink outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="mb-1 block text-[12px] font-medium text-ink-2">
                Nominal (Rp)
              </label>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Contoh: 50000"
                required
                className="h-9 w-full rounded-ctrl border border-line bg-card px-3 font-mono text-[13px] text-ink outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="mb-1 block text-[12px] font-medium text-ink-2">Sumber Kas</label>
              <Select
                ariaLabel="Pilih sumber kas"
                value={source}
                options={[
                  { value: "Tunai (Laci)", label: "Tunai (Laci)" },
                  { value: "Non-tunai", label: "Non-tunai" },
                ]}
                onChange={(v) => setSource(v as ExpenseSource)}
              />
            </div>

            <div>
              <label className="mb-1 block text-[12px] font-medium text-ink-2">Catatan</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: Beli es batu 2 bal"
                className="h-9 w-full rounded-ctrl border border-line bg-card px-3 text-[13px] text-ink outline-none focus:border-ink"
              />
            </div>

            <Button type="submit" variant="dark" className="w-full">
              <Plus className="size-3.5" /> Simpan Pengeluaran
            </Button>
          </form>
        </Panel>

        <Panel title="DAFTAR PENGELUARAN VARIABEL" bodyClassName="overflow-hidden">
          <div className="no-scrollbar overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="label-mono h-9 border-b border-line-subtle bg-[#F8F7F5] !text-[11px] text-ink-3">
                  <th className="px-4 font-medium">UMKM / CABANG</th>
                  <th className="px-4 font-medium">KATEGORI</th>
                  <th className="px-4 font-medium">CATATAN</th>
                  <th className="px-4 font-medium">SUMBER KAS</th>
                  <th className="px-4 text-right font-medium">NOMINAL</th>
                  <th className="px-4 text-right font-medium">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="h-[46px] border-b border-line-subtle hover:bg-[#FAFAF8]"
                  >
                    <td className="px-4">
                      <p className="font-medium text-ink">{umkmOfBranch(exp.branchId)}</p>
                      <p className="text-[11.5px] text-ink-3">{exp.branchName}</p>
                    </td>
                    <td className="px-4 text-ink">{exp.category}</td>
                    <td className="px-4 text-ink-2">{exp.note}</td>
                    <td className="px-4">
                      <span className="rounded-full border border-line bg-muted/60 px-2.5 py-0.5 text-[11.5px] font-medium text-ink-2">
                        {exp.source}
                      </span>
                    </td>
                    <td className="px-4 text-right font-mono font-medium text-ink">
                      {formatRupiah(exp.amount)}
                    </td>
                    <td className="px-4 text-right">
                      <IconButton
                        onClick={() => onDeleteExpense(exp.id)}
                        aria-label={`Hapus ${exp.category}`}
                        className="ml-auto !size-7 !rounded-xs2 text-ink-3 hover:text-ink"
                      >
                        <Trash2 className="size-3.5" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function ReportsView({
  transactions,
  expenses,
  branches,
}: {
  transactions: PosTxn[];
  expenses: ExpenseItem[];
  branches: BranchItem[];
}) {
  // Transaksi berstatus Dibatalkan tidak dihitung dalam total pemasukan.
  const validTxns = transactions.filter((t) => t.status === "Selesai");
  const pemasukan = validTxns.reduce((s, t) => s + t.total, 0);
  const pengeluaran = expenses.reduce((s, e) => s + e.amount, 0);
  const selisihBersih = pemasukan - pengeluaran;
  const tunaiMasuk = validTxns
    .filter((t) => t.method === "Tunai")
    .reduce((s, t) => s + t.total, 0);
  const tunaiKeluar = expenses
    .filter((e) => e.source === "Tunai (Laci)")
    .reduce((s, e) => s + e.amount, 0);
  const qrisMasuk = validTxns
    .filter((t) => t.method === "QRIS")
    .reduce((s, t) => s + t.total, 0);

  return (
    <div className="grid gap-4">
      <section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="PEMASUKAN BERSIH"
          value={formatRupiah(pemasukan)}
          delta={`${validTxns.length} transaksi selesai`}
          bars={[0.45, 0.7, 0.55, 0.85, 0.6, 0.9, 0.75, 1]}
          hi={[7]}
        />
        <KpiCard
          label="PENGELUARAN"
          value={formatRupiah(pengeluaran)}
          delta={`${expenses.length} catatan biaya`}
          bars={[0.3, 0.45, 0.55, 0.4, 0.6, 0.5, 0.7, 0.45]}
          hi={[6]}
        />
        <KpiCard
          label="SELISIH BERSIH"
          value={formatRupiah(selisihBersih)}
          delta="Pemasukan - Pengeluaran"
          bars={[0.4, 0.6, 0.5, 0.8, 0.7, 0.85, 0.9, 0.95]}
          hi={[7]}
        />
        <KpiCard
          label="SISA TUNAI LACI"
          value={formatRupiah(tunaiMasuk - tunaiKeluar)}
          delta={`QRIS: ${formatRupiah(qrisMasuk)}`}
          bars={[0.5, 0.6, 0.45, 0.75, 0.65, 0.8, 0.7, 0.85]}
          hi={[5]}
        />
      </section>

      <Panel title="REKAP KEUANGAN PER CABANG" bodyClassName="overflow-hidden">
        <div className="no-scrollbar overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="label-mono h-9 border-b border-line-subtle bg-[#F8F7F5] !text-[11px] text-ink-3">
                <th className="px-4 font-medium">UMKM / CABANG</th>
                <th className="px-4 font-medium">ADMIN CABANG</th>
                <th className="px-4 text-right font-medium">PEMASUKAN</th>
                <th className="px-4 text-right font-medium">PENGELUARAN</th>
                <th className="px-4 text-right font-medium">SELISIH BERSIH</th>
                <th className="px-4 text-right font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => {
                const inc = validTxns
                  .filter((t) => t.branchId === b.id)
                  .reduce((s, t) => s + t.total, 0);
                const exp = expenses
                  .filter((e) => e.branchId === b.id)
                  .reduce((s, e) => s + e.amount, 0);
                return (
                  <tr
                    key={b.id}
                    className="h-[48px] border-b border-line-subtle hover:bg-[#FAFAF8]"
                  >
                    <td className="px-4">
                      <p className="font-medium text-ink">{b.umkmName}</p>
                      <p className="text-[11.5px] text-ink-3">
                        {b.name} · {b.city}
                      </p>
                    </td>
                    <td className="px-4 text-ink-2">{b.adminName}</td>
                    <td className="px-4 text-right font-mono text-ink">{formatRupiah(inc)}</td>
                    <td className="px-4 text-right font-mono text-ink-2">{formatRupiah(exp)}</td>
                    <td className="px-4 text-right font-mono font-semibold text-ink">
                      {formatRupiah(inc - exp)}
                    </td>
                    <td className="px-4 text-right">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

export function ProductsView({
  products,
  branches,
  role,
  onAdjustStock,
  onAddProduct,
}: {
  products: ProductItem[];
  branches: BranchItem[];
  role: UserRole;
  onAdjustStock: (id: string, delta: number) => void;
  onAddProduct: (item: Omit<ProductItem, "id" | "active">) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Minuman");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("20");
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "cab-kemang");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const numericPrice = Number(price);
    const numericStock = Number(stock);
    if (!name.trim() || !Number.isFinite(numericPrice) || numericPrice <= 0) return;
    const branch = branches.find((b) => b.id === branchId) ?? branches[0];
    onAddProduct({
      branchId: branch.id,
      branchName: branch.name,
      name: name.trim(),
      category,
      price: Math.round(numericPrice),
      stock: Math.max(0, Math.round(numericStock || 0)),
      minStock: 8,
    });
    setName("");
    setPrice("");
    setStock("20");
    setModalOpen(false);
  }

  return (
    <>
      <Panel
        title="DAFTAR PRODUK DAN STOK"
        actions={
          <Button size="sm" variant="dark" onClick={() => setModalOpen(true)}>
            <Plus className="size-3.5" /> Tambah Produk
          </Button>
        }
        bodyClassName="overflow-hidden"
      >
        <div className="no-scrollbar overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="label-mono h-9 border-b border-line-subtle bg-[#F8F7F5] !text-[11px] text-ink-3">
                <th className="px-4 font-medium">PRODUK</th>
                <th className="px-4 font-medium">KATEGORI</th>
                <th className="px-4 font-medium">UMKM / CABANG</th>
                <th className="px-4 text-right font-medium">HARGA</th>
                <th className="px-4 text-center font-medium">STOK</th>
                <th className="px-4 text-right font-medium">KONDISI</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const isOut = p.stock <= 0;
                const isLow = !isOut && p.stock <= p.minStock;
                return (
                  <tr
                    key={p.id}
                    className="h-[48px] border-b border-line-subtle hover:bg-[#FAFAF8]"
                  >
                    <td className="px-4 font-medium text-ink">{p.name}</td>
                    <td className="px-4 text-ink-2">{p.category}</td>
                    <td className="px-4">
                      <p className="font-medium text-ink">{umkmOfBranch(p.branchId)}</p>
                      <p className="text-[11.5px] text-ink-3">{p.branchName}</p>
                    </td>
                    <td className="px-4 text-right font-mono text-ink">{formatRupiah(p.price)}</td>
                    <td className="px-4">
                      <div className="flex items-center justify-center gap-2">
                        <IconButton
                          className="!size-6 !rounded-xs2"
                          aria-label={`Kurangi stok ${p.name}`}
                          onClick={() => onAdjustStock(p.id, -1)}
                        >
                          <Minus className="size-3" />
                        </IconButton>
                        <span className="w-8 text-center font-mono font-medium text-ink">
                          {p.stock}
                        </span>
                        <IconButton
                          className="!size-6 !rounded-xs2"
                          aria-label={`Tambah stok ${p.name}`}
                          onClick={() => onAdjustStock(p.id, 1)}
                        >
                          <Plus className="size-3" />
                        </IconButton>
                      </div>
                    </td>
                    <td className="px-4 text-right">
                      <StatusBadge
                        status={isOut ? "Dibatalkan" : isLow ? "Tertunda" : "Selesai"}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {modalOpen && (
        <div
          className="animate-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-ink/25 p-4 backdrop-blur-[2px]"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="animate-modal-in w-full max-w-[420px] rounded-ctrl border border-line bg-card p-5 shadow-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line-subtle pb-3">
              <h2 className="text-[15px] font-semibold text-ink">Tambah Produk Baru</h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid size-7 cursor-pointer place-items-center rounded-sm2 text-ink-3 hover:bg-hover"
              >
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="mt-4 space-y-3">
              {role !== "branch_admin" && (
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-ink-2">Cabang</label>
                  <Select
                    value={branchId}
                    options={branches.map((b) => ({ value: b.id, label: b.name }))}
                    onChange={setBranchId}
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-ink-2">Nama Produk</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Contoh: Es Kopi Susu"
                  className="h-9 w-full rounded-ctrl border border-line bg-card px-3 text-[13px] outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-ink-2">Kategori</label>
                <Select
                  value={category}
                  options={[
                    { value: "Minuman", label: "Minuman" },
                    { value: "Makanan", label: "Makanan" },
                    { value: "Kemasan", label: "Kemasan" },
                    { value: "Lainnya", label: "Lainnya" },
                  ]}
                  onChange={setCategory}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-ink-2">Harga (Rp)</label>
                  <input
                    type="number"
                    min={100}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="20000"
                    className="h-9 w-full rounded-ctrl border border-line bg-card px-3 font-mono text-[13px] outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-ink-2">Stok Awal</label>
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    className="h-9 w-full rounded-ctrl border border-line bg-card px-3 font-mono text-[13px] outline-none focus:border-ink"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setModalOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="dark" className="flex-1">
                  Simpan Produk
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function BranchesView({
  branches,
  role,
  onToggleLicense,
}: {
  branches: BranchItem[];
  role: UserRole;
  onToggleLicense: (branchId: string) => void;
}) {
  return (
    <Panel title="MANAJEMEN CABANG DAN LISENSI LANGGANAN" bodyClassName="overflow-hidden">
      <div className="no-scrollbar overflow-x-auto">
        <table className="w-full min-w-[840px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="label-mono h-9 border-b border-line-subtle bg-[#F8F7F5] !text-[11px] text-ink-3">
              <th className="px-4 font-medium">UMKM / CABANG</th>
              <th className="px-4 font-medium">ADMIN</th>
              <th className="px-4 font-medium">KUNCI LISENSI</th>
              <th className="px-4 font-medium">MASA AKTIF</th>
              <th className="px-4 font-medium">STATUS</th>
              {role === "superadmin" && <th className="px-4 text-right font-medium">AKSI</th>}
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr
                key={b.id}
                className="h-[48px] border-b border-line-subtle hover:bg-[#FAFAF8]"
              >
                <td className="px-4">
                  <p className="font-medium text-ink">{b.umkmName}</p>
                  <p className="text-[11.5px] text-ink-3">
                    {b.name} · {b.city}
                  </p>
                </td>
                <td className="px-4 text-ink-2">{b.adminName}</td>
                <td className="px-4 font-mono text-[12px] text-ink-2">{b.licenseKey}</td>
                <td className="px-4 text-ink-2">{b.validUntil}</td>
                <td className="px-4">
                  <StatusBadge status={b.status} />
                </td>
                {role === "superadmin" && (
                  <td className="px-4 text-right">
                    <Button
                      size="sm"
                      variant={b.status === "Aktif" ? "outline" : "dark"}
                      onClick={() => onToggleLicense(b.id)}
                    >
                      {b.status === "Aktif" ? "Nonaktifkan" : "Aktifkan Lisensi"}
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function AdminsView({
  admins,
  branches,
  currentRole,
  onSaveAdmin,
  onToggleStatus,
  onDeleteAdmin,
}: {
  admins: AdminAccount[];
  branches: BranchItem[];
  currentRole: UserRole;
  onSaveAdmin: (payload: {
    id?: string;
    name: string;
    email: string;
    role: UserRole;
    branchId: string;
  }) => void;
  onToggleStatus: (id: string) => void;
  onDeleteAdmin: (id: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminAccount | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("branch_admin");
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "cab-kemang");

  const visibleAdmins = useMemo(
    () =>
      currentRole === "superadmin"
        ? admins
        : admins.filter((a) => a.role === "branch_admin"),
    [admins, currentRole],
  );

  function openCreate() {
    setEditing(null);
    setName("");
    setEmail("");
    setRole("branch_admin");
    setBranchId(branches[0]?.id ?? "cab-kemang");
    setModalOpen(true);
  }

  function openEdit(a: AdminAccount) {
    setEditing(a);
    setName(a.name);
    setEmail(a.email);
    setRole(a.role);
    setBranchId(a.branchId === "all" ? (branches[0]?.id ?? "cab-kemang") : a.branchId);
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSaveAdmin({
      id: editing?.id,
      name: name.trim(),
      email: email.trim(),
      role,
      branchId: role === "branch_admin" ? branchId : "all",
    });
    setModalOpen(false);
  }

  const roleLabel = (r: UserRole) =>
    r === "superadmin" ? "Superadmin" : r === "owner" ? "Admin Pusat (Owner)" : "Admin Cabang";

  return (
    <>
      <Panel
        title="MANAJEMEN AKUN ADMIN DAN HAK AKSES"
        actions={
          <Button size="sm" variant="dark" onClick={openCreate}>
            <Plus className="size-3.5" /> Tambah Admin
          </Button>
        }
        bodyClassName="overflow-hidden"
      >
        <div className="no-scrollbar overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="label-mono h-9 border-b border-line-subtle bg-[#F8F7F5] !text-[11px] text-ink-3">
                <th className="px-4 font-medium">NAMA ADMIN</th>
                <th className="px-4 font-medium">PERAN</th>
                <th className="px-4 font-medium">CAKUPAN CABANG</th>
                <th className="px-4 font-medium">LOGIN TERAKHIR</th>
                <th className="px-4 font-medium">STATUS</th>
                <th className="px-4 text-right font-medium">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {visibleAdmins.map((a) => (
                <tr
                  key={a.id}
                  className="h-[48px] border-b border-line-subtle hover:bg-[#FAFAF8]"
                >
                  <td className="px-4">
                    <p className="font-medium text-ink">{a.name}</p>
                    <p className="font-mono text-[11.5px] text-ink-3">{a.email}</p>
                  </td>
                  <td className="px-4 text-ink">{roleLabel(a.role)}</td>
                  <td className="px-4 text-ink-2">{a.branchLabel}</td>
                  <td className="px-4 font-mono text-[12px] text-ink-3">{a.lastLogin}</td>
                  <td className="px-4">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(a.id)}
                      className="cursor-pointer"
                      title="Klik untuk ubah status aktif"
                    >
                      <StatusBadge status={a.status} />
                    </button>
                  </td>
                  <td className="px-4">
                    <div className="flex justify-end gap-1.5">
                      <IconButton
                        className="!size-7 !rounded-xs2"
                        aria-label={`Ubah ${a.name}`}
                        onClick={() => openEdit(a)}
                      >
                        <Pencil className="size-3.5" />
                      </IconButton>
                      <IconButton
                        className="!size-7 !rounded-xs2"
                        aria-label={`Hapus ${a.name}`}
                        onClick={() => onDeleteAdmin(a.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {modalOpen && (
        <div
          className="animate-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-ink/25 p-4 backdrop-blur-[2px]"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="animate-modal-in w-full max-w-[420px] rounded-ctrl border border-line bg-card p-5 shadow-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line-subtle pb-3">
              <h2 className="text-[15px] font-semibold text-ink">
                {editing ? "Ubah Akun Admin" : "Tambah Akun Admin"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid size-7 cursor-pointer place-items-center rounded-sm2 text-ink-3 hover:bg-hover"
              >
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-ink-2">Nama Lengkap</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Contoh: Rina Novita"
                  className="h-9 w-full rounded-ctrl border border-line bg-card px-3 text-[13px] outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-ink-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="rina@kopilaris.id"
                  className="h-9 w-full rounded-ctrl border border-line bg-card px-3 text-[13px] outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-ink-2">Peran</label>
                <Select
                  value={role}
                  options={
                    currentRole === "superadmin"
                      ? [
                          { value: "branch_admin", label: "Admin Cabang" },
                          { value: "owner", label: "Admin Pusat (Owner)" },
                          { value: "superadmin", label: "Superadmin Platform" },
                        ]
                      : [{ value: "branch_admin", label: "Admin Cabang" }]
                  }
                  onChange={(v) => setRole(v as UserRole)}
                />
              </div>
              {role === "branch_admin" && (
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-ink-2">Cabang</label>
                  <Select
                    value={branchId}
                    options={branches.map((b) => ({ value: b.id, label: b.name }))}
                    onChange={setBranchId}
                  />
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setModalOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="dark" className="flex-1">
                  Simpan Akun
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function LogsView({ logs }: { logs: AuditLogItem[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(
      (l) =>
        l.actor.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.target.toLowerCase().includes(q) ||
        l.detail.toLowerCase().includes(q),
    );
  }, [logs, query]);

  return (
    <Panel
      title="LOG AKTIVITAS SISTEM"
      infoText="Rekaman seluruh perubahan data sensitif (aktivasi lisensi, manajemen admin, void transaksi, dan pengeluaran)."
      actions={
        <SearchInput
          variant="white"
          placeholder="Cari log aktivitas..."
          value={query}
          onChange={setQuery}
          className="w-[240px]"
        />
      }
      bodyClassName="overflow-hidden"
    >
      <div className="no-scrollbar overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="label-mono h-9 border-b border-line-subtle bg-[#F8F7F5] !text-[11px] text-ink-3">
              <th className="px-4 font-medium">WAKTU</th>
              <th className="px-4 font-medium">PENGGUNA</th>
              <th className="px-4 font-medium">AKSI</th>
              <th className="px-4 font-medium">TARGET</th>
              <th className="px-4 font-medium">KETERANGAN</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr
                key={l.id}
                className="h-[44px] border-b border-line-subtle hover:bg-[#FAFAF8]"
              >
                <td className="px-4 font-mono text-[12px] text-ink-3">{l.timestamp}</td>
                <td className="px-4">
                  <span className="font-medium text-ink">{l.actor}</span>
                  <span className="ml-1.5 text-[11.5px] text-ink-3">({l.roleLabel})</span>
                </td>
                <td className="px-4 font-medium text-ink">{l.action}</td>
                <td className="px-4 font-mono text-[12px] text-ink-2">{l.target}</td>
                <td className="px-4 text-ink-2">{l.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function SettingsView({ role }: { role: UserRole }) {
  return (
    <div className="grid gap-3.5 md:grid-cols-2">
      <Panel title="INFORMASI AKUN DAN HAK AKSES">
        <div className="space-y-3 p-4 text-[13px]">
          <div className="flex justify-between border-b border-line-subtle pb-2">
            <span className="text-ink-3">Peran Aktif</span>
            <span className="font-medium text-ink">
              {role === "superadmin"
                ? "Superadmin Platform"
                : role === "owner"
                  ? "Admin Pusat (Owner)"
                  : "Admin Cabang"}
            </span>
          </div>
          <div className="flex justify-between border-b border-line-subtle pb-2">
            <span className="text-ink-3">Cakupan Data</span>
            <span className="font-medium text-ink">
              {role === "superadmin"
                ? "Seluruh UMKM, Lisensi, Admin, dan Log"
                : role === "owner"
                  ? "Seluruh Cabang UMKM Milik Sendiri"
                  : "Khusus Cabang Kemang"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-3">Biaya Langganan</span>
            <span className="font-mono font-medium text-ink">Rp30.000 / bulan / cabang</span>
          </div>
        </div>
      </Panel>

      <Panel title="INTEGRASI PERANGKAT KASIR">
        <div className="space-y-3 p-4 text-[13px]">
          <div className="flex justify-between border-b border-line-subtle pb-2">
            <span className="text-ink-3">Aplikasi Kasir Tablet</span>
            <span className="font-medium text-ink">Flutter (SQLite Drift)</span>
          </div>
          <div className="flex justify-between border-b border-line-subtle pb-2">
            <span className="text-ink-3">Metode Pembayaran</span>
            <span className="font-medium text-ink">Tunai, QRIS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-3">Format Pajak Default</span>
            <span className="font-mono font-medium text-ink">PPN 11%</span>
          </div>
        </div>
      </Panel>
    </div>
  );
}
