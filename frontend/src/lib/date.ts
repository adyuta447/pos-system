export const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
] as const;

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
] as const;

export const WEEKDAYS_ID = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] as const;

export function parseDisplayDate(label: string): Date | null {
  const parts = label.trim().split(" ");
  if (parts.length !== 3) return null;
  const day = Number(parts[0]);
  const monthIdx = MONTHS_SHORT.findIndex((m) => m.toLowerCase() === parts[1].toLowerCase());
  const year = Number(parts[2]);
  if (!day || monthIdx < 0 || !year) return null;
  return new Date(year, monthIdx, day);
}

export function formatDisplayDate(d: Date): string {
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatRangeLabel(start: Date, end: Date): string {
  if (start.getTime() === end.getTime()) return formatDisplayDate(start);
  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${start.getDate()} - ${end.getDate()} ${MONTHS_SHORT[end.getMonth()]} ${end.getFullYear()}`;
  }
  return `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`;
}

export function parseDateFilter(value: string): { start: Date; end: Date } | null {
  if (!value || value === "Semua Tanggal") return null;
  if (!value.includes(" - ")) {
    const single = parseDisplayDate(value);
    return single ? { start: single, end: single } : null;
  }
  const [left, right] = value.split(" - ").map((s) => s.trim());
  const end = parseDisplayDate(right);
  if (!end) return null;
  const start =
    parseDisplayDate(left) ??
    new Date(end.getFullYear(), end.getMonth(), Number(left) || end.getDate());
  return { start, end };
}

export function isDateInFilter(dateLabel: string, filterValue: string): boolean {
  const range = parseDateFilter(filterValue);
  if (!range) return true;
  const target = parseDisplayDate(dateLabel);
  if (!target) return true;
  const t = target.getTime();
  return t >= range.start.getTime() && t <= range.end.getTime();
}

interface DayCell {
  day: number;
  date: Date;
  label: string;
}

/** Sel kalender satu bulan, minggu dimulai Senin; `null` = sel kosong sebelum tanggal 1. */
export function buildMonthGrid(year: number, month: number): (DayCell | null)[] {
  // Konversi Minggu (0) ke indeks akhir pekan (6) agar minggu dimulai Senin.
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (DayCell | null)[] = Array.from({ length: startOffset }, () => null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({ day: d, date, label: formatDisplayDate(date) });
  }
  return cells;
}
