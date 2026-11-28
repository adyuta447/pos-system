import { Button } from "@/components/atoms/Button";
import { SearchInput } from "@/components/molecules/SearchInput";
import { Select } from "@/components/molecules/Select";
import type { useCashEntriesView } from "@/hooks/useCashEntriesView";

interface CashEntryFiltersProps {
  view: ReturnType<typeof useCashEntriesView>;
}

export function CashEntryFilters({ view }: CashEntryFiltersProps) {
  return (
    <div role="search" aria-label={`Filter ${view.copy.noun.toLowerCase()}`} className="flex flex-wrap items-center gap-2">
      <SearchInput
        variant="white"
        placeholder="Cari kategori, catatan, cabang..."
        value={view.query}
        onChange={view.setQuery}
        className="min-w-[200px] flex-1"
      />
      <Select
        size="sm"
        ariaLabel="Filter kategori"
        className="w-[180px]"
        value={view.categoryFilter}
        options={view.categoryOptions}
        onChange={view.setCategoryFilter}
      />
      <Select
        size="sm"
        ariaLabel="Filter sumber kas"
        className="w-[160px]"
        value={view.sourceFilter}
        options={view.sourceOptions}
        onChange={view.setSourceFilter}
      />
      {view.isFiltered && (
        <Button size="sm" variant="outline" onClick={view.resetFilters}>
          Reset filter
        </Button>
      )}
    </div>
  );
}
