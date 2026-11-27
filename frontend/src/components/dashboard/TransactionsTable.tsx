"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Ellipsis,
  Plus,
  X,
} from "lucide-react";
import { formatRupiah, umkmOfBranch, type PosTxn, type PosTxnStatus } from "../../data/mock";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { IconButton } from "../ui/IconButton";
import { Panel } from "../ui/Panel";
import { SearchInput } from "../ui/SearchInput";
import { StatusBadge } from "../ui/StatusBadge";

type SortKey = "receiptNo" | "branchName" | "itemsSummary" | "status" | "method" | "orderType" | "total";

const PREVIEW_LIMIT = 5;
const PAGE_SIZE = 8;

const GRID =
  "grid grid-cols-[36px_140px_1.1fr_1.4fr_120px_90px_90px_115px_64px] items-center px-3";
const COLS: { key: SortKey; label: string }[] = [
  { key: "receiptNo", label: "NO. STRUK" },
  { key: "branchName", label: "UMKM / CABANG" },
  { key: "itemsSummary", label: "ITEM" },
  { key: "status", label: "STATUS" },
  { key: "method", label: "METODE" },
  { key: "orderType", label: "PESANAN" },
  { key: "total", label: "TOTAL" },
];

export function TransactionsTable({
  transactions,
  title = "TRANSAKSI TERBARU",
  fadeBottom = true,
  onAddExpense,
  onUpdateStatus,
}: {
  transactions: PosTxn[];
  title?: string;
  fadeBottom?: boolean;
  onAddExpense?: () => void;
  onUpdateStatus?: (id: string, status: PosTxnStatus) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("receiptNo");
  const [sortAsc, setSortAsc] = useState(false);
  const [detailTxn, setDetailTxn] = useState<PosTxn | null>(null);
  const [expanded, setExpanded] = useState(!fadeBottom);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? transactions.filter(
          (t) =>
            t.receiptNo.toLowerCase().includes(q) ||
            t.branchName.toLowerCase().includes(q) ||
            t.itemsSummary.toLowerCase().includes(q) ||
            t.status.toLowerCase().includes(q) ||
            t.method.toLowerCase().includes(q),
        )
      : [...transactions];

    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortAsc ? av - bv : bv - av;
      }
      return sortAsc
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return list;
  }, [query, sortAsc, sortKey, transactions]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const showBlurredPreview = fadeBottom && !expanded && filtered.length > PREVIEW_LIMIT;

  const visibleRows = useMemo(() => {
    if (showBlurredPreview) return filtered.slice(0, PREVIEW_LIMIT);
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage, showBlurredPreview]);

  const startItem = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(safePage * PAGE_SIZE, filtered.length);
  const allSelected =
    visibleRows.length > 0 && visibleRows.every((t) => selectedIds.includes(t.id));

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : visibleRows.map((t) => t.id));
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  return (
    <>
      <Panel
        title={title}
        infoText="Klik header kolom untuk mengurutkan, atau tekan tombol aksi untuk melihat detail struk dan status."
        actions={
          <>
            <SearchInput
              variant="white"
              placeholder="Cari transaksi..."
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              className="w-[225px] max-sm:hidden"
            />
            {onAddExpense && (
              <Button size="sm" onClick={onAddExpense}>
                <Plus className="size-3.5" /> Catat Pengeluaran
              </Button>
            )}
          </>
        }
        bodyClassName="overflow-hidden"
      >
        <div className="no-scrollbar overflow-x-auto">
          <div className="min-w-[920px]">
            <div
              className={`${GRID} label-mono h-9 border-b border-line-subtle bg-[#F8F7F5] !text-[11px] text-ink-3`}
              role="row"
            >
              <Checkbox aria-label="Pilih semua" checked={allSelected} onChange={toggleAll} />
              {COLS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => toggleSort(c.key)}
                  className="flex cursor-pointer items-center gap-1 text-left hover:text-ink"
                >
                  {c.label}
                  <ChevronsUpDown
                    className={`size-3 ${sortKey === c.key ? "text-ink" : "text-ink-4"}`}
                  />
                </button>
              ))}
              <span className="text-right">AKSI</span>
            </div>

            <div
              className={
                showBlurredPreview
                  ? "[mask-image:linear-gradient(to_bottom,#000_62%,transparent_100%)]"
                  : undefined
              }
            >
              {visibleRows.length === 0 ? (
                <div className="px-4 py-8 text-center text-[13px] text-ink-3">
                  Tidak ada transaksi yang sesuai dengan pencarian.
                </div>
              ) : (
                visibleRows.map((t) => (
                  <div
                    key={t.id}
                    role="row"
                    onClick={() => setDetailTxn(t)}
                    className={`${GRID} h-[42px] cursor-pointer border-b border-line-subtle text-[13px] transition-colors hover:bg-[#FAFAF8]`}
                  >
                    <span onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        aria-label={`Pilih ${t.receiptNo}`}
                        checked={selectedIds.includes(t.id)}
                        onChange={() => toggleOne(t.id)}
                      />
                    </span>
                    <span className="font-mono text-[12.5px] text-ink-3">{t.receiptNo}</span>
                    <span className="min-w-0 pr-2 leading-tight">
                      <span className="block truncate font-medium text-ink">
                        {umkmOfBranch(t.branchId)}
                      </span>
                      <span className="block truncate text-[11px] text-ink-3">{t.branchName}</span>
                    </span>
                    <span className="truncate pr-2 text-ink-2">{t.itemsSummary}</span>
                    <span>
                      <StatusBadge status={t.status} />
                    </span>
                    <span className="text-ink">{t.method}</span>
                    <span className="text-ink-2">{t.orderType}</span>
                    <span className="font-mono font-medium text-ink">{formatRupiah(t.total)}</span>
                    <span
                      className="flex justify-end"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailTxn(t);
                      }}
                    >
                      <IconButton
                        className="!size-7 !rounded-xs2"
                        aria-label={`Detail ${t.receiptNo}`}
                      >
                        <Ellipsis className="size-3.5" />
                      </IconButton>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {showBlurredPreview && (
          <div className="flex justify-center border-t border-line-subtle bg-card px-4 py-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setExpanded(true);
                setPage(1);
              }}
            >
              <ChevronDown className="size-3.5" />
              Muat lebih banyak ({filtered.length} transaksi)
            </Button>
          </div>
        )}

        {(!fadeBottom || expanded) && filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-subtle px-4 py-2.5 text-[12px] text-ink-3">
            <div className="flex items-center gap-3">
              <span>
                Menampilkan{" "}
                <strong className="font-mono font-medium text-ink">
                  {startItem}-{endItem}
                </strong>{" "}
                dari <strong className="font-mono font-medium text-ink">{filtered.length}</strong>{" "}
                transaksi
              </span>
              {fadeBottom && (
                <button
                  type="button"
                  onClick={() => {
                    setExpanded(false);
                    setPage(1);
                  }}
                  className="cursor-pointer text-[12px] font-medium text-ink-2 underline-offset-2 hover:text-ink hover:underline"
                >
                  Ringkas
                </button>
              )}
            </div>

            <div className="flex items-center gap-1">
              <IconButton
                className="!size-7 !rounded-xs2"
                aria-label="Halaman sebelumnya"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-3.5" />
              </IconButton>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`grid size-7 cursor-pointer place-items-center rounded-xs2 font-mono text-[12px] transition-colors ${
                    n === safePage
                      ? "bg-ink font-semibold text-white"
                      : "border border-line bg-card text-ink-2 hover:bg-hover"
                  }`}
                >
                  {n}
                </button>
              ))}

              <IconButton
                className="!size-7 !rounded-xs2"
                aria-label="Halaman berikutnya"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="size-3.5" />
              </IconButton>
            </div>
          </div>
        )}
      </Panel>

      {detailTxn && (
        <div
          className="animate-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-ink/25 p-4 backdrop-blur-[2px]"
          onClick={() => setDetailTxn(null)}
        >
          <div
            className="animate-modal-in w-full max-w-[440px] rounded-ctrl border border-line bg-card p-5 shadow-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2 border-b border-line-subtle pb-3">
              <div>
                <p className="font-mono text-[13px] font-bold text-ink">{detailTxn.receiptNo}</p>
                <p className="text-[12px] text-ink-3">
                  {detailTxn.date} · {detailTxn.createdAt} · {detailTxn.branchName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailTxn(null)}
                aria-label="Tutup detail transaksi"
                className="grid size-7 cursor-pointer place-items-center rounded-sm2 text-ink-3 hover:bg-hover"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="my-4 space-y-2.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-ink-3">Kasir</span>
                <span className="font-medium text-ink">{detailTxn.cashier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-3">Jenis Pesanan</span>
                <span className="font-medium text-ink">{detailTxn.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-3">Metode Pembayaran</span>
                <span className="font-medium text-ink">{detailTxn.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-3">Status</span>
                <StatusBadge status={detailTxn.status} />
              </div>
              <div className="rounded-sm2 border border-line-subtle bg-muted/40 p-3">
                <p className="text-[11.5px] font-medium text-ink-3">Rincian Item</p>
                <p className="mt-1 text-ink">{detailTxn.itemsSummary}</p>
              </div>
              <div className="flex justify-between border-t border-line-subtle pt-2.5">
                <span className="font-medium text-ink">Total Tagihan</span>
                <span className="font-mono text-[15px] font-bold text-ink">
                  {formatRupiah(detailTxn.total)}
                </span>
              </div>
            </div>

            {onUpdateStatus && (
              <div className="flex flex-wrap gap-2 pt-1">
                {detailTxn.status !== "Selesai" && (
                  <Button
                    variant="dark"
                    className="flex-1"
                    onClick={() => {
                      onUpdateStatus(detailTxn.id, "Selesai");
                      setDetailTxn(null);
                    }}
                  >
                    Tandai Selesai
                  </Button>
                )}
                {detailTxn.status !== "Dibatalkan" && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      onUpdateStatus(detailTxn.id, "Dibatalkan");
                      setDetailTxn(null);
                    }}
                  >
                    Batalkan Transaksi
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
