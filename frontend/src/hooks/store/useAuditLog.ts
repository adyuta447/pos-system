import { useState } from "react";
import { ROLE_META, type UserRole } from "@/config/nav";
import { INITIAL_LOGS, type AuditLogItem } from "@/data/mock";

interface UseAuditLogProps {
  role: UserRole;
}

export type AppendLog = (action: string, target: string, detail: string) => void;

const ROLE_LOG_LABELS: Record<UserRole, string> = {
  superadmin: "Superadmin",
  owner: "Admin Pusat",
  branch_admin: "Admin Cabang",
};

export function useAuditLog({ role }: UseAuditLogProps) {
  const [logs, setLogs] = useState<AuditLogItem[]>(INITIAL_LOGS);

  const appendLog: AppendLog = (action, target, detail) => {
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: "27 Nov 2026, Baru saja",
        actor: ROLE_META[role].name,
        roleLabel: ROLE_LOG_LABELS[role],
        action,
        target,
        detail,
      },
      ...prev,
    ]);
  };

  return { logs, appendLog };
}
