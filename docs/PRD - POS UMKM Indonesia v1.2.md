# PRD — POS UMKM Indonesia v1.2

Nov 20, 2026 · @Lvcid

## Product Overview

**Product Vision:** Aplikasi POS terjangkau berbasis mobile dan web untuk UMKM Indonesia, menggantikan pencatatan manual dan aplikasi crack dengan sistem kasir, manajemen stok, dan pelaporan keuangan yang terintegrasi.

**Target Users:**

- Primary: UMKM Indonesia skala kecil-menengah yang masih menggunakan pencatatan manual atau kasir konvensional
- Secondary: UMKM yang saat ini menggunakan aplikasi POS crack dengan fitur terbatas

**Business Objectives:**

- Menyediakan solusi POS legal dan terjangkau untuk segmen UMKM yang underserved
- Revenue melalui subscription Rp30.000/bulan per cabang, dibuatkan active key oleh superadmin setelah pembayaran
- Mendukung digitalisasi keuangan UMKM Indonesia

**Success Metrics:**

- Jumlah cabang UMKM aktif berlangganan
- Jumlah transaksi yang diproses per bulan
- Churn rate langganan per cabang
- Waktu onboarding UMKM baru (dari pendaftaran hingga transaksi pertama)

## User Personas

### Persona 1: Owner UMKM (Budi, 38 tahun)

- **Demographics:** Pemilik warung/toko dengan 1–5 cabang, melek teknologi dasar (WhatsApp, mobile banking), tidak memiliki latar belakang IT
- **Goals:** Memantau performa semua cabang dari satu tempat, mengetahui cabang mana yang paling menguntungkan, memastikan kasir tidak melakukan kecurangan
- **Pain Points:** Saat ini rekap penjualan dilakukan manual oleh masing-masing admin cabang dan dilaporkan via WhatsApp, data sering tidak akurat atau terlambat
- **User Journey:** Login web → lihat dashboard ringkasan penjualan semua cabang → drill down ke cabang tertentu → lihat riwayat transaksi → kelola akun admin cabang

### Persona 2: Admin Cabang (Siti, 26 tahun)

- **Demographics:** Karyawan kepercayaan owner, lulusan SMA/SMK, familiar dengan penggunaan smartphone
- **Goals:** Mengelola stok agar tidak kehabisan barang, memantau penjualan harian, melaporkan kondisi cabang ke owner
- **Pain Points:** Stok dicatat manual di buku, sering terjadi selisih antara stok fisik dan catatan, sulit mengetahui barang mana yang hampir habis
- **User Journey:** Login tablet (PIN) → cek stok barang → update stok → lihat laporan penjualan hari ini → lihat rekap keuangan cabang

### Persona 3: Kasir (Andi, 22 tahun)

- **Demographics:** Karyawan kasir, lulusan SMA, pengguna aktif smartphone
- **Goals:** Memproses transaksi dengan cepat dan tepat, meminimalisir antrian
- **Pain Points:** Proses hitung manual memakan waktu, risiko salah hitung kembalian, tidak ada bukti transaksi digital
- **User Journey:** Login app tablet dengan PIN → pilih produk → input jumlah → pilih metode pembayaran (Cash/QRIS) → transaksi selesai → cetak/kirim struk

### Persona 4: Superadmin Aplikasi (Tim Internal)

- **Demographics:** Staf internal penyedia aplikasi, melek teknologi tinggi
- **Goals:** Mengelola akun UMKM, membuat active key cabang setelah pembayaran dikonfirmasi
- **Pain Points:** Proses aktivasi masih manual, perlu sistem yang jelas untuk tracking status pembayaran per cabang
- **User Journey:** Login web admin → lihat daftar UMKM → lihat cabang yang menunggu aktivasi → konfirmasi pembayaran → buat active key cabang

## Feature Requirements

| Feature                            | Deskripsi                                                                       | User Story                                                                                                  | Prioritas | Acceptance Criteria                                                                                  | Dependensi                  |
| ---------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------- | --------------------------- |
| **Manajemen Akun UMKM**            | Superadmin membuat akun owner untuk UMKM baru                                   | As a superadmin, I want to create an owner account so that UMKM can start using the system                  | Must      | Owner dapat login; data UMKM tersimpan                                                               | -                           |
| **Aktivasi License Cabang**        | Superadmin membuat active key cabang setelah konfirmasi pembayaran subscription | As a superadmin, I want to activate a branch license so that the branch can process transactions            | Must      | License key tergenerate; cabang aktif/nonaktif sesuai status                                         | Manajemen Akun UMKM         |
| **Manajemen Cabang**               | Owner membuat dan mengelola data cabang yang dimiliki                           | As an owner, I want to manage my branches so that each branch has its own account and settings              | Must      | Cabang dapat dibuat, diedit, dinonaktifkan oleh owner                                                | Manajemen Akun UMKM         |
| **Manajemen Akun Admin Cabang**    | Owner membuat akun admin untuk masing-masing cabang                             | As an owner, I want to create branch admin accounts so that each branch has an operator                     | Must      | Admin cabang dapat login dan hanya mengakses data cabangnya sendiri                                  | Manajemen Cabang            |
| **Kasir — Transaksi**              | Kasir memproses transaksi penjualan produk                                      | As a cashier, I want to process a sale so that the customer can pay and receive a receipt                   | Must      | Transaksi tercatat; stok berkurang otomatis; struk dapat dicetak/ditampilkan                         | Manajemen Produk/Stok       |
| **Pembayaran Cash**                | Kasir memilih metode cash, sistem menghitung kembalian                          | As a cashier, I want to process a cash payment so that I can calculate the correct change                   | Must      | Nominal uang diterima diinput; kembalian tampil otomatis                                             | Kasir — Transaksi           |
| **Pembayaran QRIS**                | Kasir menampilkan QR code untuk pembayaran QRIS                                 | As a cashier, I want to display a QRIS code so that the customer can pay digitally                          | Must      | QR code tampil; kasir mengonfirmasi pembayaran QRIS secara manual sebelum transaksi dianggap selesai | Kasir — Transaksi           |
| **Manajemen Produk & Stok**        | Admin cabang mengelola daftar produk dan jumlah stok                            | As a branch admin, I want to manage products and stock so that the cashier has up-to-date items to sell     | Must      | Produk dapat ditambah/edit/hapus; stok terupdate real-time setelah transaksi                         | -                           |
| **Riwayat Penjualan Cabang**       | Admin cabang melihat riwayat transaksi harian cabang                            | As a branch admin, I want to see daily sales history so that I can monitor branch performance               | Must      | Transaksi tampil per hari; dapat difilter; total penjualan teragregasi                               | Kasir — Transaksi           |
| **Laporan Keuangan Cabang**        | Admin cabang melihat ringkasan keuangan cabang                                  | As a branch admin, I want to see branch financial data so that I can report to the owner                    | Must      | Total pendapatan, jumlah transaksi, metode pembayaran teragregasi per periode                        | Riwayat Penjualan Cabang    |
| **Dashboard Owner — Semua Cabang** | Owner melihat data penjualan dan keuangan agregat seluruh cabang                | As an owner, I want to see consolidated data across all branches so that I can compare performance          | Must      | Data semua cabang teragregasi; dapat di-drill down per cabang                                        | Laporan Keuangan Cabang     |
| **Absensi Kasir dengan PIN**       | Owner membuat PIN absensi; kasir clock-in/out menggunakan PIN                   | As an owner, I want to set up PIN-based attendance so that I can track cashier working hours                | Should    | Owner dapat membuat/reset PIN; kasir clock-in dan clock-out tercatat dengan timestamp                | Manajemen Akun Admin Cabang |
| **Riwayat Transaksi (Owner)**      | Owner melihat seluruh transaksi lintas cabang                                   | As an owner, I want to view all transactions across branches so that I can audit any suspicious activity    | Should    | Transaksi dari semua cabang tampil; dapat difilter per cabang/tanggal/kasir                          | Dashboard Owner             |
| **Notifikasi Subscription**        | Sistem mengingatkan owner/admin tentang jatuh tempo subscription cabang         | As an owner, I want to be notified before my branch subscription expires so that service is not interrupted | Should    | Notifikasi muncul 5 sampai 10 hari sebelum expired, di tablet, web, dan email                        | Aktivasi License Cabang     |

### Fitur dari Pre-Launch (dimasukkan ke v1.0)

Fitur berikut ada di PRD pre-launch dan dibawa ke v1.0. Prioritas mengikuti PRD pre-launch.

| Feature                                     | Deskripsi                                                                                       | Prioritas | Catatan v1.0                                                                                |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| **Setup Awal Toko**                         | Wizard pertama kali: nama toko, alamat, footer struk, pajak, printer                            | Must      | Dilakukan owner di web saat onboarding, dan admin cabang bisa mengubah di tablet            |
| **Pajak Custom**                            | Nama, persen, inklusif atau eksklusif, dibulatkan ke rupiah terdekat                            | Must      | Diatur admin cabang di tablet, tarif disimpan per transaksi (lihat Pengaturan Pajak)        |
| **Checkout Atomik**                         | Simpan transaksi, item, dan pengurangan stok dalam satu transaksi database                      | Must      | Nomor struk unik dan berurutan per hari per cabang                                          |
| **Cetak Struk Thermal**                     | Cetak via Bluetooth ESC/POS, 58mm atau 80mm                                                     | Must      | Jalur cetak fisik. Gagal cetak tidak membatalkan transaksi                                  |
| **Pengaturan Printer**                      | Scan, pilih, simpan, dan tes printer                                                            | Must      | Alamat printer tersimpan dan auto-connect saat app dibuka                                   |
| **Pengaturan Profil, Toko & Preview Struk** | Profil pengguna, data toko, dan preview struk sebelum cetak                                     | Must      | Preview sama dengan hasil cetak                                                             |
| **Void Transaksi**                          | Pembatalan transaksi dengan konfirmasi dan alasan, transaksi tetap tersimpan dengan status void | Should    | Ditunda. Sedang dibahas tim (izin, sync, mutasi stok, laporan, pajak, QRIS, struk WhatsApp) |
| **Backup & Export Lokal**                   | Export database ke file dan restore                                                             | Should    | File backup berisi data penjualan. Restore memvalidasi versi skema                          |

**Catatan:** Fitur Pembayaran Cash, QRIS, Pajak Custom, dan Riwayat sudah tercakup di bagian Feature Requirements dan Pengaturan Pajak. Detail di sini hanya tambahan dari pre-launch.

## User Flows

### Flow 1: Onboarding UMKM Baru

1. Superadmin menerima permintaan dari UMKM baru
2. Superadmin membuat akun Owner di panel superadmin
3. Owner menerima kredensial (email + password sementara)
4. Owner login → ganti password → buat data cabang
5. Owner membuat akun Admin Cabang untuk tiap cabang
6. Owner menginformasikan pembayaran subscription ke superadmin
7. Superadmin konfirmasi pembayaran → buat active key cabang
8. Cabang aktif → Admin Cabang dan Kasir dapat mulai beroperasi
   - _Error: Jika pembayaran belum dikonfirmasi, cabang tidak dapat diaktifkan_

### Flow 2: Transaksi Kasir (Cash)

1. Kasir membuka app Flutter di tablet
2. Login menggunakan akun kasir (atau clock-in dengan PIN absensi)
3. Pilih produk dari daftar (search atau browse kategori)
4. Input jumlah produk
5. Tambah produk lain jika perlu → review keranjang
6. Pilih metode pembayaran: **Cash**
7. Input nominal uang diterima → sistem tampilkan kembalian
8. Konfirmasi transaksi → stok berkurang otomatis
9. Tampilkan/cetak struk
   - _Error: Stok habis → sistem blokir penambahan item, tampilkan notifikasi_

### Flow 3: Transaksi Kasir (QRIS)

1. Kasir memilih produk dan review keranjang (sama seperti Flow 2 step 1–5)
2. Pilih metode pembayaran: **QRIS**
3. Sistem menampilkan gambar QRIS statis milik cabang
4. Pelanggan scan QR → melakukan pembayaran
5. Kasir mengonfirmasi pembayaran QRIS secara manual
6. Transaksi selesai → stok berkurang otomatis
7. Tampilkan/cetak struk
   - _Error: Pembayaran tidak terkonfirmasi dalam batas waktu → transaksi dibatalkan, kembali ke keranjang_

### Flow 4: Manajemen Stok (Admin Cabang)

1. Admin Cabang login ke tablet (Flutter)
2. Navigasi ke menu Produk & Stok
3. Tambah produk baru (nama, harga, stok awal, kategori) ATAU edit stok produk yang ada
4. Simpan → perubahan real-time tersedia di app kasir
   - _Error: Nama produk duplikat → sistem tampilkan peringatan_

### Flow 5: Monitoring Penjualan (Owner)

1. Owner login ke web app
2. Dashboard tampilkan ringkasan: total penjualan hari ini, perbandingan antar cabang
3. Owner pilih cabang tertentu → lihat detail penjualan cabang
4. Owner filter berdasarkan rentang tanggal
5. Owner akses laporan keuangan keseluruhan atau per cabang
6. Owner lihat riwayat transaksi dengan filter kasir/tanggal/cabang

### Flow 6: Aktivasi Subscription Bulanan

1. Cabang mendekati akhir masa aktif → sistem kirim notifikasi ke Owner (5 sampai 10 hari sebelum expired)
2. Owner melakukan pembayaran Rp30.000 per cabang ke rekening penyedia
3. Owner konfirmasi pembayaran ke superadmin (via channel yang disepakati)
4. Superadmin membuat active key untuk bulan berikutnya
5. Cabang otomatis ter-extend masa aktifnya
   - _Error: Jika tidak diperpanjang, cabang nonaktif otomatis setelah masa aktif habis_

## Technical Specifications

### Frontend — Kasir (Mobile)

- **Framework:** Flutter (Dart)
- **Target Device:** Tablet Android/iOS
- **Fitur kritis:** UI kasir full-screen landscape, integrasi QRIS display, cetak struk via Bluetooth printer

### Frontend — Owner (Web)

- **Framework:** Next.js (React)
- **Design:** Mobile-first, responsive; dioptimalkan untuk layar smartphone
- **Autentikasi:** JWT-based session via backend API

### Backend

- **Framework:** Golang (teknologi belum ditentukan — asumsi menggunakan Gin atau Echo)
- **API:** RESTful API
- **Autentikasi:** JWT
- **Multi-tenancy:** Data per UMKM dan per cabang terisolasi

### Database

- **Jenis:** Relational (PostgreSQL)
- **Skema utama:** Users, Roles, UMKM, Branches, Licenses, Products, Transactions, TransactionItems, Attendance

### Infrastructure

- **Hosting:** Belum ditentukan
- **Scaling:** Belum ditentukan
- **CI/CD:** Belum ditentukan

### Integrasi Eksternal

- QRIS: Sementara, gambar QRIS statis milik cabang. Konfirmasi pembayaran manual oleh kasir. Integrasi payment gateway belum ditentukan
- **Printer:** Bluetooth thermal printer untuk struk kasir (opsional per cabang)

### Role & Permission Matrix

Setiap platform punya pengguna dan fitur sendiri. Satu role tidak punya akses di kedua platform untuk fitur yang sama.

**Web (Superadmin dan Owner)**

- **Superadmin:** tim internal penyedia aplikasi. Membuat akun Owner untuk UMKM baru dan membuat active key cabang setelah pembayaran dikonfirmasi. Tidak mengelola data toko.
- **Owner:** mengelola cabang, membuat akun admin cabang, melihat dashboard, laporan keuangan, dan riwayat transaksi semua cabang, serta membuat PIN absensi. Tidak mengelola produk, stok, atau tarif pajak.

**Tablet (Admin Cabang dan Kasir)**

Admin dan kasir memakai device yang sama. Pergantian peran dilakukan lewat login PIN.

- **Admin Cabang:** mengelola produk dan stok, mengatur tarif pajak, melihat riwayat penjualan harian dan hari sebelumnya, serta melihat laporan keuangan cabang. Tidak bisa melihat cabang lain dan tidak mengelola akun.
- **Kasir:** memproses transaksi cash dan QRIS, serta clock-in/out absensi dengan PIN. Tidak bisa mengubah stok atau pajak, dan tidak melihat laporan keuangan.

**Catatan:**

- Owner tidak bisa melihat stok dari web, karena stok lokal untuk pengembangan sementara.
- Riwayat transaksi di web hanya berisi transaksi yang sudah tersinkron. Sync transaksi bersifat opsional, jadi data yang tampil bisa tidak lengkap.

#### Akun & Cabang

| Fitur                          | Superadmin (web) | Owner (web) | Admin Cabang (tablet) | Kasir (tablet) |
| ------------------------------ | ---------------- | ----------- | --------------------- | -------------- |
| Buat akun Owner                | ✓                | —           | —                     | —              |
| Membuat active key cabang      | ✓                | —           | —                     | —              |
| Kelola cabang                  | —                | ✓           | —                     | —              |
| Buat akun Admin Cabang         | —                | ✓           | —                     | —              |
| Dashboard semua cabang         | —                | ✓           | —                     | —              |
| Laporan keuangan semua cabang  | —                | ✓           | —                     | —              |
| Riwayat transaksi semua cabang | —                | ✓           | —                     | —              |

#### Operasional

| Fitur                           | Superadmin (web) | Owner (web) | Admin Cabang (tablet) | Kasir (tablet) |
| ------------------------------- | ---------------- | ----------- | --------------------- | -------------- |
| Buat PIN absensi                | —                | ✓           | —                     | —              |
| Kelola produk & stok            | —                | —           | ✓                     | —              |
| Pengaturan pajak                | —                | —           | ✓                     | —              |
| Laporan keuangan cabang         | —                | —           | ✓                     | —              |
| Riwayat penjualan harian cabang | —                | —           | ✓                     | —              |
| Proses transaksi kasir          | —                | —           | —                     | ✓              |
| Clock-in/out absensi            | —                | —           | —                     | ✓              |

## Release Planning

### MVP (v1.0)

**Fitur:**

- Manajemen akun (Superadmin, Owner, Admin Cabang, Kasir)
- Aktivasi cabang dengan active key (verifikasi online)
- Manajemen produk & stok (Admin Cabang)
- Transaksi kasir — Cash & QRIS (Kasir, app Flutter tablet)
- Riwayat penjualan harian cabang (Admin Cabang)
- Laporan keuangan cabang (Admin Cabang)
- Dashboard owner: ringkasan & drill-down per cabang
- Riwayat transaksi owner lintas cabang
- Absensi kasir berbasis PIN

**Timeline:** Belum ditentukan — perlu estimasi dari tim engineering

**Success Criteria MVP:**

- Minimal 5 UMKM pilot dapat beroperasi penuh menggunakan sistem
- Zero transaksi yang gagal tercatat karena bug sistem
- Subscription flow berjalan end-to-end (pembayaran → aktivasi → operasional)

### Open untuk Future Release

- Otomatisasi aktivasi subscription via payment gateway
- Laporan & export data (PDF/Excel)
- Notifikasi push untuk owner
- Multi-printer support
- Diskon & promo di kasir

## Open Questions & Assumptions

### Open Questions

- **Q1:** Integrasi payment gateway QRIS untuk v1.0 belum ditentukan (Midtrans, Xendit, atau lainnya)
- **Q2:** Channel konfirmasi pembayaran subscription dari UMKM ke superadmin belum ditentukan
- **Q3:** Apakah struk kasir hanya digital (tampil di layar) atau harus bisa dicetak via Bluetooth thermal printer?
- **Q4:** Apakah ada fitur multi-kasir per cabang? (Lebih dari satu device tablet aktif bersamaan di satu cabang)
- **Q5:** Golang framework spesifik apa yang akan digunakan? (Gin, Echo, Fiber, dll)
- **Q6:** Database cloud: PostgreSQL (sudah diputuskan). Database lokal tablet: Drift sementara
- **Q7:** Hosting/infrastructure di mana? (VPS, cloud provider, managed service)
- **Q8:** Apakah ada batas maksimum produk per cabang atau transaksi per hari pada tier subscription yang ada?
- **Q9:** Bagaimana jika cabang nonaktif karena subscription habis — data historis tetap dapat diakses owner atau terkunci?

### Assumptions

- **A1:** Kasir beroperasi secara online — tidak ada kebutuhan offline mode
- **A2:** Subscription Rp30.000/bulan adalah flat rate per cabang, tidak ada tier berbeda
- **A3:** Aktivasi cabang dilakukan dengan active key yang dibuat superadmin setelah pembayaran dikonfirmasi, dan diverifikasi online
- **A4:** Satu akun owner dapat memiliki banyak cabang
- **A5:** Admin cabang hanya dapat mengakses data cabangnya sendiri, tidak bisa lintas cabang
- **A6:** Database cloud menggunakan PostgreSQL (sudah diputuskan)
- **A7:** Golang framework diasumsikan Gin atau Echo (belum dikonfirmasi)
- **A8:** QRIS menggunakan gambar statis milik cabang (sementara; belum terintegrasi payment gateway)

## Sync & Konflik Stok

**Model operasi kasir:** Hybrid. Transaksi selalu ditulis ke database lokal (Drift) dulu, lalu di-sync ke backend saat ada koneksi.

**Aturan logout:** Kasir boleh logout paksa saat belum sync, dengan warning jumlah transaksi yang belum tersinkron. Data tetap tersimpan lokal sampai sync berhasil. Sync transaksi bersifat opsional saat online (lihat Ruang lingkup sync).

**Model stok:**

- Stok bersifat per cabang. Setiap cabang punya stok sendiri, tidak ada transfer stok antar cabang.
- Semua perubahan stok dicatat sebagai mutasi (delta, alasan, waktu, ID unik UUID v7). Tidak ada overwrite nilai stok.
- Stok = saldo awal + jumlah seluruh mutasi.
- Tidak ada pihak yang menang saat konflik. Mutasi stok hanya berasal dari tablet cabang.
- Untuk pengembangan sementara, mutasi stok tidak dikirim ke server. Sync transaksi bersifat opsional, sehingga tidak ada duplikat karena UUID v7.

**Stok negatif setelah sync:**

- Dianggap selisih dan ditandai. Flag hanya muncul di dashboard admin cabang.
- Admin cabang menandai selesai dengan mengisi catatan teks bebas (wajib).
- Sistem membuat mutasi penyesuaian otomatis yang menjadikan stok 0. Mutasi menyimpan catatan, nama admin, dan waktu.
- Transaksi penjualan yang sudah terjadi di lapangan tetap tersimpan apa adanya.

**Contoh kasus:** Stok awal 20. Tablet offline menjual 5 dan 2 (mutasi -5, -2). Admin koreksi stok fisik 3 rusak di cloud (mutasi -3). Hasil akhir 10. Tidak ada data yang dibuang.

**Catatan:** Aturan ini perlu dicek ulang saat implementasi, khususnya untuk penjualan offline yang melewati stok fisik.

## Nomor Struk & Batas Offline

**Nomor struk:** Menggunakan prefix per cabang. Setiap cabang punya prefix sendiri sehingga nomor struk antar cabang tidak bentrok.

**Batas offline:** Tidak ada batas waktu maksimal. Tablet boleh tetap offline dan beroperasi sampai kasir melakukan logout. Sync dilakukan saat logout (lihat Aturan logout di atas) dan saat online secara berkala.

**Asumsi:** Satu cabang hanya memiliki satu tablet kasir. Dengan asumsi ini, prefix per cabang sudah cukup untuk mencegah bentrok nomor struk, dan sinkronisasi antar tablet tidak diperlukan.

## Subscription & Active Key

**Model:** Subscription Rp30.000/bulan per cabang. Setiap bulan, cabang yang sudah membayar menerima active key baru dari pihak penyedia aplikasi.

**Aturan key:**

- Active key bersifat sekali pakai. Setiap key hanya berlaku untuk satu periode bulanan pada satu cabang.
- Key dibuat oleh pihak penyedia aplikasi setelah pembayaran dikonfirmasi.
- UMKM memasukkan key di aplikasi (owner atau admin cabang), lalu aplikasi memverifikasi ke server. Verifikasi memerlukan koneksi internet.

**Alur:**

1. Cabang membayar subscription bulan berjalan.
2. Penyedia aplikasi membuat active key dan mengirimkannya ke UMKM.
3. UMKM memasukkan key di aplikasi.
4. Server memverifikasi key, menandainya terpakai, dan mengaktifkan masa aktif cabang.

**Catatan:** Aturan saat key belum dimasukkan sebelum masa aktif habis, dan verifikasi saat offline setelah aktif, belum diputuskan.

**Masa aktif offline:** Setelah active key terverifikasi, cabang dapat beroperasi offline sampai tanggal expired yang dibawa key. Key memuat tanggal expired, dan aplikasi mengecek tanggal tersebut secara lokal.

**Syarat teknis:**

- Key ditandatangani secara kriptografis oleh penyedia. Public key disimpan di aplikasi sehingga tablet dapat memverifikasi key tanpa server.
- Tanggal expired dicek terhadap waktu server terakhir yang tersimpan di tablet, bukan hanya jam perangkat, untuk mencegah manipulasi jam.
- Saat tanggal expired terlewati, sistem terkunci sesuai aturan yang diputuskan.

**Kunci saat expired (asumsi, perlu konfirmasi):** Kunci total. Saat tanggal expired terlewati, kasir tidak bisa transaksi, tidak bisa melihat data, dan hanya bisa memasukkan active key baru. Data lokal tetap tersimpan utuh, dan sync data yang belum terkirim tetap diizinkan saat online.

## Login Kasir & Kredensial Offline

**Metode login:** PIN per akun. Setiap akun memiliki PIN sendiri, misalnya PIN kasir dan PIN admin berbeda.

**Penyimpanan:**

- Kredensial (PIN dalam bentuk hash) disimpan di tablet sehingga login bisa dilakukan saat offline.
- Data kredensial di tablet ikut terkunci saat masa aktif cabang expired (lihat Subscription & Active Key).

**Asumsi (perlu konfirmasi):**

- PIN berisi 4 sampai 6 digit.
- PIN unik dalam satu cabang, sehingga satu PIN hanya dimiliki satu akun di tablet tersebut.
- Setelah 5 kali salah PIN, login dikunci sementara.
- Permission akun di-cache di tablet dan diperbarui saat sync.

## Pembagian Platform per Role

- **Superadmin:** Web (Next.js). Membuat akun owner dan mengaktifkan active key cabang.
- **Owner:** Web (Next.js, mobile-first). Mengelola cabang, membuat akun admin cabang, melihat data penjualan dan keuangan semua cabang, melihat riwayat transaksi semua cabang, membuat PIN absensi.
- **Admin Cabang:** Tablet (Flutter). Mengelola stok, melihat riwayat penjualan harian cabang, melihat data keuangan cabang.
- **Kasir:** Tablet (Flutter). Transaksi, absensi dengan PIN.

**Catatan:** Admin cabang tidak menggunakan web. Fitur admin cabang di web yang tercantum sebelumnya dihapus dari scope.

## Dashboard Admin Cabang (Tablet)

Dashboard admin cabang hanya memuat tiga menu:

- **Stok:** lihat dan kelola stok produk cabang, termasuk tandai selesai untuk stok negatif hasil sync (lihat Sync & Konflik Stok).
- **Riwayat Transaksi:** default menampilkan transaksi hari ini. Pengguna bisa memilih tanggal sebelumnya untuk melihat riwayat hari-hari sebelumnya.
- **Keuangan Cabang:** ringkasan keuangan cabang per periode.

Dashboard ini tidak memuat fitur lintas cabang, manajemen akun, atau pengaturan cabang.

**Keuangan Cabang, periode:** Harian dan bulanan. Rentang tanggal bebas masuk fase berikutnya.

## Harga & Produk saat Offline

**Sumber data master produk:** Hanya tablet cabang yang mengubah produk, harga, dan kategori (role Admin Cabang). Owner dan superadmin hanya melihat, tidak mengedit produk. Karena satu cabang hanya punya satu tablet, tidak ada konflik edit data master antar perangkat.

**Harga di transaksi:** Setiap transaksi menyimpan snapshot harga saat transaksi terjadi (sesuai PRD pre-launch). Perubahan harga tidak mengubah transaksi yang sudah tercatat.

**Sinkronisasi data master:** Produk dan harga hanya berubah dari tablet, sehingga perubahan dikirim ke server saat sync. Tidak ada pull data master dari server ke tablet untuk perubahan produk.

**Asumsi (perlu konfirmasi):** Owner tidak mengubah harga atau produk dari web.

## Scope Pengembangan Sementara: Manajemen Stok

- Manajemen stok hanya dilakukan oleh admin cabang.
- Data stok disimpan di lokal (tablet).
- Asumsi: admin cabang dan kasir menggunakan satu device tablet yang sama. Pergantian peran dilakukan lewat login PIN di device tersebut.

**Catatan:** Asumsi ini menggantikan keputusan sebelumnya bahwa stok dikelola per cabang di server. Stok tidak disinkronkan ke cloud untuk pengembangan sementara.

**Ruang lingkup sync untuk pengembangan sementara:**

- **Stok:** hanya lokal di tablet. Tidak disinkronkan ke cloud.
- **Transaksi:** disinkronkan ke cloud saat tablet terhubung internet. Sifatnya opsional dan berfungsi sebagai backup data.
- **Sync transaksi tidak wajib untuk operasional kasir.** Berlaku untuk pengembangan sementara.

**Konsekuensi:**

- Dashboard owner web hanya menampilkan data transaksi yang sudah tersinkron. Data stok tidak tampil di web.
- Aturan logout paksa dengan warning (lihat Aturan logout) masih berlaku, dengan warning menghitung transaksi yang belum tersinkron.
- Karena sync bersifat opsional, transaksi yang belum tersinkron bisa tertinggal di tablet untuk jangka waktu lama. Ini perlu dipertimbangkan ulang sebelum v1.0.

**Keputusan sync transaksi (pengembangan sementara):** Opsi A. Sync transaksi tetap opsional. Warning logout paksa berfungsi sebagai pengingat jumlah transaksi yang belum tersinkron, dan tidak memblokir logout. Keputusan ini perlu dievaluasi ulang sebelum v1.0.

## Pengiriman Struk via WhatsApp (Pengembangan Sementara)

- **Metode:** Embed WhatsApp link (wa.me). Kasir menekan tombol kirim, lalu aplikasi WhatsApp terbuka dengan isi struk sudah terisi dan kasir menekan kirim.
- **Nomor tujuan:** Nomor WhatsApp konsumen yang dimasukkan kasir saat transaksi.
- **Nomor pengirim:** Nomor WhatsApp milik tablet cabang (UMKM sendiri), bukan nomor aplikasi. Ini menggantikan asumsi sebelumnya tentang WhatsApp Cloud API.
- **Tanpa nomor konsumen:** Struk tidak dikirim via WhatsApp. Kasir dapat mencetak struk ke printer thermal sebagai alternatif.
- **Offline:** Tidak berlaku. Pengiriman struk WhatsApp tidak masuk antrian dan tidak diotomatisasi.

**Catatan:** Keputusan ini khusus pengembangan sementara. Integrasi WhatsApp Cloud API atau provider pihak ketiga belum diputuskan untuk v1.0.

## Dashboard Owner (Pengembangan Sementara)

Dashboard owner untuk pengembangan sementara hanya tersedia di web. Versi mobile ditunda ke fase berikutnya.

Fitur yang tercakup di web:

- Manajemen cabang
- Manajemen akun admin cabang
- Ringkasan penjualan dan keuangan semua cabang
- Riwayat transaksi semua cabang (dari data yang sudah tersinkron)
- Pembuatan PIN absensi

Data stok tidak tampil di dashboard owner (lihat Scope Pengembangan Sementara: Manajemen Stok).

## Pengaturan Pajak

- **Pengubah tarif:** Admin cabang, dari tablet (Flutter). Owner dan superadmin hanya melihat, tidak mengubah tarif.
- **Konflik:** Tidak ada, karena hanya satu sumber perubahan per cabang.
- **Snapshot:** Setiap transaksi menyimpan tarif pajak saat transaksi terjadi (sesuai PRD pre-launch). Perubahan tarif hanya berlaku untuk transaksi setelah perubahan.
- **Offline:** Tidak ada masalah sinkronisasi tarif, karena tarif tidak berubah dari server.

**Catatan:** Owner tidak mengubah tarif pajak dari web. Asumsi ini sejalan dengan asumsi owner tidak mengubah harga atau produk (lihat Harga & Produk saat Offline).

## Peringatan Expired (Pengembangan Sementara)

- **Grace period:** Tidak ada. Kunci berlaku tepat saat tanggal expired (lihat Subscription & Active Key).
- **Peringatan:** Tablet menampilkan peringatan expired 5 sampai 10 hari sebelum tanggal expired. Peringatan muncul di aplikasi mobile (tablet), bukan di web.
- **Tujuan:** Memberi waktu admin cabang untuk membayar subscription dan memasukkan active key baru sebelum kasir terkunci.

**Peringatan untuk owner (Pengembangan Sementara):** Owner menerima peringatan expired lewat dua kanal: notifikasi di dashboard web, dan email. Waktu pengiriman sama dengan peringatan di tablet, yaitu 5 sampai 10 hari sebelum expired.

## Migrasi Data Pre-Launch ke v1.0

**Keputusan:** Migrasi sebagian (opsi B).

- **Ikut pindah:** Daftar produk, harga, dan stok saat migrasi.
- **Tidak ikut pindah:** Riwayat transaksi lama. Tetap tersimpan di tablet sebagai arsip, dapat diakses dari versi pre-launch atau format ekspor.
- **Pengaturan:** Pengaturan pajak dan printer diatur ulang di v1.0 (tarif pajak tetap dikelola admin cabang dari tablet).

**Konsekuensi:** Riwayat transaksi lama tidak masuk laporan v1.0, sehingga data penjualan di dashboard owner dimulai dari tanggal migrasi. Snapshot pajak pada transaksi lama tetap tidak berubah.

## Keputusan Teknis

- **Frontend web:** Next.js (owner dan superadmin).
- **Backend API:** Golang.
- **Frontend mobile:** Flutter (kasir dan admin cabang, tablet).
- **Database cloud:** PostgreSQL.
- **Database lokal (tablet):** Belum ditentukan. Pre-launch menggunakan Drift, keputusan final perlu dikonfirmasi.
- **QRIS:** Sementara, cabang memasukkan gambar QRIS statis yang sudah dimiliki. Tidak terintegrasi dengan merchant atau payment gateway manapun. Konfirmasi pembayaran dilakukan manual oleh kasir (sesuai PRD pre-launch).
- **Hosting:** Belum ditentukan.

**Catatan:** Keputusan QRIS statis menggantikan asumsi QRIS dinamis (A8) untuk pengembangan sementara.

**Database lokal (tablet):** Drift, untuk pengembangan sementara. Keputusan final perlu dievaluasi sebelum v1.0.

**Catatan — Hosting:** Belum ditentukan. Ditunda ke tahap berikutnya. Perlu dibahas sebelum deployment pilot.

## Riwayat Versi

**v1 (draft awal):** Sistem penuh multi-role, multi-cabang, cloud, subscription, dan dashboard owner.

**v1.1 (saat ini):**

- Digabung dengan PRD pre-launch: QRIS manual, pajak custom, dan dua jalur struk (WhatsApp dan cetak thermal).
- Kasir hybrid. Transaksi ditulis lokal lalu sync opsional. Logout paksa dengan warning.
- Stok per cabang, model mutasi, tanpa pemenang. Stok negatif setelah sync ditandai selesai oleh admin cabang.
- Stok, produk, dan pajak hanya diubah dari tablet. Stok tidak disinkronkan ke cloud untuk pengembangan sementara.
- Admin cabang di tablet. Owner di web. Superadmin di web.
- Aktivasi cabang dengan active key sekali pakai, berlaku satu bulan, dengan tanggal expired di dalam key.
- Kunci total saat expired (asumsi). Peringatan 5 sampai 10 hari sebelum expired.
- Login PIN per akun, kredensial di tablet.
- Tech stack: Next.js (web), Golang (API), Flutter (mobile), PostgreSQL (cloud), Drift (lokal sementara).
- Fitur pre-launch yang dibawa ke v1.0 ditambahkan di Feature Requirements.

**Belum diputuskan:**

- Void transaksi: menunggu keputusan tim.
- Migrasi data pre-launch: sudah diputuskan (sebagian, lihat bagian Migrasi).
- Hosting: ditunda.
- Framework Golang: belum dipilih.
- Data cabang expired di web: belum dipilih.
