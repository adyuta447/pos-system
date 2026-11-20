import { useState } from 'react';
import { View } from 'react-native';

import AppText from '@/components/ui/app-text';
import Button from '@/components/ui/button';
import CardSection from '@/components/ui/card-section';
import ReceiptPaper from '@/components/ui/receipt-paper';
import TextField from '@/components/ui/text-field';
import { charsPerLine, type PaperWidth, type Store } from '@/db/store';
import { connectPrinter, hasPrinterDriver, isPrinterReady, printLines } from '@/lib/printer';

interface Props {
  store: Store;
  onChange(patch: Partial<Store>): void;
}

const PAPER_WIDTHS: PaperWidth[] = [58, 80];

function buildTestLines(store: Store): string[] {
  const width = charsPerLine(store);
  const divider = '-'.repeat(width);
  return [
    store.name.toUpperCase(),
    'TEST PRINT',
    divider,
    `Kertas ${store.paperWidth} mm, ${width} karakter`,
    '1234567890'.repeat(5).slice(0, width),
    divider,
    'Printer siap dipakai',
  ];
}

function describeStatus(): string {
  if (!hasPrinterDriver()) {
    return 'Driver Bluetooth belum dipasang di aplikasi ini. Struk tetap tersimpan dan bisa dilihat, dicetak ulang, atau dikirim lewat WhatsApp.';
  }
  return isPrinterReady() ? 'Tersambung.' : 'Terputus. Isi alamat lalu tekan Sambungkan.';
}

export default function PrinterSettings({ store, onChange }: Props) {
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string[] | null>(null);

  const handleConnect = async () => {
    setMessage((await connectPrinter(store.printerAddress)) ? 'Printer tersambung' : 'Gagal menyambung printer');
  };

  const handleTestPrint = async () => {
    const lines = buildTestLines(store);
    if (await printLines(lines)) {
      setMessage('Test print terkirim ke printer');
      setPreview(null);
    } else {
      setMessage('Printer belum tersambung. Ini contoh hasil cetaknya:');
      setPreview(lines);
    }
  };

  return (
    <CardSection title="Printer">
      <AppText className="text-base">{describeStatus()}</AppText>
      <TextField
        label="Alamat printer (MAC)"
        surface="peach"
        value={store.printerAddress ?? ''}
        placeholder="00:11:22:33:44:55"
        autoCapitalize="characters"
        onChangeText={(value) => onChange({ printerAddress: value.trim() || null })}
      />
      <AppText className="font-label text-base">Ukuran kertas</AppText>
      <View className="flex-row gap-2">
        {PAPER_WIDTHS.map((width) => (
          <Button
            key={width}
            label={`${width} mm`}
            selected={store.paperWidth === width}
            className="flex-1"
            onPress={() => onChange({ paperWidth: width })}
          />
        ))}
      </View>
      <View className="flex-row gap-2">
        <Button
          label="Sambungkan"
          variant="orange"
          className="flex-1"
          disabled={!hasPrinterDriver() || !store.printerAddress}
          onPress={handleConnect}
        />
        <Button label="Test print" variant="red" className="flex-1" onPress={handleTestPrint} />
      </View>
      {!!message && (
        <AppText className="font-label text-base" accessibilityLiveRegion="polite">
          {message}
        </AppText>
      )}
      {preview && <ReceiptPaper lines={preview} />}
    </CardSection>
  );
}
