import type { UserRole } from "@/config/nav";
import type { BranchItem } from "@/data/mock";
import { UMKM_SCOPE } from "@/lib/scope";

interface UseWorkspaceSwitcherProps {
  role: UserRole;
  branches: BranchItem[];
  selectedBranchId: string;
}

export function useWorkspaceSwitcher({ role, branches, selectedBranchId }: UseWorkspaceSwitcherProps) {
  const activeBranch = branches.find((b) => b.id === selectedBranchId);
  // Superadmin mengelola banyak UMKM: cukup pilih UMKM-nya, cabang ikut semua.
  const umkms = [...new Set(branches.map((b) => b.umkmName))];
  const branchCount = (umkm: string) => branches.filter((b) => b.umkmName === umkm).length;
  const activeUmkm = selectedBranchId.startsWith(UMKM_SCOPE)
    ? selectedBranchId.slice(UMKM_SCOPE.length)
    : null;

  const options =
    role === "superadmin"
      ? [
          { value: "all", label: `Semua UMKM (${umkms.length})` },
          ...umkms.map((u) => ({ value: `${UMKM_SCOPE}${u}`, label: u, hint: `${branchCount(u)} cabang` })),
        ]
      : [
          { value: "all", label: `Semua Cabang (${branches.length})` },
          ...branches.map((b) => ({ value: b.id, label: b.umkmName, hint: b.name })),
        ];

  const primaryTitle =
    role === "branch_admin"
      ? "Kopi Laris Nusantara"
      : activeUmkm || activeBranch?.umkmName || (role === "superadmin" ? "Semua UMKM" : "Semua Cabang");

  const secondarySubtitle =
    role === "branch_admin"
      ? "Cabang Kemang"
      : activeUmkm
        ? `${branchCount(activeUmkm)} Cabang Aktif`
        : (activeBranch?.name ?? `${branches.length} Cabang Aktif`);

  return {
    canFilterBranch: role === "superadmin" || role === "owner",
    filterLabel: role === "superadmin" ? "Filter UMKM" : "Filter cabang",
    options,
    primaryTitle,
    secondarySubtitle,
  };
}
