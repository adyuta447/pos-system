# Kasir F&B (POS)

Aplikasi kasir Android (tablet/HP) untuk usaha F&B mikro. Spesifikasi lengkap ada di dokumen fitur POS F&B UMKM.

## Jalankan

```bash
yarn install
npx expo start          # buka di Expo Go / emulator Android
yarn test               # tes format struk, total, ESC/POS
npx tsc --noEmit && npx expo lint
```

Login demo: **Rina** PIN `1234` (kasir), **Pemilik** PIN `123456`. Menu, diskon, dan toko "Kopi Senja" adalah data contoh (`seed()` di `src/lib/db.ts`).

## Struktur

```
src/
  app/          layar (route Expo Router), tipis: hanya merangkai komponen + hook
  components/
    ui/         komponen dasar: AppText, Button, Keypad, Sheet, TextField, ...
    kasir/      layar kasir: menu, keranjang, modifier, pembayaran
    login/ riwayat/ shift/ settings/   komponen per layar
  hooks/        useCart, useCatalog, useFocusedStore, useToast
  db/           SQLite per domain: schema, seed, store, users, shifts, catalog, orders
  lib/          logika murni tanpa React: money, cart, modifiers, receipt, escpos, keypad; printer.ts = PrinterService
  providers/    SessionProvider (kasir + shift aktif)
  constants/    palette.js: satu sumber warna untuk Tailwind dan kode
```

Aturan yang dipakai:

- Satu komponen per file, `export default function`, props diketik dengan `interface Props`.
- Bentuk objek selalu `interface` (dijaga ESLint `consistent-type-definitions`). `type` hanya untuk union seperti `OrderType = 'dine_in' | 'take_away'`, karena interface tidak bisa menyatakan union.
- Layar tidak berisi SQL; query ada di `src/db/`. Komponen tidak memanggil database; datanya lewat props.
- Logika murni di `src/lib/` tidak meng-import React/Expo, jadi bisa dites dengan Node (`yarn test`). Import antar file di sana memakai ekstensi `.ts` supaya Node bisa menjalankannya.
- Sheet/modal di-mount hanya saat terbuka, jadi state-nya selalu mulai bersih.

## Menyambungkan printer Bluetooth

1. Pilih library setelah diuji dengan printer asli (mis. `react-native-bluetooth-classic`).
2. Buat driver yang memenuhi tipe `PrinterDriver` lalu panggil `registerPrinterDriver(driver)` sekali saat aplikasi mulai.
3. Butuh development build (`npx expo run:android` atau `eas build --profile development`) dan izin `BLUETOOTH_CONNECT` / `BLUETOOTH_SCAN`.

Sampai driver dipasang, setiap transaksi tetap tersimpan; struk bisa dilihat, dicetak ulang, atau dikirim lewat WhatsApp.
