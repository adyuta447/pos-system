/** Isi tabel yang sedang tampil (sudah terfilter), tanpa kolom AKSI dan baris kosong. */
export function readTable(root: HTMLElement | null): string[][] {
  const table = root?.querySelector("table");
  if (!table) return [];
  const rows = [...table.rows].map((r) =>
    // innerText memisahkan baris di dalam sel (mis. UMKM + cabang) dengan newline.
    [...r.cells].map((c) => c.innerText.trim().replace(/\s*\n\s*/g, " · ")),
  );
  const skip = new Set(
    (rows[0] ?? []).flatMap((h, i) => (h === "" || h.toUpperCase() === "AKSI" ? [i] : [])),
  );
  return rows
    .filter((r) => r.length === rows[0].length)
    .map((r) => r.filter((_, i) => !skip.has(i)));
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** TSV: langsung rapi saat ditempel ke Excel / Google Sheets. */
export function toTsv(rows: string[][]): string {
  return rows.map((r) => r.join("\t")).join("\n");
}

export function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  // BOM agar Excel membaca "Rp" dan huruf Indonesia dengan benar.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
