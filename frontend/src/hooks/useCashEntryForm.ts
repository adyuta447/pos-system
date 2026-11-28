import { useState, type FormEvent } from "react";
import { CASH_COPY, type CashKind } from "@/config/cash";
import type { BranchItem, CashEntry, ExpenseSource } from "@/data/mock";

interface UseCashEntryFormProps {
  kind: CashKind;
  branches: BranchItem[];
  onAdd: (item: Omit<CashEntry, "id" | "date">) => void;
}

export function useCashEntryForm({ kind, branches, onAdd }: UseCashEntryFormProps) {
  const copy = CASH_COPY[kind];
  const [category, setCategory] = useState<string>(copy.presets[0]);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<ExpenseSource>("Tunai (Laci)");
  const [note, setNote] = useState("");
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "cab-kemang");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const numeric = Number(amount);
    if (!category.trim() || !Number.isFinite(numeric) || numeric <= 0) return;
    const branch = branches.find((b) => b.id === branchId) ?? branches[0];
    onAdd({
      branchId: branch.id,
      branchName: branch.name,
      category: category.trim(),
      amount: Math.round(numeric),
      source,
      note: note.trim() || copy.defaultNote,
    });
    setAmount("");
    setNote("");
  }

  return {
    copy,
    category,
    setCategory,
    amount,
    setAmount,
    source,
    setSource: (v: string) => setSource(v as ExpenseSource),
    note,
    setNote,
    branchId,
    setBranchId,
    branchOptions: branches.map((b) => ({ value: b.id, label: b.umkmName, hint: b.name })),
    handleSubmit,
  };
}
