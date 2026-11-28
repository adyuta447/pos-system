import { InfoList } from "@/components/molecules/InfoList";
import { Panel } from "@/components/molecules/Panel";
import type { UserRole } from "@/config/nav";
import { ROLE_LABELS } from "@/config/roles";

interface SettingsViewProps {
  role: UserRole;
}

const SCOPE_LABELS: Record<UserRole, string> = {
  superadmin: "Seluruh UMKM, Lisensi, Admin, dan Log",
  owner: "Seluruh Cabang UMKM Milik Sendiri",
  branch_admin: "Khusus Cabang Kemang",
};

const DEVICE_INFO = [
  { label: "Aplikasi Kasir Tablet", value: "Flutter (SQLite Drift)" },
  { label: "Metode Pembayaran", value: "Tunai, QRIS" },
  { label: "Format Pajak Default", value: "PPN 11%", mono: true },
];

export function SettingsView({ role }: SettingsViewProps) {
  return (
    <div className="grid gap-3.5 md:grid-cols-2">
      <Panel title="INFORMASI AKUN DAN HAK AKSES">
        <InfoList
          items={[
            { label: "Peran Aktif", value: ROLE_LABELS[role] },
            { label: "Cakupan Data", value: SCOPE_LABELS[role] },
            { label: "Biaya Langganan", value: "Rp30.000 / bulan / cabang", mono: true },
          ]}
        />
      </Panel>
      <Panel title="INTEGRASI PERANGKAT KASIR">
        <InfoList items={DEVICE_INFO} />
      </Panel>
    </div>
  );
}
