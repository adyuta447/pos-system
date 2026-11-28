import { useState } from "react";
import { INITIAL_BRANCHES, type BranchItem } from "@/data/mock";
import type { AppendLog } from "./useAuditLog";

interface UseBranchStoreProps {
  appendLog: AppendLog;
}

export function useBranchStore({ appendLog }: UseBranchStoreProps) {
  const [branches, setBranches] = useState<BranchItem[]>(INITIAL_BRANCHES);

  function toggleLicense(branchId: string) {
    const target = branches.find((b) => b.id === branchId);
    setBranches((prev) =>
      prev.map((b) => {
        if (b.id !== branchId) return b;
        const activate = b.status !== "Aktif";
        return { ...b, status: activate ? "Aktif" : "Nonaktif", validUntil: activate ? "27 Des 2026" : "Dinonaktifkan" };
      }),
    );
    if (target) {
      const nextState = target.status !== "Aktif" ? "Aktif" : "Nonaktif";
      appendLog("Ubah Status Lisensi", target.name, `Lisensi ${target.licenseKey} -> ${nextState}`);
    }
  }

  return { branches, toggleLicense };
}
