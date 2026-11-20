import { View } from 'react-native';

import AppText from '@/components/ui/app-text';
import Button from '@/components/ui/button';
import type { ModifierGroup, ModifierOption } from '@/db/catalog';
import { formatRupiah } from '@/lib/money';

interface Props {
  group: ModifierGroup;
  selectedOptionIds: string[];
  onToggle(group: ModifierGroup, option: ModifierOption): void;
}

function hint(group: ModifierGroup): string {
  if (group.required) return 'wajib pilih satu';
  return group.maxSelect > 1 ? `boleh pilih sampai ${group.maxSelect}` : 'opsional';
}

/** One modifier group as big buttons, not a dropdown (spec 3.1). */
export default function ModifierGroupPicker({ group, selectedOptionIds, onToggle }: Props) {
  return (
    <View className="gap-2">
      <AppText className="font-heading text-lg">
        {group.name}
        <AppText className="text-base">{`  ${hint(group)}`}</AppText>
      </AppText>
      <View className="flex-row flex-wrap gap-2">
        {group.options.map((option) => {
          const selected = selectedOptionIds.includes(option.id);
          const textColor = selected ? 'text-paper' : '';
          return (
            <Button key={option.id} size="lg" className="min-w-36" selected={selected} onPress={() => onToggle(group, option)}>
              <AppText className={`font-heading text-lg ${textColor}`}>{option.name}</AppText>
              {option.priceDelta > 0 && <AppText className={`text-base ${textColor}`}>+{formatRupiah(option.priceDelta)}</AppText>}
            </Button>
          );
        })}
      </View>
    </View>
  );
}
