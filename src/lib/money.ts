/** 54000 -> "54.000". Written by hand so it does not depend on Hermes Intl data. */
export function formatNumber(value: number): string {
  const digits = Math.round(Math.abs(value)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return value < 0 ? `-${digits}` : digits;
}

/** 54000 -> "Rp54.000" */
export function formatRupiah(value: number): string {
  return `Rp${formatNumber(value)}`;
}
