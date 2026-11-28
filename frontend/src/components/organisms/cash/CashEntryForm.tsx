"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { RupiahInput } from "@/components/atoms/RupiahInput";
import { TextInput } from "@/components/atoms/TextInput";
import { ChipGroup } from "@/components/molecules/ChipGroup";
import { FormField } from "@/components/molecules/FormField";
import { Panel } from "@/components/molecules/Panel";
import { Select } from "@/components/molecules/Select";
import { SOURCE_OPTIONS } from "@/config/cash";
import type { CashKind } from "@/config/cash";
import type { UserRole } from "@/config/nav";
import type { BranchItem, CashEntry } from "@/data/mock";
import { useCashEntryForm } from "@/hooks/useCashEntryForm";

interface CashEntryFormProps {
  kind: CashKind;
  branches: BranchItem[];
  role: UserRole;
  onAdd: (item: Omit<CashEntry, "id" | "date">) => void;
}

export function CashEntryForm({ role, ...props }: CashEntryFormProps) {
  const form = useCashEntryForm(props);
  const { copy } = form;
  const { kind } = props;

  return (
    <Panel title={copy.formTitle}>
      <form onSubmit={form.handleSubmit} className="space-y-3.5 p-4">
        {role !== "branch_admin" && (
          <FormField label="UMKM / Cabang">
            <Select
              ariaLabel={`Pilih UMKM dan cabang ${copy.noun.toLowerCase()}`}
              value={form.branchId}
              options={form.branchOptions}
              onChange={form.setBranchId}
            />
          </FormField>
        )}
        <FormField label="Variabel / Kategori" htmlFor={`${kind}-kategori`} labelGap="md">
          <ChipGroup options={copy.presets} value={form.category} onChange={form.setCategory} ariaLabel="Kategori cepat" />
          <TextInput
            id={`${kind}-kategori`}
            value={form.category}
            onChange={(e) => form.setCategory(e.target.value)}
            placeholder={copy.categoryPlaceholder}
            required
          />
        </FormField>
        <FormField label="Nominal (Rp)" htmlFor={`${kind}-nominal`}>
          <RupiahInput
            id={`${kind}-nominal`}
            value={form.amount}
            onChange={form.setAmount}
            placeholder="Contoh: 50.000"
            required
          />
        </FormField>
        <FormField label="Sumber Kas">
          <Select ariaLabel="Pilih sumber kas" value={form.source} options={SOURCE_OPTIONS} onChange={form.setSource} />
        </FormField>
        <FormField label="Catatan" htmlFor={`${kind}-catatan`}>
          <TextInput
            id={`${kind}-catatan`}
            value={form.note}
            onChange={(e) => form.setNote(e.target.value)}
            placeholder={copy.notePlaceholder}
          />
        </FormField>
        <Button type="submit" variant="dark" className="w-full">
          <Plus className="size-3.5" /> Simpan {copy.noun}
        </Button>
      </form>
    </Panel>
  );
}
