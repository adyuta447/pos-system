import { useMemo } from "react";
import { NAV, type UserRole } from "@/config/nav";

interface UseSidebarNavProps {
  role: UserRole;
}

/** Grup navigasi beserta item yang boleh dilihat peran aktif; grup kosong dibuang. */
export function useSidebarNav({ role }: UseSidebarNavProps) {
  return useMemo(
    () =>
      NAV.map((group) => ({ ...group, items: group.items.filter((item) => item.roles.includes(role)) })).filter(
        (group) => group.items.length > 0,
      ),
    [role],
  );
}
