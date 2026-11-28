import type { BranchItem } from "../data/mock";

/** Nilai filter: "all", id cabang, atau `umkm:<nama UMKM>` (filter superadmin per UMKM). */
export const UMKM_SCOPE = "umkm:";

/** Cabang yang masuk filter; null = semua cabang. */
export function branchIdsInScope(branches: BranchItem[], scope: string): Set<string> | null {
  if (scope === "all") return null;
  if (scope.startsWith(UMKM_SCOPE)) {
    const umkm = scope.slice(UMKM_SCOPE.length);
    return new Set(branches.filter((b) => b.umkmName === umkm).map((b) => b.id));
  }
  return new Set([scope]);
}

export function inScope(ids: Set<string> | null, branchId: string): boolean {
  return ids === null || ids.has(branchId);
}

/** Label filter untuk subjudul halaman, mis. "Warung Sambal Jaya" atau "Cabang Kemang". */
export function scopeLabel(branches: BranchItem[], scope: string): string {
  if (scope.startsWith(UMKM_SCOPE)) return scope.slice(UMKM_SCOPE.length);
  return branches.find((b) => b.id === scope)?.name ?? "";
}
