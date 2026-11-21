# PRD Pre-Launch Aplikasi Kasir Flutter (POS UMKM)

Nov 21, 2026 · @adyuta

## Product Overview

Tahap pre-launch adalah aplikasi kasir Flutter yang berjalan penuh di satu tablet, menyimpan semua data secara lokal, dan langsung mencetak struk ke printer thermal Bluetooth. Tujuannya membuktikan alur kasir di lapangan pada UMKM pilot sebelum backend Golang, multi-cabang, dan sistem license dari PRD v1 dibangun.

**Product Vision:** Kasir yang cepat, ringan di tablet Android kelas menengah, dan dibangun dengan struktur kode yang bisa langsung dilanjutkan ke v1.0 tanpa ditulis ulang.

**Ruang lingkup pre-launch:**

- Satu tablet = satu cabang, dengan satu pengguna. Belum ada pembagian role owner dan kasir; semua menu terbuka (full access) tanpa PIN.
- Database lokal di perangkat (SQLite via Drift). Belum ada sinkronisasi ke server.
- Pembayaran Cash, atau QRIS tanpa integrasi: pelanggan scan QRIS fisik toko, lalu app menanyakan apakah sudah dibayar sebelum transaksi disimpan.
- Cetak struk ke printer thermal Bluetooth 58mm atau 80mm. Pajak bisa diatur sendiri, dan tampilan struk bisa dicek lewat preview di Pengaturan.

**Di luar ruang lingkup:** pembagian role owner dan kasir, absensi kasir, backend dan API, dashboard web owner, aktivasi license, multi-cabang, QRIS dinamis dengan callback, notifikasi subscription.

**Business Objectives:**

- Memvalidasi alur kasir dan kecepatan transaksi dengan UMKM pilot nyata
- Mengumpulkan data transaksi lokal sebagai bahan uji migrasi ke backend v1.0
- Menyiapkan design system dan arsitektur Flutter yang dipakai ulang di v1.0

**Success Metrics:**

- Waktu satu transaksi cash dari pilih produk sampai struk tercetak di bawah 30 detik untuk keranjang 3 item
- Nol transaksi hilang atau stok tidak konsisten selama masa pilot
- Tingkat keberhasilan cetak struk pada percobaan pertama minimal 95%
- Minimal 3 UMKM pilot memakai aplikasi setiap hari selama 4 minggu

## User Personas

Pre-launch hanya punya satu peran: pengguna toko yang mengelola semua hal di tablet. Pembagian owner, admin cabang, dan kasir baru masuk di v1.0.

### Persona: Pengguna Toko (Budi, 38 tahun)

- **Demographics:** Pemilik warung atau toko dengan satu outlet yang juga sering melayani pembeli sendiri, terbiasa pakai WhatsApp dan mobile banking
- **Goals:** Melayani pembeli dengan cepat tanpa salah hitung kembalian, mengatur produk dan harga sendiri, melihat penjualan hari ini langsung di tablet
- **Pain Points:** Hitung manual lambat saat ramai, rekap di buku, tidak tahu barang mana yang hampir habis, tidak ada bukti transaksi
- **User Journey:** Buka app → atur produk dan stok → layani transaksi Cash atau QRIS → struk tercetak → cek ringkasan penjualan di akhir hari

## Feature Requirements

Dua belas fitur Must membentuk satu alur kasir yang utuh di satu tablet, semuanya dipakai oleh satu pengguna tanpa pembagian role. Fitur Should boleh menyusul selama masa pilot.

| Feature | Deskripsi | User Story | Prioritas | Acceptance Criteria | Dependensi |
| --- | --- | --- | --- | --- | --- |
| **Setup Awal Toko** | Wizard pertama kali: nama toko, alamat, footer struk, pajak, printer | As a user, I want to set up my store once so that receipts show my store info | Must | Data toko tersimpan lokal; wizard tidak muncul lagi setelah selesai; semua isian bisa diubah di Pengaturan | - |
| **Manajemen Produk & Kategori** | Tambah, edit, nonaktifkan produk dan kategori | As a user, I want to manage products so that the cart shows the right items and prices | Must | Nama, harga (int rupiah), kategori, SKU opsional, foto opsional; nama duplikat ditolak; produk dengan riwayat transaksi hanya bisa dinonaktifkan | Setup Awal Toko |
| **Manajemen Stok** | Stok awal, penyesuaian manual dengan alasan, batas stok minimum | As a user, I want to adjust stock so that records match physical goods | Must | Setiap perubahan tercatat di log mutasi stok; produk di bawah batas minimum ditandai | Manajemen Produk |
| **Kasir: Keranjang** | Pilih produk lewat grid, kategori, atau pencarian; ubah jumlah; hapus item | As a user, I want to build a cart quickly so that the queue moves fast | Must | Pencarian muncul di bawah 300ms untuk 1.000 produk; item stok 0 tidak bisa ditambah; total langsung ter-update | Manajemen Produk |
| **Pembayaran Cash** | Input uang diterima, tombol nominal cepat, kembalian otomatis | As a user, I want the change calculated so that I never give wrong change | Must | Tombol Uang Pas, 20rb, 50rb, 100rb; tidak bisa konfirmasi jika uang kurang dari total | Kasir: Keranjang |
| **Pembayaran QRIS (Konfirmasi Manual)** | Pelanggan scan QRIS fisik toko; app menanyakan apakah pembayaran sudah masuk | As a user, I want to confirm a QRIS payment so that the sale is saved only after the money arrives | Must | Dialog "Sudah dibayar?" muncul berisi total; Sudah: transaksi tersimpan sebagai qris\_manual; Belum: kembali ke keranjang tanpa data tersimpan | Kasir: Keranjang |
| **Pajak Custom** | Atur pajak sendiri: aktif atau tidak, nama (PPN, PB1, dll), persentase, sudah termasuk di harga atau ditambahkan | As a user, I want to set my own tax so that totals and receipts match how my business is taxed | Must | Persentase sampai 2 desimal; pajak dihitung dari subtotal dan dibulatkan ke rupiah terdekat; subtotal, pajak, dan total tampil di layar bayar dan struk; tarif disimpan per transaksi sehingga perubahan tidak memengaruhi transaksi lama; pajak nonaktif = baris pajak tidak tampil | Setup Awal Toko |
| **Checkout Atomik** | Simpan transaksi, item, dan pengurangan stok dalam satu transaksi database | As a user, I want every sale saved completely so that stock and sales never mismatch | Must | Jika satu item gagal, seluruh transaksi di-rollback; nomor struk unik dan berurutan per hari | Pembayaran |
| **Cetak Struk Thermal** | Cetak via Bluetooth ESC/POS, 58mm atau 80mm | As a user, I want a printed receipt so that the customer has proof of payment | Must | Cetak dimulai setelah transaksi tersimpan; gagal cetak tidak membatalkan transaksi; tombol Cetak Ulang tersedia | Checkout Atomik |
| **Pengaturan Printer** | Scan, pilih, simpan, dan tes printer | As a user, I want to pair the printer once so that it reconnects automatically | Must | Alamat printer tersimpan; auto-connect saat app dibuka; tombol Tes Cetak; pilihan lebar kertas | - |
| **Pengaturan Profil, Toko & Preview Struk** | Ubah profil pengguna, data toko, dan tampilan struk dengan preview langsung | As a user, I want to customize my store and preview the receipt so that I know how it prints before I start selling | Must | Profil: nama dan foto pengguna; Toko: nama, alamat, telepon, logo, header dan footer struk; preview ter-update saat isian diubah dan mengikuti lebar kertas; preview sama dengan hasil cetak; tombol Tes Cetak dari halaman preview | Pengaturan Printer |
| **Riwayat & Ringkasan Penjualan** | Daftar transaksi per hari dan total per metode bayar | As a user, I want to see today's sales so that I can match cash in the drawer | Must | Filter tanggal; total Cash dan QRIS terpisah; buka detail dan cetak ulang struk | Checkout Atomik |
| **Void Transaksi** | Batalkan transaksi lewat dialog konfirmasi dan alasan | As a user, I want to void a wrong sale so that stock and totals stay correct | Should | Stok dikembalikan; transaksi tetap tersimpan dengan status void; tidak dihitung di total | Riwayat |
| **Backup & Export Lokal** | Export database ke file dan restore | As a user, I want to back up my data so that I do not lose it if the tablet breaks | Should | File backup bisa dibagikan via WhatsApp atau Drive; restore memvalidasi versi skema | - |

## User Flows

Semua alur selesai di satu tablet tanpa koneksi internet. Aturan utamanya: transaksi disimpan dulu, baru dicetak.

### Flow 1: Setup Awal

1. Pengguna membuka app pertama kali, wizard setup muncul
2. Isi nama toko, alamat, nomor telepon, footer struk
3. Atur format nomor struk (prefix dan reset harian)
4. Atur pajak: aktif atau tidak, nama, persentase, sudah termasuk di harga atau ditambahkan (bisa diubah nanti)
5. Scan dan pilih printer Bluetooth, pilih lebar kertas, jalankan Tes Cetak
6. Tambah kategori dan produk pertama
   - *Error: Izin Bluetooth ditolak → tampilkan penjelasan dan tombol ke pengaturan Android; setup printer bisa dilewati*

### Flow 2: Transaksi Cash

1. Pengguna membuka layar kasir (landscape: grid produk kiri, keranjang kanan)
2. Tap produk di grid atau cari lewat kolom pencarian
3. Ubah jumlah lewat stepper di keranjang
4. Tap Bayar → ringkasan subtotal, pajak, dan total tampil → pilih Cash
5. Tap tombol nominal cepat atau ketik uang diterima → kembalian tampil
6. Tap Konfirmasi → checkout atomik (simpan transaksi, item, kurangi stok)
7. Layar sukses tampil, struk dicetak di background, keranjang kosong siap transaksi berikutnya
   - *Error: Stok tidak cukup saat checkout → rollback, item ditandai di keranjang*
   - *Error: Printer gagal → transaksi tetap tersimpan, snackbar dengan tombol Cetak Ulang*

### Flow 3: Transaksi QRIS (Konfirmasi Manual)

1. Pengguna membangun keranjang seperti Flow 2 langkah 1 sampai 3
2. Tap Bayar → pilih QRIS
3. Pelanggan scan QRIS fisik toko (stiker atau standee di meja kasir) dan membayar sejumlah total
4. App menampilkan dialog "Sudah dibayar?" berisi total yang harus masuk
5. Pengguna mengecek notifikasi masuk di HP atau aplikasi bank toko
6. Tap Sudah → checkout atomik dengan metode qris\_manual
7. Struk tercetak
   - *Belum dibayar: tap Belum → dialog tertutup, kembali ke keranjang, tidak ada data tersimpan*

### Flow 4: Kelola Produk & Stok

1. Pengguna membuka menu Produk
2. Tambah produk baru (nama, harga, kategori, stok awal, batas minimum) atau pilih produk yang ada
3. Untuk penyesuaian stok: isi jumlah baru dan alasan (barang masuk, rusak, selisih opname)
4. Simpan → grid kasir ter-update otomatis lewat stream database
   - *Error: Nama produk duplikat → peringatan, simpan ditolak*

### Flow 5: Riwayat & Cetak Ulang

1. Pengguna membuka Riwayat
2. Pilih tanggal → lihat daftar transaksi dan total Cash serta QRIS
3. Tap transaksi → detail item
4. Tap Cetak Ulang → struk dicetak dengan tanda SALINAN

### Flow 6: Pengaturan & Preview Struk

1. Pengguna membuka menu Pengaturan
2. Tab Profil: ubah nama dan foto pengguna
3. Tab Toko: ubah nama, alamat, telepon, logo, header dan footer struk
4. Tab Pajak: ubah status, nama, persentase, dan mode pajak
5. Panel preview struk di sisi kanan ter-update setiap kali isian berubah, sesuai lebar kertas yang dipilih
6. Tap Tes Cetak untuk membandingkan preview dengan hasil cetak asli
7. Tap Simpan
   - *Error: Logo terlalu besar → dikecilkan otomatis ke lebar kertas dan diubah ke hitam putih*

## Technical Specifications

Arsitekturnya feature-first dengan Atomic Design khusus di design system, widget berbasis class, Riverpod untuk state, Drift untuk data lokal, dan printer di balik interface. UI hanya bicara ke repository, jadi saat v1.0 sumber data bisa diganti ke API tanpa menyentuh layar.

### Stack

| Lapisan | Pilihan | Alasan |
| --- | --- | --- |
| Framework | Flutter (Dart), tablet Android landscape | Sama dengan PRD v1 |
| State management | Riverpod (`Notifier`, `AsyncNotifier`, `StreamProvider`) | `select` granular untuk rebuild minimal; provider repository mudah ditukar |
| Model | Immutable dengan `freezed` | Perbandingan state murah, rebuild bisa diprediksi |
| Database lokal | Drift (SQLite) | Relasional seperti skema Postgres v1; transaksi atomik; query reaktif |
| Printer | Package ESC/POS Bluetooth (dipilih setelah uji perangkat) + `esc_pos_utils_plus` untuk generate byte | Dibungkus `PrinterService` sehingga package bisa diganti |
| Routing | `go_router` | Deklaratif, satu route per fitur |
| Lint | `flutter_lints` + `very_good_analysis` atau setara | Menjaga konsistensi kode |

### Struktur Folder

```
pos/                          # monorepo, Dart pub workspaces (atau melos)
├── packages/
│   ├── pos_ui/                # design system, tidak tahu role & tidak tahu database
│   │   └── lib/
│   │       ├── src/tokens/    # PosColors, PosSpacing, PosRadius, PosText, PosBreakpoints
│   │       ├── src/atoms/     # PosButton, PosText, PriceText, PosBadge, PosIcon, PosAvatar
│   │       ├── src/molecules/ # ProductTile, QtyStepper, SearchField, AmountKey, SummaryRow
│   │       ├── src/organisms/ # ProductGrid, CartPanel, PaymentSheet, ReceiptPreview, DataTableCard
│   │       ├── src/templates/ # SplitLayout, SettingsLayout, ListDetailLayout
│   │       └── pos_ui.dart    # barrel export, hanya API publik
│   ├── pos_core/              # model netral, formatRupiah, calculateTax, Permission
│   ├── pos_data/              # Drift, repository interface + implementasi lokal
│   └── pos_printer/           # PrinterService, ReceiptLayout, ReceiptBuilder
├── apps/
│   └── kasir/                 # app tablet pre-launch
│       └── lib/features/      # setup, kasir, produk, riwayat, pengaturan
└── widgetbook/                # katalog semua komponen pos_ui
```

### Aturan Atomic Design (Reusable untuk v1.2)

Komponen di `pos_ui` tidak pernah tahu siapa penggunanya. Role dan hak akses hanya diterapkan di level page, sehingga saat v1.2 memisahkan owner, admin cabang, dan kasir, komponen yang sama tinggal disusun ulang tanpa disalin.

| Level | Tanggung jawab | Tidak boleh | Contoh |
| --- | --- | --- | --- |
| Tokens | Warna, spacing, radius, tipografi, breakpoint lewat `ThemeExtension` | Widget | `PosSpacing.md`, `PosBreakpoints.tablet` |
| Atoms | Satu elemen UI, data via constructor, aksi via callback | Provider, model database, import dari `apps/` | `PosButton`, `PriceText`, `PosBadge` |
| Molecules | Gabungan atoms dengan state UI lokal kecil | Provider, logic bisnis | `QtyStepper`, `SearchField`, `SummaryRow` |
| Organisms | Bagian layar utuh yang presentational: terima data + callback + slot | Provider, query database | `CartPanel`, `PaymentSheet`, `ReceiptPreview` |
| Templates | Kerangka layout dan slot, responsif per breakpoint | Data apa pun | `SplitLayout(left:, right:)` |
| Containers (di `apps/`) | Menghubungkan organism ke provider dan repository | Styling sendiri | `ConnectedCartPanel` |
| Pages (di `apps/`) | Menyusun template + container, menerapkan permission | Logic bisnis | `KasirPage`, `ProdukPage` |

**Aturan reusable:**

1. **Variant lewat parameter, bukan widget baru.** Satu `PosButton` dengan `variant` (primary, secondary, danger, ghost) dan `size` (sm, md, lg), bukan `PrimaryButton`, `DangerButton`, dan seterusnya.
2. **Organism presentational, container terpisah.** `CartPanel` hanya menerima `CartView` dan callback. `ConnectedCartPanel` di app yang membaca `cartProvider`. Dengan begitu `CartPanel` bisa dipakai di layar kasir, layar void, atau layar audit owner di v1.2.
3. **Slot untuk bagian yang beda per role.** Organism menerima `header`, `actions`, `footer`, atau builder. Contoh: `CartPanel(actions: [...])` diisi tombol Bayar untuk kasir, dan tombol Void untuk owner.
4. **Model netral dari `pos_core`.** Komponen menerima `ProductView`, `CartView`, `ReceiptView`, bukan class baris Drift. Saat sumber data pindah ke API, komponen tidak berubah.
5. **Permission, bukan role.** `pos_core` punya `enum Permission { processSale, voidSale, manageProducts, manageStock, viewReports, manageSettings, managePrinter }`. Page membungkus bagian sensitif dengan `PermissionGate`. Di pre-launch satu pengguna mendapat `Permission.values`; di v1.2 tinggal mapping role ke daftar permission.
6. **Responsif dari tokens.** Template memakai `PosBreakpoints` sehingga organism yang sama tampil di tablet kasir dan HP admin cabang.
7. **Satu widget per file, prefix `Pos` untuk atoms,** hanya diekspor lewat `pos_ui.dart`. File di `src/` tidak boleh di-import langsung dari luar package.
8. **Setiap komponen terdaftar di Widgetbook** dengan semua variant-nya, dan punya golden test. Komponen yang tidak ada di katalog dianggap belum selesai.

```dart
// pos_ui: presentational, tidak tahu role
class CartPanel extends StatelessWidget {
  const CartPanel({
    super.key,
    required this.cart,
    required this.onQtyChanged,
    required this.onRemove,
    this.header,
    this.actions = const [],
  });
  final CartView cart;
  final void Function(String id, int qty) onQtyChanged;
  final ValueChanged<String> onRemove;
  final Widget? header;
  final List<Widget> actions;
  // build: header, daftar item, SummaryRow subtotal/pajak/total, actions
}

// apps/kasir: page menerapkan permission
PermissionGate(
  permission: Permission.voidSale,
  child: PosButton.danger(label: 'Void', onPressed: onVoid),
)
```

**Inventaris komponen dan pemakaian ulang:**

| Komponen | Level | Pre-launch | Dipakai ulang di v1.2 |
| --- | --- | --- | --- |
| `PosButton`, `PriceText`, `PosBadge` | Atom | Semua layar | Semua role |
| `QtyStepper` | Molecule | Keranjang | Kasir, penyesuaian stok admin cabang |
| `SearchField` | Molecule | Kasir, produk, riwayat | Semua role |
| `SummaryRow` | Molecule | Layar bayar, struk | Laporan admin cabang dan owner |
| `ProductGrid` | Organism | Layar kasir | Kasir |
| `CartPanel` | Organism | Layar kasir | Kasir, detail transaksi owner |
| `PaymentSheet` | Organism | Cash dan QRIS | Kasir |
| `ReceiptPreview` | Organism | Pengaturan, cetak ulang | Kasir, audit owner |
| `DataTableCard` | Organism | Riwayat, produk | Laporan admin cabang dan owner |
| `SplitLayout`, `ListDetailLayout` | Template | Kasir, riwayat | Semua role |

### Aturan Widget: Class, Bukan Function

- Setiap widget yang dipakai ulang atau berdiri sendiri = class `StatelessWidget` atau `ConsumerWidget` dengan constructor `const`.
- Dilarang membuat method atau function `Widget _buildX()` untuk bagian UI. Pecah menjadi class private `_X` di file yang sama bila hanya dipakai lokal.
- Function hanya untuk logic murni: `formatRupiah`, `calculateChange`, `ReceiptBuilder.build`.
- Alasannya: widget `const` dilewati saat rebuild, setiap class punya `BuildContext` sendiri sehingga rebuild terisolasi, dan namanya tampil di DevTools.

```dart
class PriceText extends StatelessWidget {
  const PriceText(this.amount, {super.key, this.style});
  final int amount;
  final TextStyle? style;

  @override
  Widget build(BuildContext context) =>
      Text(formatRupiah(amount), style: style ?? AppText.price);
}

class CartTotal extends ConsumerWidget {
  const CartTotal({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final total = ref.watch(cartProvider.select((c) => c.total));
    return PriceText(total, style: AppText.totalLarge);
  }
}
```

### State Management

- `productsProvider`: `StreamProvider` dari query Drift, terpisah dari keranjang. Menambah item ke keranjang tidak me-rebuild grid produk.
- `cartProvider`: `Notifier<Cart>` dengan method `add`, `setQty`, `remove`, `clear`. `Cart` immutable, `total` dihitung sekali di model.
- `checkoutProvider`: `AsyncNotifier` yang memanggil `CheckoutUseCase` lalu memicu cetak.
- Provider repository (`transactionRepositoryProvider`, dll) adalah satu-satunya titik yang diganti saat pindah ke backend.

### Data Lokal (Drift)

**Tabel:** `store_settings`, `users` (berisi satu pengguna default; kolom role disiapkan untuk v1.0), `categories`, `products`, `stock_movements`, `transactions`, `transaction_items`.

**Konvensi wajib, disiapkan untuk sync v1.0:**

- Primary key UUID v7 (string), bukan auto-increment
- Semua nominal uang `int` rupiah, tidak ada `double`
- Kolom `created_at`, `updated_at`, `deleted_at` (soft delete), `synced_at` (null selama pre-launch) di setiap tabel
- `transaction_items` menyimpan snapshot nama dan harga produk saat transaksi, bukan hanya `product_id`
- Nama tabel dan kolom mengikuti skema PRD v1 agar migrasi ke PostgreSQL tinggal mapping
- Index pada `products.name`, `transactions.created_at`, `transaction_items.transaction_id`
- Migrasi skema memakai `schemaVersion` Drift dan diuji sebelum setiap rilis

**Pajak:** tarif disimpan sebagai basis poin (int, 11% = 1100) di `store_settings`. Setiap transaksi menyimpan snapshot `tax_name`, `tax_rate_bp`, `tax_inclusive`, `subtotal`, `tax_amount`, dan `total`, sehingga mengubah tarif tidak mengubah transaksi lama. Hitungan pajak ada di satu fungsi murni `calculateTax` yang dipakai keranjang, struk, dan laporan, dengan pembulatan ke rupiah terdekat.

**Checkout atomik:**

```dart
Future<String> checkout(Cart cart, Payment payment) {
  return db.transaction(() async {
    final trxId = uuidV7();
    await db.into(db.transactions).insert(/* header, nomor struk, metode */);
    for (final item in cart.items) {
      await db.into(db.transactionItems).insert(/* snapshot nama & harga */);
      final updated = await (db.update(db.products)
            ..where((p) => p.id.equals(item.productId) &
                p.stock.isBiggerOrEqualValue(item.qty)))
          .write(/* stock - qty */);
      if (updated == 0) throw OutOfStockException(item.productId);
      await db.into(db.stockMovements).insert(/* type: sale */);
    }
    return trxId;
  });
}
```

### Printer Thermal

Pembuatan isi struk dipisah dari pengiriman ke printer.

```dart
abstract class PrinterService {
  Future<List<PrinterDevice>> scan();
  Future<void> connect(PrinterDevice device);
  Future<void> printBytes(List<int> bytes);
  Stream<PrinterStatus> get status;
}

class ReceiptBuilder {
  const ReceiptBuilder({required this.paper}); // mm58 atau mm80
  final PaperSize paper;
  Future<List<int>> build(Receipt receipt) async { /* ESC/POS bytes */ }
}
```

- Alamat printer terakhir disimpan dan di-connect otomatis saat app dibuka
- Cetak berjalan di background setelah checkout selesai; UI tidak menunggu
- Gagal cetak tidak membatalkan transaksi; status tercatat dan tersedia Cetak Ulang
- Lebar kertas per tablet: 58mm sekitar 32 karakter per baris, 80mm sekitar 48
- Izin Android 12 ke atas: `BLUETOOTH_CONNECT` dan `BLUETOOTH_SCAN`, diminta di halaman Pengaturan Printer
- Hindari `blue_thermal_printer` karena sudah deprecated. Kandidat yang diuji: `unified_esc_pos_printer` dan `thermal_printer_flutter`. Keputusan akhir setelah uji dengan printer fisik milik UMKM pilot, karena banyak printer 58mm murah hanya mendukung Bluetooth Classic

**Preview struk:** `ReceiptPreview` (organism) dan `ReceiptBuilder` sama-sama membaca satu `ReceiptLayout`, yaitu daftar baris yang sudah dipotong sesuai jumlah karakter kertas. Preview dirender dengan font monospace, jadi tampilan di layar sama dengan hasil cetak. Data contoh untuk preview memakai 3 item dummy supaya pajak, total, dan kembalian ikut terlihat.

## Non-Functional Requirements

Target acuan adalah tablet Android kelas menengah dengan RAM 3 GB dan Android 10 ke atas.

| Kategori | Requirement | Cara Ukur |
| --- | --- | --- |
| Performa | Layar kasir stabil 60 fps saat scroll grid 1.000 produk | Flutter DevTools, profile mode |
| Performa | Tap produk sampai total ter-update di bawah 100ms | Profiling di tablet acuan |
| Performa | Pencarian produk di bawah 300ms untuk 1.000 produk | Uji dengan data dummy |
| Performa | Cold start sampai layar kasir di bawah 3 detik | Uji manual di tablet acuan |
| Performa | Grid pakai `GridView.builder`; gambar produk memakai `cacheWidth` sesuai ukuran tile | Code review |
| Keandalan | Nol transaksi setengah tersimpan; checkout selalu atomik | Unit test rollback |
| Keandalan | App tertutup paksa saat checkout tidak merusak data | Uji kill process |
| Keandalan | Gagal cetak tidak memengaruhi data transaksi | Uji printer dimatikan |
| Keamanan | Data hanya tersimpan di perangkat; tidak ada data yang dikirim keluar selama pre-launch | Code review |
| Keamanan | Backup berisi data penjualan, pemilik diingatkan menyimpannya di tempat aman | Teks di layar export |
| Maintainability | Atoms dan molecules punya widget test; checkout dan ReceiptBuilder punya unit test | CI lokal |
| Maintainability | Lint tanpa warning sebelum merge | `flutter analyze` |
| Usability | Area tap minimal 48x48 dp; angka total minimal 28sp | Review desain |
| Usability | Bahasa antarmuka Bahasa Indonesia, format Rp dengan titik ribuan | Review desain |

## Release Planning

Pre-launch dibagi empat fase dan setiap fase baru dimulai setelah gate sebelumnya lolos. Tanggal belum ditentukan dan menunggu estimasi tim engineering.

&#91;embedded content: roadmap pre-launch · 4 fase, 3 gate\]

Fase 4 bukan bagian pre-launch, tetapi menunjukkan bahwa kode pre-launch dipakai langsung sebagai dasar v1.0.

**Gate yang harus lolos:**

- **Gate 1, printer terpilih:** package printer lolos uji cetak di printer milik UMKM pilot, termasuk reconnect setelah printer mati
- **Gate 2, uji internal:** 500 transaksi uji tanpa data rusak; semua unit test checkout dan ReceiptBuilder hijau; target performa tercapai di tablet acuan
- **Gate 3, metrik pilot:** success metrics di bagian Product Overview tercapai selama 4 minggu

**Success Criteria Pre-Launch:**

- Minimal 3 UMKM pilot memakai aplikasi setiap hari selama 4 minggu
- Nol transaksi hilang atau stok tidak konsisten
- Design system (tokens sampai organisms) dan lapisan data siap dipakai ulang di v1.0 tanpa ditulis ulang

## Open Questions & Assumptions

### Open Questions

- **Q1:** Merk dan tipe printer thermal apa yang dipakai UMKM pilot? Bluetooth Classic atau BLE, 58mm atau 80mm?
- **Q2:** Tablet apa yang dipakai pilot (merk, RAM, versi Android)? Apakah ada pilot yang memakai iPad?
- **Q3:** Berapa jumlah produk terbanyak di antara UMKM pilot? Target performa diasumsikan 1.000 produk.
- **Q4:** Apakah semua UMKM pilot sudah punya QRIS fisik (stiker atau standee) dari bank atau penyedia pembayaran?
- **Q5:** Apakah pemilik butuh melihat laporan dari HP sendiri selama pre-launch, atau cukup di tablet?
- **Q6:** Siapa yang memasang dan melatih UMKM pilot, dan berapa lama durasi pilot?
- **Q7:** Apakah biaya layanan (service charge) juga perlu bisa diatur seperti pajak?
- **Q8:** Data pre-launch akan dimigrasikan ke server v1.0 atau mulai dari nol?

### Assumptions

- **A1:** Satu tablet melayani satu toko; tidak ada multi-device di tahap ini
- **A2:** Aplikasi berjalan sepenuhnya offline; internet tidak dibutuhkan untuk transaksi
- **A3:** Full access artinya satu pengguna mengelola semua menu tanpa PIN dan tanpa pembagian role; role owner dan kasir ditambahkan di v1.0
- **A4:** Pre-launch gratis untuk UMKM pilot; belum ada license atau subscription
- **A5:** QRIS belum terintegrasi: pelanggan scan QRIS fisik milik toko, dan app hanya mencatat transaksi setelah pengguna mengonfirmasi pembayaran sudah masuk
- **A6:** Tablet utama Android; iOS belum diuji di tahap ini
- **A7:** Skema lokal mengikuti PRD v1 agar data bisa dimigrasikan ke PostgreSQL
