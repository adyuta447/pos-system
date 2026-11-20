import CardSection from '@/components/ui/card-section';
import TextField from '@/components/ui/text-field';
import type { Store } from '@/db/store';

interface Props {
  store: Store;
  onChange(patch: Partial<Store>): void;
}

/** Whole percent only, 0 to 100. */
function parseTaxPercent(value: string): number {
  return Math.min(100, Number(value.replace(/\D/g, '')) || 0);
}

export default function StoreInfoForm({ store, onChange }: Props) {
  return (
    <CardSection title="Info toko di struk">
      <TextField label="Nama toko" surface="peach" value={store.name} onChangeText={(name) => onChange({ name })} />
      <TextField label="Alamat" surface="peach" value={store.address} onChangeText={(address) => onChange({ address })} />
      <TextField label="Nomor WA" surface="peach" value={store.phone} keyboardType="phone-pad" onChangeText={(phone) => onChange({ phone })} />
      <TextField label="Catatan kaki struk" surface="peach" value={store.footer} onChangeText={(footer) => onChange({ footer })} />
      <TextField
        label="Pajak (%)"
        surface="peach"
        value={store.taxPercent ? String(store.taxPercent) : ''}
        placeholder="0"
        keyboardType="number-pad"
        onChangeText={(value) => onChange({ taxPercent: parseTaxPercent(value) })}
      />
    </CardSection>
  );
}
