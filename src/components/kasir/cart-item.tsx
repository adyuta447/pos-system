import { Pressable, View } from 'react-native';

import AppText from '@/components/ui/app-text';
import Button from '@/components/ui/button';
import { type CartLine, lineTotal } from '@/lib/cart';
import { formatRupiah } from '@/lib/money';

interface Props {
  line: CartLine;
  /** Opens modifiers, note and delete for this line. */
  onEdit(line: CartLine): void;
  onChangeQty(key: string, delta: number): void;
}

export default function CartItem({ line, onEdit, onChangeQty }: Props) {
  return (
    <View className="flex-row items-center gap-2 rounded-2xl bg-paper p-2 pl-3">
      <Pressable
        className="flex-1 py-1 active:scale-95"
        onPress={() => onEdit(line)}
        accessibilityRole="button"
        accessibilityHint="Ubah pilihan, catatan, atau hapus">
        <AppText className="font-heading text-base">{line.name}</AppText>
        {line.modifiers.length > 0 && <AppText className="text-sm">{line.modifiers.map((m) => m.name).join(', ')}</AppText>}
        {!!line.note && <AppText className="text-sm">Catatan: {line.note}</AppText>}
        <AppText className="font-heading text-base text-red">{formatRupiah(lineTotal(line))}</AppText>
      </Pressable>
      <Button label="−" variant="orange" className="w-12 px-0" accessibilityLabel={`Kurangi ${line.name}`} onPress={() => onChangeQty(line.key, -1)} />
      <AppText className="w-8 text-center font-display text-xl">{line.qty}</AppText>
      <Button label="+" variant="orange" className="w-12 px-0" accessibilityLabel={`Tambah ${line.name}`} onPress={() => onChangeQty(line.key, 1)} />
    </View>
  );
}
