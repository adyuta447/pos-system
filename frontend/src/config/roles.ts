import type { UserRole } from "./nav";

/** Label peran untuk tabel admin dan pengaturan. */
export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Superadmin",
  owner: "Admin Pusat (Owner)",
  branch_admin: "Admin Cabang",
};
