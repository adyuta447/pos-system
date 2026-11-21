# PRD — POS UMKM Indonesia v1

Nov 20, 2026 · @Lvcid

## Product Overview

**Product Vision:** Aplikasi POS terjangkau berbasis mobile dan web untuk UMKM Indonesia, menggantikan pencatatan manual dan aplikasi crack dengan sistem kasir, manajemen stok, dan pelaporan keuangan yang terintegrasi.

**Target Users:**

- Primary: UMKM Indonesia skala kecil-menengah yang masih menggunakan pencatatan manual atau kasir konvensional
- Secondary: UMKM yang saat ini menggunakan aplikasi POS crack dengan fitur terbatas

**Business Objectives:**

- Menyediakan solusi POS legal dan terjangkau untuk segmen UMKM yang underserved
- Revenue melalui subscription Rp30.000/bulan per cabang, diaktivasi manual oleh superadmin setelah pembayaran
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
- **User Journey:** Login web → cek stok barang → update stok → lihat laporan penjualan hari ini → lihat rekap keuangan cabang

### Persona 3: Kasir (Andi, 22 tahun)

- **Demographics:** Karyawan kasir, lulusan SMA, pengguna aktif smartphone
- **Goals:** Memproses transaksi dengan cepat dan tepat, meminimalisir antrian
- **Pain Points:** Proses hitung manual memakan waktu, risiko salah hitung kembalian, tidak ada bukti transaksi digital
- **User Journey:** Login app tablet dengan PIN → pilih produk → input jumlah → pilih metode pembayaran (Cash/QRIS) → transaksi selesai → cetak/kirim struk

### Persona 4: Superadmin Aplikasi (Tim Internal)

- **Demographics:** Staf internal penyedia aplikasi, melek teknologi tinggi
- **Goals:** Mengelola akun UMKM, mengaktivasi/menonaktifkan langganan cabang setelah pembayaran dikonfirmasi
- **Pain Points:** Proses aktivasi masih manual, perlu sistem yang jelas untuk tracking status pembayaran per cabang
- **User Journey:** Login web admin → lihat daftar UMKM → lihat cabang yang menunggu aktivasi → konfirmasi pembayaran → aktifkan license key cabang

## Feature Requirements

| Feature | Deskripsi | User Story | Prioritas | Acceptance Criteria | Dependensi |
| --- | --- | --- | --- | --- | --- |
| **Manajemen Akun UMKM** | Superadmin membuat akun owner untuk UMKM baru | As a superadmin, I want to create an owner account so that UMKM can start using the system | Must | Owner dapat login; data UMKM tersimpan | - |
| **Aktivasi License Cabang** | Superadmin mengaktifkan/menonaktifkan cabang setelah konfirmasi pembayaran subscription | As a superadmin, I want to activate a branch license so that the branch can process transactions | Must | License key tergenerate; cabang aktif/nonaktif sesuai status | Manajemen Akun UMKM |
| **Manajemen Cabang** | Owner membuat dan mengelola data cabang yang dimiliki | As an owner, I want to manage my branches so that each branch has its own account and settings | Must | Cabang dapat dibuat, diedit, dinonaktifkan oleh owner | Manajemen Akun UMKM |
| **Manajemen Akun Admin Cabang** | Owner membuat akun admin untuk masing-masing cabang | As an owner, I want to create branch admin accounts so that each branch has an operator | Must | Admin cabang dapat login dan hanya mengakses data cabangnya sendiri | Manajemen Cabang |
| **Kasir — Transaksi** | Kasir memproses transaksi penjualan produk | As a cashier, I want to process a sale so that the customer can pay and receive a receipt | Must | Transaksi tercatat; stok berkurang otomatis; struk dapat dicetak/ditampilkan | Manajemen Produk/Stok |
| **Pembayaran Cash** | Kasir memilih metode cash, sistem menghitung kembalian | As a cashier, I want to process a cash payment so that I can calculate the correct change | Must | Nominal uang diterima diinput; kembalian tampil otomatis | Kasir — Transaksi |
| **Pembayaran QRIS** | Kasir menampilkan QR code untuk pembayaran QRIS | As a cashier, I want to display a QRIS code so that the customer can pay digitally | Must | QR code tampil; status pembayaran terkonfirmasi sebelum transaksi dianggap selesai | Kasir — Transaksi |
| **Manajemen Produk & Stok** | Admin cabang mengelola daftar produk dan jumlah stok | As a branch admin, I want to manage products and stock so that the cashier has up-to-date items to sell | Must | Produk dapat ditambah/edit/hapus; stok terupdate real-time setelah transaksi | - |
| **Riwayat Penjualan Cabang** | Admin cabang melihat riwayat transaksi harian cabang | As a branch admin, I want to see daily sales history so that I can monitor branch performance | Must | Transaksi tampil per hari; dapat difilter; total penjualan teragregasi | Kasir — Transaksi |
| **Laporan Keuangan Cabang** | Admin cabang melihat ringkasan keuangan cabang | As a branch admin, I want to see branch financial data so that I can report to the owner | Must | Total pendapatan, jumlah transaksi, metode pembayaran teragregasi per periode | Riwayat Penjualan Cabang |
| **Dashboard Owner — Semua Cabang** | Owner melihat data penjualan dan keuangan agregat seluruh cabang | As an owner, I want to see consolidated data across all branches so that I can compare performance | Must | Data semua cabang teragregasi; dapat di-drill down per cabang | Laporan Keuangan Cabang |
| **Absensi Kasir dengan PIN** | Owner membuat PIN absensi; kasir clock-in/out menggunakan PIN | As an owner, I want to set up PIN-based attendance so that I can track cashier working hours | Should | Owner dapat membuat/reset PIN; kasir clock-in dan clock-out tercatat dengan timestamp | Manajemen Akun Admin Cabang |
| **Riwayat Transaksi (Owner)** | Owner melihat seluruh transaksi lintas cabang | As an owner, I want to view all transactions across branches so that I can audit any suspicious activity | Should | Transaksi dari semua cabang tampil; dapat difilter per cabang/tanggal/kasir | Dashboard Owner |
| **Notifikasi Subscription** | Sistem mengingatkan owner/admin tentang jatuh tempo subscription cabang | As an owner, I want to be notified before my branch subscription expires so that service is not interrupted | Should | Notifikasi muncul H-7 dan H-1 sebelum jatuh tempo | Aktivasi License Cabang |

## User Flows

### Flow 1: Onboarding UMKM Baru

1. Superadmin menerima permintaan dari UMKM baru
2. Superadmin membuat akun Owner di panel superadmin
3. Owner menerima kredensial (email + password sementara)
4. Owner login → ganti password → buat data cabang
5. Owner membuat akun Admin Cabang untuk tiap cabang
6. Owner menginformasikan pembayaran subscription ke superadmin
7. Superadmin konfirmasi pembayaran → aktifkan license cabang → generate license key
8. Cabang aktif → Admin Cabang dan Kasir dapat mulai beroperasi
   - *Error: Jika pembayaran belum dikonfirmasi, cabang tidak dapat diaktifkan*

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
   - *Error: Stok habis → sistem blokir penambahan item, tampilkan notifikasi*

### Flow 3: Transaksi Kasir (QRIS)

1. Kasir memilih produk dan review keranjang (sama seperti Flow 2 step 1–5)
2. Pilih metode pembayaran: **QRIS**
3. Sistem generate dan tampilkan QR code
4. Pelanggan scan QR → melakukan pembayaran
5. Sistem menerima konfirmasi pembayaran
6. Transaksi selesai → stok berkurang otomatis
7. Tampilkan/cetak struk
   - *Error: Pembayaran tidak terkonfirmasi dalam batas waktu → transaksi dibatalkan, kembali ke keranjang*

### Flow 4: Manajemen Stok (Admin Cabang)

1. Admin Cabang login ke web app
2. Navigasi ke menu Produk & Stok
3. Tambah produk baru (nama, harga, stok awal, kategori) ATAU edit stok produk yang ada
4. Simpan → perubahan real-time tersedia di app kasir
   - *Error: Nama produk duplikat → sistem tampilkan peringatan*

### Flow 5: Monitoring Penjualan (Owner)

1. Owner login ke web app
2. Dashboard tampilkan ringkasan: total penjualan hari ini, perbandingan antar cabang
3. Owner pilih cabang tertentu → lihat detail penjualan cabang
4. Owner filter berdasarkan rentang tanggal
5. Owner akses laporan keuangan keseluruhan atau per cabang
6. Owner lihat riwayat transaksi dengan filter kasir/tanggal/cabang

### Flow 6: Aktivasi Subscription Bulanan

1. Cabang mendekati akhir masa aktif → sistem kirim notifikasi ke Owner (H-7 dan H-1)
2. Owner melakukan pembayaran Rp30.000 per cabang ke rekening penyedia
3. Owner konfirmasi pembayaran ke superadmin (via channel yang disepakati)
4. Superadmin verifikasi → aktifkan license bulan berikutnya di panel
5. Cabang otomatis ter-extend masa aktifnya
   - *Error: Jika tidak diperpanjang, cabang nonaktif otomatis setelah masa aktif habis*

## Technical Specifications

### Frontend — Kasir (Mobile)

- **Framework:** Flutter (Dart)
- **Target Device:** Tablet Android/iOS
- **Fitur kritis:** UI kasir full-screen landscape, integrasi QRIS display, cetak struk via Bluetooth printer

### Frontend — Owner & Admin Cabang (Web)

- **Framework:** Next.js (React)
- **Design:** Mobile-first, responsive; dioptimalkan untuk layar smartphone
- **Autentikasi:** JWT-based session via backend API

### Backend

- **Framework:** Golang (teknologi belum ditentukan — asumsi menggunakan Gin atau Echo)
- **API:** RESTful API
- **Autentikasi:** JWT
- **Multi-tenancy:** Data per UMKM dan per cabang terisolasi

### Database

- **Jenis:** Relational (PostgreSQL — asumsi; belum dikonfirmasi)
- **Skema utama:** Users, Roles, UMKM, Branches, Licenses, Products, Transactions, TransactionItems, Attendance

### Infrastructure

- **Hosting:** Belum ditentukan
- **Scaling:** Belum ditentukan
- **CI/CD:** Belum ditentukan

### Integrasi Eksternal

- **QRIS:** Integrasi payment gateway untuk generate QR dan receive callback konfirmasi pembayaran (provider belum ditentukan)
- **Printer:** Bluetooth thermal printer untuk struk kasir (opsional per cabang)

### Role & Permission Matrix

| Fitur | Superadmin | Owner | Admin Cabang | Kasir |
| --- | --- | --- | --- | --- |
| Buat akun Owner | ✓ | — | — | — |
| Aktivasi license cabang | ✓ | — | — | — |
| Kelola cabang | — | ✓ | — | — |
| Buat akun Admin Cabang | — | ✓ | — | — |
| Dashboard semua cabang | — | ✓ | — | — |
| Laporan keuangan semua cabang | — | ✓ | — | — |
| Riwayat transaksi semua cabang | — | ✓ | — | — |
| Buat PIN absensi | — | ✓ | — | — |
| Kelola produk & stok | — | — | ✓ | — |
| Laporan keuangan cabang | — | — | ✓ | — |
| Riwayat penjualan harian cabang | — | — | ✓ | — |
| Proses transaksi kasir | — | — | — | ✓ |
| Clock-in/out absensi | — | — | — | ✓ |

## Release Planning

### MVP (v1.0)

**Fitur:**

- Manajemen akun (Superadmin, Owner, Admin Cabang, Kasir)
- Aktivasi license cabang oleh Superadmin (manual)
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

- **Q1:** Provider QRIS mana yang akan digunakan? (Midtrans, Xendit, atau agregator QRIS lain)
- **Q2:** Bagaimana channel konfirmasi pembayaran subscription dari UMKM ke superadmin? (WhatsApp, email, form internal?)
- **Q3:** Apakah struk kasir hanya digital (tampil di layar) atau harus bisa dicetak via Bluetooth thermal printer?
- **Q4:** Apakah ada fitur multi-kasir per cabang? (Lebih dari satu device tablet aktif bersamaan di satu cabang)
- **Q5:** Golang framework spesifik apa yang akan digunakan? (Gin, Echo, Fiber, dll)
- **Q6:** Database apa yang akan digunakan? (PostgreSQL diasumsikan, belum dikonfirmasi)
- **Q7:** Hosting/infrastructure di mana? (VPS, cloud provider, managed service)
- **Q8:** Apakah ada batas maksimum produk per cabang atau transaksi per hari pada tier subscription yang ada?
- **Q9:** Bagaimana jika cabang nonaktif karena subscription habis — data historis tetap dapat diakses owner atau terkunci?

### Assumptions

- **A1:** Kasir beroperasi secara online — tidak ada kebutuhan offline mode
- **A2:** Subscription Rp30.000/bulan adalah flat rate per cabang, tidak ada tier berbeda
- **A3:** Aktivasi license oleh superadmin dilakukan secara manual (belum ada payment gateway otomatis di MVP)
- **A4:** Satu akun owner dapat memiliki banyak cabang
- **A5:** Admin cabang hanya dapat mengakses data cabangnya sendiri, tidak bisa lintas cabang
- **A6:** Database menggunakan PostgreSQL (belum dikonfirmasi — perlu validasi tim)
- **A7:** Golang framework diasumsikan Gin atau Echo (belum dikonfirmasi)
- **A8:** QRIS menggunakan static atau dynamic QR yang di-generate per transaksi (dynamic — asumsi lebih aman dan akurat)
