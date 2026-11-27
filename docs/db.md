# Dokumentasi Database Cloud — POS UMKM Indonesia

Dokumen ini menjelaskan struktur tabel PostgreSQL pada backend cloud ([0001_init.sql](../backend/migrations/0001_init.sql)) beserta daftar kolom dan alasan keberadaan masing-masing tabel berdasarkan kebutuhan PRD v1.2 dan arsitektur offline-first pada aplikasi mobile.

## Konvensi Umum

Semua tabel menggunakan standar berikut (kolom ini ada di setiap tabel dan tidak diulang pada daftar di bawah kecuali memiliki catatan khusus):
- **`id` (`UUID PRIMARY KEY`):** Menggunakan UUID v7 agar ID bersifat unik secara global dan terurut berdasarkan waktu. Hal ini mencegah tabrakan ID saat data transaksi atau produk dari banyak perangkat cabang disinkronkan ke cloud.
- **`created_at` (`TIMESTAMPTZ NOT NULL DEFAULT now()`):** Waktu pembuatan record.
- **`updated_at` (`TIMESTAMPTZ NOT NULL DEFAULT now()`):** Waktu pembaruan terakhir record.
- **`deleted_at` (`TIMESTAMPTZ NULL`):** Penanda soft delete agar sinkronisasi penghapusan data dengan schema Drift di mobile berjalan aman.
- **Multi-Tenancy (`umkm_id`, `branch_id`):** Hampir seluruh tabel menyimpan `umkm_id` dan `branch_id` untuk memastikan isolasi data yang ketat antar UMKM dan antar cabang.

---

## 1. Tenant & Autentikasi

### `umkms`
- **Fungsi:** Menyimpan data entitas bisnis UMKM utama.
- **Alasan muncul:** Sistem bersifat multi-tenant. Satu UMKM dapat memiliki satu atau banyak cabang serta pengguna web, sehingga diperlukan entitas induk untuk mengelompokkan seluruh data bisnis.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `name` | `TEXT` | Nama usaha UMKM (`NOT NULL`) |
| `phone` | `TEXT` | Nomor telepon UMKM |
| `address` | `TEXT` | Alamat pusat UMKM |
| `is_active` | `BOOLEAN` | Status aktif UMKM (default `TRUE`) |

### `branches`
- **Fungsi:** Menyimpan daftar cabang yang dimiliki oleh sebuah UMKM.
- **Alasan muncul:** PRD mewajibkan isolasi operasional, stok, transaksi, dan langganan (subscription) per cabang.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (`NOT NULL`) |
| `name` | `TEXT` | Nama cabang (`NOT NULL`) |
| `address` | `TEXT` | Alamat cabang |
| `phone` | `TEXT` | Nomor telepon cabang |
| `is_active` | `BOOLEAN` | Status aktif cabang (default `TRUE`) |

### `web_users`
- **Fungsi:** Menyimpan akun pengguna aplikasi web (`superadmin`, `owner`, `branch_admin`) yang login menggunakan email dan password.
- **Alasan muncul:** Akses web membutuhkan autentikasi email + password berbasis JWT. Dipisah dari staf tablet karena mekanisme kredensialnya berbeda; `umkm_id` dan `branch_id` dibuat nullable agar mendukung `superadmin` (lintas UMKM), `owner` (lintas cabang dalam 1 UMKM), dan `branch_admin` (khusus 1 cabang).

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (nullable untuk `superadmin`) |
| `branch_id` | `UUID` | FK → `branches(id)` (diisi khusus `branch_admin`) |
| `name` | `TEXT` | Nama lengkap pengguna (`NOT NULL`) |
| `email` | `TEXT` | Email login, unik saat `deleted_at IS NULL` (`NOT NULL`) |
| `password_hash` | `TEXT` | Hash password (`NOT NULL`) |
| `role` | `TEXT` | `superadmin` \| `owner` \| `branch_admin` (`NOT NULL`) |
| `is_active` | `BOOLEAN` | Status aktif akun (default `TRUE`) |

### `branch_settings`
- **Fungsi:** Menyimpan konfigurasi toko per cabang (identitas struk, prefix nomor struk, reset harian, pajak custom, dan URL gambar QRIS statis).
- **Alasan muncul:** Menjadi pasangan 1-to-1 dengan `store_settings` di tablet agar pengaturan toko dan pajak dapat diatur dari web maupun tablet lalu disinkronkan. Pengaturan printer Bluetooth sengaja tidak dimasukkan karena bersifat lokal per perangkat tablet.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (`NOT NULL`) |
| `branch_id` | `UUID` | FK → `branches(id)`, unik per cabang (`NOT NULL`) |
| `setup_done` | `BOOLEAN` | Penanda wizard setup awal selesai (default `FALSE`) |
| `store_name` | `TEXT` | Nama toko yang tampil di struk (default `''`) |
| `address` | `TEXT` | Alamat toko di struk (default `''`) |
| `phone` | `TEXT` | Nomor telepon toko di struk (default `''`) |
| `receipt_header` | `TEXT` | Teks header struk (default `''`) |
| `receipt_footer` | `TEXT` | Teks footer struk (default `''`) |
| `logo_url` | `TEXT` | URL logo toko |
| `qris_image_url` | `TEXT` | URL gambar QRIS statis cabang |
| `receipt_prefix` | `TEXT` | Awalan nomor struk (default `'INV'`) |
| `daily_reset` | `BOOLEAN` | Reset nomor urut struk harian (default `TRUE`) |
| `tax_enabled` | `BOOLEAN` | Status aktif pajak custom (default `FALSE`) |
| `tax_name` | `TEXT` | Nama pajak, mis. PPN (default `'PPN'`) |
| `tax_rate_bp` | `INT` | Tarif pajak dalam basis points, mis. 1100 = 11% (default `1100`) |
| `tax_inclusive` | `BOOLEAN` | Pajak inklusif atau eksklusif (default `FALSE`) |

### `branch_staff`
- **Fungsi:** Menyimpan data operator cabang di aplikasi mobile (`branch_admin` dan `cashier`) yang login menggunakan PIN.
- **Alasan muncul:** Di tablet kasir, staf hanya diberikan PIN untuk masuk ke aplikasi dan mencatat absensi/transaksi tanpa email dan password. PIN dibuat unik per `branch_id` agar tidak terjadi bentrokan antar staf di cabang yang sama.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (`NOT NULL`) |
| `branch_id` | `UUID` | FK → `branches(id)` (`NOT NULL`) |
| `name` | `TEXT` | Nama staf/kasir (`NOT NULL`) |
| `photo_url` | `TEXT` | URL foto profil staf |
| `pin_hash` | `TEXT` | Hash PIN login, unik per `branch_id` (`NOT NULL`) |
| `role` | `TEXT` | `branch_admin` \| `cashier` (`NOT NULL`) |
| `is_active` | `BOOLEAN` | Status aktif staf (default `TRUE`) |

---

## 2. Licensing, Notifikasi & Absensi

### `subscription_transactions`
- **Fungsi:** Mencatat transaksi pembayaran langganan bulanan cabang (Rp30.000/bulan), bukti bayar, serta status konfirmasi oleh Superadmin.
- **Alasan muncul:** Dipisah dari `branch_licenses` agar riwayat penagihan dan audit pembayaran tetap rapi dan terpisah dari siklus hidup license key.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (`NOT NULL`) |
| `branch_id` | `UUID` | FK → `branches(id)` (`NOT NULL`) |
| `amount` | `INT` | Nominal pembayaran dalam Rupiah (default `30000`) |
| `payment_method` | `TEXT` | Metode transfer/pembayaran |
| `payment_proof_url` | `TEXT` | URL bukti pembayaran |
| `status` | `TEXT` | `pending` \| `confirmed` \| `rejected` (default `'pending'`) |
| `confirmed_by` | `UUID` | FK → `web_users(id)` (Superadmin yang mengonfirmasi) |
| `confirmed_at` | `TIMESTAMPTZ` | Waktu konfirmasi pembayaran |
| `notes` | `TEXT` | Catatan tambahan |

### `branch_licenses`
- **Fungsi:** Menyimpan daftar license key (active key) per cabang beserta status aktivasi dan tanggal kedaluwarsanya.
- **Alasan muncul:** Satu cabang dapat memiliki banyak license key sepanjang masa berlangganan; setiap kali license key kedaluwarsa, cabang harus memasukkan license key baru yang diterbitkan dari transaksi yang telah dikonfirmasi.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (`NOT NULL`) |
| `branch_id` | `UUID` | FK → `branches(id)` (`NOT NULL`) |
| `subscription_transaction_id` | `UUID` | FK → `subscription_transactions(id)` (`NOT NULL`) |
| `license_key` | `TEXT` | Kode aktivasi unik cabang (`NOT NULL`) |
| `status` | `TEXT` | `unused` \| `active` \| `expired` \| `revoked` (default `'unused'`) |
| `duration_days` | `INT` | Masa aktif dalam hari (default `30`) |
| `issued_by` | `UUID` | FK → `web_users(id)` (Superadmin penerbit key) |
| `activated_at` | `TIMESTAMPTZ` | Waktu key diaktifkan oleh cabang |
| `expires_at` | `TIMESTAMPTZ` | Waktu berakhirnya masa aktif license |

### `attendances`
- **Fungsi:** Mencatat waktu clock-in dan clock-out kasir per shift menggunakan PIN.
- **Alasan muncul:** Memenuhi kebutuhan absensi kasir di PRD dengan model 1 baris per shift (`business_date`, `clock_in_at`, `clock_out_at`) agar mudah diagregasi menjadi laporan jam kerja di web.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (`NOT NULL`) |
| `branch_id` | `UUID` | FK → `branches(id)` (`NOT NULL`) |
| `staff_id` | `UUID` | FK → `branch_staff(id)` (`NOT NULL`) |
| `business_date` | `DATE` | Tanggal operasional shift (`NOT NULL`) |
| `clock_in_at` | `TIMESTAMPTZ` | Waktu masuk kerja (`NOT NULL`) |
| `clock_out_at` | `TIMESTAMPTZ` | Waktu selesai kerja (nullable sebelum clock-out) |

### `notifications`
- **Fungsi:** Menyimpan riwayat notifikasi pengingat jatuh tempo subscription (5–10 hari sebelum expired) untuk kanal `web`, `tablet`, dan `email`.
- **Alasan muncul:** Memastikan pengingat perpanjangan langganan tercatat status pengiriman dan status bacanya di berbagai platform.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (`NOT NULL`) |
| `branch_id` | `UUID` | FK → `branches(id)` (nullable) |
| `license_id` | `UUID` | FK → `branch_licenses(id)` (nullable) |
| `channel` | `TEXT` | `web` \| `tablet` \| `email` (`NOT NULL`) |
| `title` | `TEXT` | Judul notifikasi (`NOT NULL`) |
| `message` | `TEXT` | Isi pesan notifikasi (`NOT NULL`) |
| `sent_at` | `TIMESTAMPTZ` | Waktu notifikasi dikirim |
| `read_at` | `TIMESTAMPTZ` | Waktu notifikasi dibaca |

### `sync_logs`
- **Fungsi:** Mencatat aktivitas sinkronisasi (`push` dan `pull`) dari setiap perangkat cabang beserta jumlah record dan status keberhasilannya.
- **Alasan muncul:** Memberikan visibilitas dan jejak audit apabila terjadi kegagalan sinkronisasi data offline dari tablet cabang ke server cloud.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (`NOT NULL`) |
| `branch_id` | `UUID` | FK → `branches(id)` (`NOT NULL`) |
| `device_id` | `TEXT` | Identifier perangkat tablet (`NOT NULL`) |
| `direction` | `TEXT` | `push` \| `pull` (`NOT NULL`) |
| `records_count` | `INT` | Jumlah data yang disinkronkan (default `0`) |
| `status` | `TEXT` | `success` \| `failed` (`NOT NULL`) |
| `error_message` | `TEXT` | Pesan error jika sinkronisasi gagal |
| `synced_at` | `TIMESTAMPTZ` | Waktu sinkronisasi dijalankan (default `now()`) |

---

## 3. POS & Inventory (Hasil Sinkronisasi Mobile)

### `categories`
- **Fungsi:** Menyimpan kategori produk per cabang.
- **Alasan muncul:** Mendukung pengelompokan produk di tablet kasir dan konsistensi relasi kategori saat data produk disinkronkan ke cloud.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (`NOT NULL`) |
| `branch_id` | `UUID` | FK → `branches(id)` (`NOT NULL`) |
| `name` | `TEXT` | Nama kategori (`NOT NULL`) |
| `active` | `BOOLEAN` | Status aktif kategori (default `TRUE`) |

### `products`
- **Fungsi:** Menyimpan katalog produk, harga, stok terkini, dan batas minimum stok per cabang.
- **Alasan muncul:** Dibutuhkan untuk sinkronisasi katalog antar perangkat cabang dan pemantauan stok oleh Owner/Admin Cabang dari web.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (`NOT NULL`) |
| `branch_id` | `UUID` | FK → `branches(id)` (`NOT NULL`) |
| `category_id` | `UUID` | FK → `categories(id)` (`NOT NULL`) |
| `name` | `TEXT` | Nama produk (`NOT NULL`) |
| `sku` | `TEXT` | Kode SKU opsional |
| `price` | `INT` | Harga satuan dalam Rupiah (`NOT NULL`) |
| `stock` | `INT` | Jumlah stok saat ini (default `0`) |
| `min_stock` | `INT` | Ambang batas stok menipis (default `0`) |
| `photo_url` | `TEXT` | URL foto produk |
| `active` | `BOOLEAN` | Status aktif produk (default `TRUE`) |

### `transactions`
- **Fungsi:** Menyimpan header transaksi penjualan dari tablet kasir (nomor struk, metode pembayaran Cash/QRIS, snapshot pajak saat transaksi, nominal bayar, kembalian, dan status).
- **Alasan muncul:** Agar riwayat penjualan dan laporan keuangan seluruh cabang dapat diakses secara terpusat di Dashboard Owner web. Nomor struk dibuat unik per kombinasi `(branch_id, receipt_no)`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (`NOT NULL`) |
| `branch_id` | `UUID` | FK → `branches(id)` (`NOT NULL`) |
| `cashier_id` | `UUID` | FK → `branch_staff(id)` (kasir yang memproses transaksi) |
| `receipt_no` | `TEXT` | Nomor struk, unik per `branch_id` (`NOT NULL`) |
| `business_date` | `DATE` | Tanggal operasional transaksi (`NOT NULL`) |
| `order_type` | `TEXT` | Tipe pesanan (default `'Dine in'`) |
| `payment_method` | `TEXT` | Metode pembayaran (`cash` / `qris`) (`NOT NULL`) |
| `subtotal` | `INT` | Subtotal sebelum pajak (`NOT NULL`) |
| `tax_name` | `TEXT` | Snapshot nama pajak saat transaksi (`NOT NULL`) |
| `tax_rate_bp` | `INT` | Snapshot tarif pajak dalam basis points (`NOT NULL`) |
| `tax_inclusive` | `BOOLEAN` | Snapshot mode pajak inklusif/eksklusif (`NOT NULL`) |
| `tax_amount` | `INT` | Nominal pajak dalam Rupiah (`NOT NULL`) |
| `total` | `INT` | Total akhir tagihan (`NOT NULL`) |
| `received` | `INT` | Nominal uang diterima (`NOT NULL`) |
| `change_amount` | `INT` | Nominal kembalian (`NOT NULL`) |
| `status` | `TEXT` | Status transaksi, mis. `completed` / `void` (default `'completed'`) |
| `void_reason` | `TEXT` | Alasan pembatalan jika void |
| `voided_at` | `TIMESTAMPTZ` | Waktu pembatalan jika void |

### `transaction_items`
- **Fungsi:** Menyimpan detail item pada setiap transaksi beserta snapshot nama dan harga produk saat transaksi terjadi.
- **Alasan muncul:** Menjaga akurasi riwayat struk dan laporan keuangan meskipun nama atau harga produk di master `products` berubah di kemudian hari.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (`NOT NULL`) |
| `branch_id` | `UUID` | FK → `branches(id)` (`NOT NULL`) |
| `transaction_id` | `UUID` | FK → `transactions(id)` (`NOT NULL`) |
| `product_id` | `UUID` | FK → `products(id)` (`NOT NULL`) |
| `product_name` | `TEXT` | Snapshot nama produk saat transaksi (`NOT NULL`) |
| `price` | `INT` | Snapshot harga satuan saat transaksi (`NOT NULL`) |
| `qty` | `INT` | Jumlah item dibeli (`NOT NULL`) |
| `line_total` | `INT` | Total harga item (`price * qty`) (`NOT NULL`) |

### `stock_movements`
- **Fungsi:** Mencatat setiap perubahan stok (penjualan, penyesuaian manual, stok masuk/keluar) lengkap dengan jumlah perubahan dan stok akhir.
- **Alasan muncul:** Memberikan audit trail pergerakan stok untuk membantu Admin Cabang dan Owner melacak selisih stok fisik dan catatan sistem.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary key |
| `umkm_id` | `UUID` | FK → `umkms(id)` (`NOT NULL`) |
| `branch_id` | `UUID` | FK → `branches(id)` (`NOT NULL`) |
| `product_id` | `UUID` | FK → `products(id)` (`NOT NULL`) |
| `staff_id` | `UUID` | FK → `branch_staff(id)` (staf yang melakukan perubahan) |
| `transaction_id` | `UUID` | FK → `transactions(id)` (jika mutasi berasal dari transaksi) |
| `type` | `TEXT` | Jenis mutasi stok (`NOT NULL`) |
| `qty_change` | `INT` | Perubahan jumlah stok (+/-) (`NOT NULL`) |
| `stock_after` | `INT` | Jumlah stok setelah mutasi (`NOT NULL`) |
| `note` | `TEXT` | Catatan mutasi |
