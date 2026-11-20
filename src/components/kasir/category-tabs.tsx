import { ScrollView } from 'react-native';

import Button from '@/components/ui/button';
import type { Category } from '@/db/catalog';

interface Props {
  categories: Category[];
  /** null = "Semua" tab, undefined = no tab highlighted (e.g. while searching). */
  selectedId?: string | null;
  onSelect(categoryId: string | null): void;
}

export default function CategoryTabs({ categories, selectedId, onSelect }: Props) {
  const tabs = [{ id: null, name: 'Semua' }, ...categories];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="shrink-0 grow-0" contentContainerClassName="gap-2">
      {tabs.map((tab) => (
        <Button key={tab.id ?? 'all'} label={tab.name} selected={selectedId === tab.id} onPress={() => onSelect(tab.id)} />
      ))}
    </ScrollView>
  );
}
