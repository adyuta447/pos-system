"use client";

import { DataTable } from "@/components/molecules/DataTable";
import { Panel } from "@/components/molecules/Panel";
import { SearchInput } from "@/components/molecules/SearchInput";
import type { AuditLogItem } from "@/data/mock";
import { useSearchFilter } from "@/hooks/useSearchFilter";

interface LogsViewProps {
  logs: AuditLogItem[];
}

const COLUMNS = [{ label: "WAKTU" }, { label: "PENGGUNA" }, { label: "AKSI" }, { label: "TARGET" }, { label: "KETERANGAN" }];

export function LogsView({ logs }: LogsViewProps) {
  const { query, setQuery, filtered } = useSearchFilter({
    items: logs,
    fields: (l) => [l.actor, l.action, l.target, l.detail],
  });

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
      <DataTable columns={COLUMNS} minWidth="min-w-[820px]">
        {filtered.map((l) => (
          <tr key={l.id} className="h-[44px] border-b border-line-subtle hover:bg-[#FAFAF8]">
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
      </DataTable>
    </Panel>
  );
}
