import { useState } from "react";

interface UseSearchFilterProps<T> {
  items: T[];
  fields: (item: T) => string[];
}

/** Pencarian teks sederhana (tidak peka huruf besar/kecil) atas beberapa field. */
export function useSearchFilter<T>({ items, fields }: UseSearchFilterProps<T>) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter((item) => fields(item).some((f) => f.toLowerCase().includes(q)))
    : items;
  return { query, setQuery, filtered };
}
