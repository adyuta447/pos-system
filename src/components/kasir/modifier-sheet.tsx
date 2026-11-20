import { useState } from 'react';
import { View } from 'react-native';

import Button from '@/components/ui/button';
import Sheet from '@/components/ui/sheet';
import TextField from '@/components/ui/text-field';
import type { ModifierGroup, ProductInfo } from '@/db/catalog';
import type { CartModifier } from '@/lib/cart';
import { formatRupiah } from '@/lib/money';
import { defaultModifiers, missingRequiredGroup, toggleModifier } from '@/lib/modifiers';

import ModifierGroupPicker from './modifier-group-picker';

interface Props {
  product: ProductInfo;
  groups: ModifierGroup[];
  /** Set when editing a cart line; otherwise the group defaults are preselected. */
  initialModifiers?: CartModifier[];
  initialNote?: string;
  qty?: number;
  onSubmit(modifiers: CartModifier[], note: string): void;
  onClose(): void;
  /** Shows a delete button (editing a cart line). */
  onRemove?(): void;
}

/** Choose modifiers and a note for a product. Mount only while open. */
export default function ModifierSheet({
  product, groups, initialModifiers, initialNote = '', qty = 1, onSubmit, onClose, onRemove,
}: Props) {
  const [selected, setSelected] = useState(() => initialModifiers ?? defaultModifiers(groups));
  const [note, setNote] = useState(initialNote);

  const selectedOptionIds = selected.map((m) => m.optionId);
  const unitPrice = product.price + selected.reduce((sum, m) => sum + m.priceDelta, 0);
  const submitLabel = `${initialModifiers ? 'Simpan' : 'Tambah'}  ${formatRupiah(unitPrice * qty)}`;

  return (
    <Sheet title={product.name} onClose={onClose} size="lg">
      <View className="gap-5">
        {groups.map((group) => (
          <ModifierGroupPicker
            key={group.id}
            group={group}
            selectedOptionIds={selectedOptionIds}
            onToggle={(g, option) => setSelected((current) => toggleModifier(current, g, option))}
          />
        ))}
        <TextField label="Catatan" value={note} onChangeText={setNote} placeholder="Misalnya: pisah sambal" />
        <View className="flex-row gap-2">
          {onRemove && <Button label="Hapus item" variant="orange" size="lg" onPress={onRemove} />}
          <Button
            label={submitLabel}
            variant="red"
            size="lg"
            className="flex-1"
            disabled={missingRequiredGroup(selected, groups)}
            onPress={() => onSubmit(selected, note.trim())}
          />
        </View>
      </View>
    </Sheet>
  );
}
