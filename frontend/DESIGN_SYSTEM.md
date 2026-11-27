# DESIGN SYSTEM — "Spark Pixel" Sales Dashboard

> Dokumen ini diekstrak dari satu screenshot dashboard (frame 1200×900).
> Tujuan: dipakai AI/agent di workspace untuk **mereplikasi UI ini 1:1** (warna, layout, tipografi, komponen, chart) beserta boilerplate kodenya.
> Bahasa UI di halaman: **Inggris** (copy harus persis). Bahasa dokumen: Indonesia.

---

## 0. INSTRUKSI UNTUK AI (BACA DULU)

1. Ikuti dokumen ini sebagai **sumber kebenaran**. Jangan menambahkan warna aksen, gradien dekoratif, atau ikon berwarna di luar yang tertulis.
2. Karakter visual = **monokrom hangat (warm-neutral grayscale)** + hanya 2 warna semantik kecil (hijau untuk positif/sukses, oranye-kuning untuk pending). Hitam pekat dipakai sebagai "warna aksen" (tombol utama, bar chart, titik legend).
3. Pola struktur khas: **"tray-in-card"** — panel luar abu-hangat tipis, berisi kartu dalam putih berborder halus. Ini dipakai di KPI, Sales Trend, Revenue Breakdown, dan Recent Transactions.
4. **Semua angka/data pakai font monospace**; label section & header kolom = **monospace UPPERCASE kecil**; teks UI lain = sans-serif.
5. Nilai ukuran di dokumen ini sudah dikonversi ke **frame desktop 1440px** (nilai di screenshot × 1.2, dibulatkan). Jika ingin 1:1 dengan screenshot 1200px, bagi semua px dengan 1.2.
6. Hal yang **tidak terlihat** di screenshot (hover, focus, disabled, dsb.) ditandai **[INFERRED]** — dibuat masuk akal mengikuti sistem.
7. Nilai hex adalah **estimasi dari pixel-sampling visual** (screenshot terkompresi). Pakai token apa adanya; jangan "memperbaiki" jadi warna lain.

Stack yang disarankan di boilerplate (Bagian 8): **Vite + React 18 + TypeScript + Tailwind CSS 3 + lucide-react**. Struktur komponen bisa dipindah ke Next.js/Vue dengan mudah karena logika chart adalah SVG murni.

---

## 1. RINGKASAN KARAKTER DESAIN

| Aspek | Keputusan |
|---|---|
| Mood | Tenang, editorial, "tool profesional", minimalis, sedikit teknis (mono) |
| Palet | Off-white hangat + abu hangat + hitam pekat. Aksen = hitam |
| Semantik | Hijau (success/positif), kuning-oranye (pending), abu (refunded/netral) |
| Tipografi | Sans modern (Geist/Inter) + Mono (Geist Mono/JetBrains Mono) |
| Bentuk | Radius sedang-besar (8–14px), pill penuh untuk badge & segmented |
| Depth | Hampir flat. Border 1px halus + inner highlight putih + shadow sangat tipis |
| Chart | **Pixel/block matrix** (kotak-kotak kecil) untuk Sales Trend; **bar berpasangan hitam + abu** untuk Revenue Breakdown; **sparkline bar tipis** di KPI |
| Densitas | Padat tapi lega: banyak kartu, tapi padding konsisten |

---

## 2. DESIGN TOKENS

### 2.1 Warna

#### Surface / Background
| Token | Hex | Dipakai untuk |
|---|---|---|
| `--bg-canvas` | `#E6E6E4` | Latar luar di belakang window aplikasi |
| `--bg-app` | `#FFFFFF` | Area utama (topbar + content) |
| `--bg-sidebar` | `#F6F5F3` | Sidebar |
| `--bg-tray` | `#F4F3F1` | Panel luar ("tray") yang membungkus kartu putih |
| `--bg-card` | `#FFFFFF` | Kartu dalam, tabel, input putih, tombol outline |
| `--bg-muted` | `#F0EFED` | Input search, track segmented control, workspace switcher (lebih gelap: `#E9E8E6`), banner AI insight, header tooltip |
| `--bg-hover` | `#EDECE9` | **[INFERRED]** hover item nav / row / ghost button |
| `--bg-switcher` | `#E9E8E6` | Kartu workspace switcher di atas sidebar |

#### Border / Line
| Token | Hex | Dipakai untuk |
|---|---|---|
| `--line-subtle` | `#ECEBE8` | Border kartu dalam, garis antar row tabel |
| `--line` | `#E0DFDB` | Border input, tombol outline, divider sidebar, border badge |
| `--line-strong` | `#CFCDC8` | Checkbox border, gridline dotted chart, bar sparkline non-aktif |
| `--line-white` | `#FFFFFF` | Border 1px putih di tepi tray (efek "bezel" terang) |

#### Text
| Token | Hex | Dipakai untuk |
|---|---|---|
| `--ink` | `#111110` | Teks utama, angka besar, judul, nama customer |
| `--ink-2` | `#55544F` | Label KPI, label group sidebar ("Main Menu"), header kolom |
| `--ink-3` | `#8B8A85` | Menu nav non-aktif, label sekunder, placeholder, "last year", unit ("Orders") |
| `--ink-4` | `#B8B7B2` | Ikon info (ⓘ), ID transaksi, tick axis, ikon KPI footer, disabled |

#### Chart
| Token | Hex | Dipakai untuk |
|---|---|---|
| `--chart-ink` | `#141414` | Sel "Existing User" (hitam), bar utama Revenue Breakdown, dot legend aktif, garis marker |
| `--chart-new` | `#DEDEDB` | Sel "New User" (abu terang) & bar abu di belakang |
| `--chart-empty` | `#F2F2F0` | Sel kosong di matrix (latar grid) |
| `--chart-grid` | `#D2D1CD` | Gridline dotted horizontal Revenue Breakdown |
| `--chart-spark` | `#D6D5D2` | Bar sparkline non-highlight di KPI |

#### Semantik
| Token | Hex | Dipakai untuk |
|---|---|---|
| `--success` | `#1F9D63` | Ikon status Success |
| `--success-ink` | `#18794D` | Teks "+0,94" & teks badge Success |
| `--warning` | `#E5A71B` | Ikon status Pending |
| `--warning-ink` | `#B7830F` | Teks badge Pending |
| `--neutral-status` | `#9A9993` | Ikon & teks status Refunded |
| `--presence` | `#22C55E` | Dot online di avatar user card |

#### Tombol gelap (Export CSV)
| Token | Hex |
|---|---|
| `--btn-dark-top` | `#3A3A38` |
| `--btn-dark-bottom` | `#1B1B1A` |
| `--btn-dark-border` | `#111110` |
| `--btn-dark-highlight` | `rgba(255,255,255,0.18)` (inset 1px atas) |

### 2.2 Tipografi

| Peran | Font (urutan fallback) |
|---|---|
| Sans (UI) | `'Geist', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif` |
| Mono (angka, label) | `'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', monospace` |

Muat via Google Fonts / `@fontsource`: `Geist`, `Geist Mono` (atau fallback `Inter` + `JetBrains Mono`).

#### Type scale (px @ frame 1440)

| Style | Font | Size / Line | Weight | Letter-spacing | Case | Warna | Dipakai |
|---|---|---|---|---|---|---|---|
| `display-h1` | Sans | 24 / 32 | 500 | -0.01em | Normal | `--ink` | "Welcome back, Salung" |
| `metric-xl` | Mono | 24 / 24 | 700 | -0.01em | Normal | `--ink` | `$20,320`, `10,320`, `4,305`, `3.9%` (KPI & chart header) |
| `metric-lg` | Mono | 24 / 24 | 700 | -0.01em | Normal | `--ink` | `$20,320` di Sales Trend & Revenue Breakdown |
| `label-mono` | Mono | 12 / 16 | 500 | 0.04em | UPPER | `--ink-2` | "TOTAL REVENUE", "NEW USER", header tabel |
| `section-mono` | Mono | 12 / 16 | 500 | 0.06em | UPPER | `--ink-3` | "SALES TREND", "REVENUE BREAKDOWN", "RECENT TRANSACTIONS" |
| `nav` | Sans | 14 / 20 | 500 | 0 | Normal | `--ink-3` (aktif: `--ink`) | Item sidebar |
| `nav-group` | Sans | 12 / 16 | 500 | 0 | Normal | `--ink-2` | "Main Menu", "Customers", "Management", "Settings" |
| `body` | Sans | 13 / 20 | 400–500 | 0 | Normal | `--ink` | Nama customer, produk, tombol |
| `caption` | Sans | 12 / 16 | 400 | 0 | Normal | `--ink-3` | "Total Revenue :", "Revenue by Category", "last year", unit |
| `axis` | Mono | 11 / 12 | 400 | 0.02em | UPPER (bulan) / normal (angka) | `--ink-3` | Label axis chart |
| `axis-active` | Mono | 11 / 12 | 700 | 0.02em | UPPER | `--ink` | "JUN" aktif |
| `table-mono` | Mono | 13 / 20 | 400 | 0 | Normal | `--ink` | QTY, Unit Price, Total Revenue (Total = weight 500) |
| `badge` | Sans | 12 / 16 | 500 | 0 | Normal | semantik | Status pill |
| `kbd` | Sans/Mono | 11 / 12 | 500 | 0 | Normal | `--ink-3` | ⌘ K |

Aturan: **semua angka uang/jumlah = mono**, tapi nama manusia/produk = sans. Gunakan `font-variant-numeric: tabular-nums`.

### 2.3 Spacing (basis 4px)

`2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32`
- Gap antar kartu/grid: **14px**
- Padding halaman (content area): **18–20px**
- Padding dalam kartu: **16px** (KPI), **16–20px** (chart card)
- Padding tray (jarak tray → kartu dalam): **3px** (+ 1px border putih)
- Tinggi baris nav: **30px** (gap 2px → pitch 32px)

### 2.4 Radius

| Token | px | Dipakai |
|---|---|---|
| `--r-window` | 20 | Window utama aplikasi |
| `--r-tray` | 14 | Tray luar (KPI/Panel) |
| `--r-card` | 12 | Kartu dalam putih |
| `--r-ctrl` | 10 | Tombol, input, date pill, segmented track, workspace switcher |
| `--r-sm` | 8 | Item nav aktif, avatar kotak, icon button, banner AI, segmented item aktif |
| `--r-xs` | 6 | Tombol "···" di row, header tooltip, checkbox (4px) |
| `--r-full` | 999 | Badge status, sparkline bar, dot, tombol "···" bulat di header panel |

### 2.5 Border & Shadow

```css
--shadow-window: 0 24px 64px rgba(17,17,16,0.10), 0 2px 6px rgba(17,17,16,0.04);
--shadow-card:   0 1px 2px rgba(17,17,16,0.04);                 /* tombol outline, item nav aktif, segmented aktif */
--shadow-pop:    0 10px 28px rgba(17,17,16,0.12), 0 0 0 1px var(--line); /* tooltip chart, dropdown */
--bezel-tray:    inset 0 1px 0 rgba(255,255,255,0.9);          /* highlight atas tray */
```
- Border window: `1px solid #FFFFFF` (terlihat sebagai tepi putih terang di atas canvas abu).
- Tray: `1px solid #FFFFFF` + `box-shadow: 0 0 0 1px var(--line-subtle)` (ring tipis di luar).
- Kartu dalam: `1px solid var(--line-subtle)`.

### 2.6 Ikon
- Library: **lucide-react**, stroke **1.5px**, ukuran default **16px** (nav), **14px** (info, chevron kecil, kpi footer), **18px** (topbar).
- Warna ikon nav non-aktif `--ink-3`; aktif `--ink` (**varian filled/solid** untuk Dashboard aktif — pakai `fill="currentColor"` pada ikon `LayoutDashboard`/`House`).
- Tombol "info" (ⓘ) = `Info` 14px `--ink-4`.

### 2.7 Motion **[INFERRED]**
- Transisi UI: `120ms ease-out` (background, color, border).
- Segmented control: item aktif berpindah dengan `150ms`.
- Tooltip chart: fade `100ms`. Tidak ada animasi entrance berlebihan.
- Hormati `prefers-reduced-motion`.

---

## 3. LAYOUT

### 3.1 Wireframe global (frame 1440 × ~1080)

```
canvas (#E6E6E4, padding ~32px)
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ WINDOW (radius 20, border putih, shadow-window)                                          │
│┌───────────────┬─────────────────────────────────────────────────────────────────────────┐│
││ SIDEBAR 240   │ TOPBAR h56  (border-bottom --line)                                      ││
││ bg #F6F5F3    │ Dashboard › Overview            [🔍 Search...  ⌘K] [🔔] [📥] [avatar]  ││
││ border-r      ├─────────────────────────────────────────────────────────────────────────┤│
││ ┌───────────┐ │ CONTENT (padding 18–20, scroll-y)                                       ││
││ │Workspace  │ │ Welcome back, Salung              [Daily ⌄│📅 6 Nov 2025] [Export CSV]││
││ └───────────┘ │                                                                         ││
││ Main Menu     │ ┌KPI──────┐┌KPI──────┐┌KPI──────┐┌KPI──────┐   (grid 4 col, gap 14)    ││
││  Dashboard ●  │ │label    ││         ││         ││         │                            ││
││  Products     │ │$20,320 ▌▌││         ││         ││         │                            ││
││  Transactions │ │▲ +0,94  ││         ││         ││         │                            ││
││  Reports...   │ └─────────┘└─────────┘└─────────┘└─────────┘                            ││
││  Messages     │ ┌SALES TREND (2.2fr)─────────────────────┐┌REVENUE BREAKDOWN (1fr)──┐ ││
││  Team Perf.   │ │ Total Revenue $20,320  ○NEW ●EXISTING  ││ Revenue by Category     │ ││
││  Campaigns    │ │ [Weekly|Monthly|Yearly]                ││ $20,320   [Jan1–Aug30 ⌄]│ ││
││ ───────────   │ │ ▒▒ pixel matrix 60 col × 25 row ▒▒     ││ [✦ Get AI insight... →] │ ││
││ Customers     │ │ 60k…0k  JAN·FEB·…·DEC                  ││ ▌▌▌ grouped bars ▌▌▌    ││ ││
││  Customer List│ │                                        ││ 1 JAN ····· 30 JAN 2025 │ ││
││  Channels     │ └────────────────────────────────────────┘└─────────────────────────┘ ││
││  Order Mgmt   │ ┌RECENT TRANSACTIONS────────── [🔍 Search transactions...] [+ Add] [···]┐││
││ ───────────   │ │ ☐ ID  CUSTOMER  PRODUCT  STATUS  QTY  UNIT PRICE  TOTAL REVENUE ACTIONS││
││ Management    │ │ ☐ #04910 Ryan...  Ergo...  ✓Success 12 $3,450  $41,400   [···]        ││
││  Roles & Perm │ │ ☐ #04911 ...                                                         ││
││  Billing...   │ │ ☐ #04912 ...                                                         ││
││  Integrations │ │ ☐ #04913 ... (fade-out ke bawah)                                     ││
││ ───────────   │ └──────────────────────────────────────────────────────────────────────┘││
││ Settings      │                                                                         ││
││  Cust. Support│                                                                         ││
││  Help Center  │                                                                         ││
││  System Sett. │                                                                         ││
││ ┌───────────┐ │                                                                         ││
││ │User card ⌄│ │                                                                         ││
││ └───────────┘ │                                                                         ││
│└───────────────┴─────────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Dimensi region (frame 1440)

| Region | Ukuran |
|---|---|
| Window | max-width 1440; di screenshot menempati ~94% lebar canvas, margin ±46px kiri/kanan, ±60px atas/bawah |
| Sidebar | width **240**, padding **14**, border-right `1px --line` |
| Topbar | height **56**, padding-x **18**, border-bottom `1px --line` |
| Content | padding **18** (kiri/kanan/atas), gap vertikal antar blok **14** |
| Page header | tinggi ~44; margin-bottom ~14 |
| KPI grid | 4 kolom sama lebar, gap 14, tinggi kartu ≈ **115** |
| Row tengah | `grid-template-columns: 2.2fr 1fr`, gap 14, tinggi ≈ **436** |
| Sales Trend | ≈ 728 × 436 |
| Revenue Breakdown | ≈ 330 × 436 |
| Recent Transactions | lebar penuh; header tray 40; header kolom 36; row 41; tabel terpotong & di-fade di bawah |

### 3.3 Hirarki z-axis
Canvas → Window → (Sidebar | Main) → Tray → Kartu dalam → Kontrol → Tooltip/Popover (`--shadow-pop`).

---

## 4. SPESIFIKASI KOMPONEN

### 4.1 Sidebar

**Container**: `bg --bg-sidebar`, `border-right 1px --line`, padding 14, flex column, tinggi penuh. Bagian nav scroll sendiri; user card menempel di bawah.

**A. Workspace Switcher** (atas)
- Kartu: `bg --bg-switcher (#E9E8E6)`, radius 10, padding 8×10, flex center, gap 10, tinggi ~52.
- Logo: kotak 32×32, radius 8, **hitam `#111`**, ikon "S" putih (logo stylized).
- Teks 2 baris: "Agency" (caption 11px, `--ink-3`) di atas; "Spark Pixel Team" (13px, weight 600, `--ink`) di bawah.
- Kanan: ikon `ChevronsUpDown` 14px `--ink-3`.

**B. Nav group** (4 group)
- Judul group: `nav-group` (12px/500/`--ink-2`), padding `0 8px 8px`, margin-top group 14.
- Antar group: divider `1px solid --line` + padding vertikal 12 (tidak ada divider antara switcher dan "Main Menu").
- Item: tinggi **30**, padding-x 10, radius 8, gap 10, ikon 16px + label `nav`.
  - **Default**: teks `--ink-3`, ikon `--ink-3`, bg transparan.
  - **Aktif** (Dashboard): `bg #FFFFFF`, `border 1px --line-subtle`, `shadow-card`, teks `--ink` weight 500, ikon `--ink` (filled).
  - **Hover [INFERRED]**: `bg --bg-hover`, teks `--ink`.
  - **Focus-visible [INFERRED]**: ring 2px `--ink` offset 2.

**C. User card** (bawah)
- Kartu putih, `border 1px --line`, radius 10, padding 8, flex center gap 10, tinggi ~52.
- Avatar foto 32×32 radius 8 (foto orang, kotak rounded), dot presence 8px `--presence` dengan ring putih 2px di kanan-bawah.
- Teks: "Salung Prastyo" (13px/600/`--ink`), "Sales Operator" (11px/`--ink-3`).
- Kanan: `ChevronDown` 14px `--ink-3`.

### 4.2 Topbar
- **Breadcrumb**: `Dashboard` (`--ink-3`, 13px) · `ChevronRight` 14px `--ink-4` · `Overview` (`--ink`, 13px, weight 500).
- **Search input** (kanan, lebar ≈ 330): `bg --bg-muted`, radius 10, tinggi 32, padding-x 12; ikon `Search` 16px `--ink-3`; placeholder "Search..." (`--ink-3`); di kanan dua chip kbd `⌘` dan `K` (kotak 20×20, radius 5, `bg #FFFFFF`, border `--line`, teks 11px `--ink-3`).
- **Icon button** (Bell, Inbox): 32×32, radius 8, `bg #FFFFFF`, `border --line`, ikon 16px `--ink-2`. Gap 8.
- **Avatar**: 32×32, radius 8 (kotak rounded), foto.
- Urutan kanan: Search → Bell → Inbox → Avatar, gap 8.

### 4.3 Page Header
- Kiri: `h1` "Welcome back, Salung" — `display-h1`.
- Kanan (gap 8, tinggi 36):
  1. **Select "Daily ⌄"** dan **Date pill "📅 6 Nov 2025"** menyatu sebagai satu grup: dua segmen putih, border `--line` bersama, radius 10 di ujung luar, separator `1px --line` di tengah. Segmen kiri: teks "Daily" 13px + `ChevronDown` 14px `--ink-3`. Segmen kanan: `CalendarDays` 14px `--ink-3` + "6 Nov 2025" (13px `--ink`).
  2. **Button "Export CSV"** — varian dark: gradient vertikal `--btn-dark-top → --btn-dark-bottom`, border `--btn-dark-border`, inset highlight `rgba(255,255,255,.18)` 1px atas, teks putih 13px/500, ikon `FileDown` 14px putih di kiri, radius 10, padding-x 14, tinggi 36.

### 4.4 KPI Card (×4)

Struktur "tray-in-card":
```
┌ tray (bg --bg-tray, radius 14, padding 3, border putih, ring --line-subtle)
│ ┌ kartu dalam putih (radius 12, border --line-subtle, padding 14×16)
│ │ LABEL MONO UPPER                       ▌ ▌ ▌▌ ▌   ← sparkline (kanan)
│ │ $20,320  [unit]
│ └
│  ◔ (ikon abu 14px)                          +0,94 last year   ← footer di area tray
└
```
- Label: `label-mono`, `--ink-2`.
- Nilai: `metric-xl`; Unit (jika ada) 12px `--ink-3`, baseline-aligned, gap 8.
- Sparkline kanan: lihat 5.3.
- Footer (di area abu tray, bukan di kartu putih): padding 8×12, kiri ikon `CircleArrowUp` 14px `--ink-4`; kanan teks: `+0,94` (mono, 12px, `--success-ink`, weight 500) + spasi + `last year` (12px `--ink-3`).

Data (copy persis):
| Label | Value | Unit | Delta |
|---|---|---|---|
| TOTAL REVENUE | $20,320 | — | +0,94 last year |
| TOTAL ORDERS | 10,320 | Orders | +0,94 last year |
| NEW CUSTOMERS | 4,305 | New Users | +0,94 last year |
| CONVERSION RATE | 3.9% | — | +0,94 last year |

### 4.5 Panel (tray umum)
Dipakai oleh Sales Trend, Revenue Breakdown, Recent Transactions.
- Tray: sama seperti KPI (bg `--bg-tray`, radius 14, padding 3).
- **Header tray** (tinggi 40, padding-x 12, flex between): kiri `section-mono` + ikon `Info` 14px `--ink-4`; kanan tombol **"···"** bulat 24×24 (`Ellipsis` 14px, `bg --bg-muted`… tampak abu terang/putih dengan border halus, radius full).
- **Body**: kartu dalam putih (radius 12, border `--line-subtle`).

### 4.6 Sales Trend (isi kartu dalam)
Baris atas (padding 16, flex between, wrap):
1. Kiri: caption "Total Revenue :" (12px `--ink-3`) + `$20,320` (`metric-lg`), gap 10, baseline.
2. Tengah: **Legend** — `○ NEW USER` (dot 6px `--chart-new` dengan border `--line`) dan `● EXISTING USER` (dot 6px `--chart-ink`), teks `label-mono` 11px `--ink-2`, gap 16.
3. Kanan: **Segmented control** "Weekly | Monthly | Yearly":
   - Track: `bg --bg-muted`, radius 10, padding 3.
   - Item: padding 6×14, radius 8, teks 12px `--ink-3`.
   - Aktif (Monthly): `bg #FFF`, `shadow-card`, teks `--ink` weight 500.

Lalu chart (lihat 5.1) dengan padding 8–16.

### 4.7 Revenue Breakdown (isi kartu dalam)
- Atas (padding 16, flex between):
  - Kiri: caption "Revenue by Category" (12px `--ink-3`) di atas, `$20,320` (`metric-lg`) di bawah.
  - Kanan: **Date range pill** — putih, border `--line`, radius 10, tinggi 32, padding 0 10, `CalendarDays` 14px + "Jan 1 - Aug 30" (12px) + `ChevronDown` 14px.
- **AI Insight banner** (full width dalam kartu, margin 0 16): `bg --bg-muted`, radius 8, tinggi 36, padding 0 8; kiri kotak ikon 24×24 putih radius 6 dengan `Sparkles` 14px; teks "Get AI insight for better analysis" (12px `--ink`, weight 500); kanan ikon `ArrowRight` dalam lingkaran 16px `--ink-3`.
- Chart bar (lihat 5.2) + footer axis (lihat 5.2.4).

### 4.8 Recent Transactions
- Header tray: kiri judul; kanan (gap 8): **Search input** putih (lebar ≈ 225, tinggi 32, border `--line`, radius 10, ikon Search 16px, placeholder "Search transactions...") + **Button "+ Add Transaction"** (outline: putih, border `--line`, radius 10, tinggi 32, ikon `Plus` 14px, teks 13px/500) + tombol "···" bulat.
- Tabel di dalam kartu dalam putih — lihat 6.4 untuk spesifikasi kolom.

### 4.9 Komponen kecil global

**Button**
| Varian | Spesifikasi |
|---|---|
| `outline` | bg #FFF, border `--line`, `shadow-card`, radius 10, h 32/36, px 12–14, 13px/500 |
| `dark` | gradient `--btn-dark-*`, teks putih, inset highlight |
| `icon` | 32×32 (atau 28×28 di row), radius 8/6, border `--line`, bg #FFF |
| `ghost` **[INFERRED]** | transparan, hover `--bg-hover` |

**Status Badge**: pill — `inline-flex`, gap 6, padding 4×10, radius full, `bg #FFF`, `border 1px --line`, teks 12px/500.
| Status | Ikon (14px) | Warna ikon | Warna teks |
|---|---|---|---|
| Success | `CircleCheck` (filled) | `--success` | `--success-ink` |
| Pending | `Clock` / dot filled | `--warning` | `--warning-ink` |
| Refunded | `Undo2` / dot filled | `--neutral-status` | `--neutral-status` |

**Checkbox**: 14×14, radius 4, border `--line-strong`, bg #FFF; checked **[INFERRED]**: bg `--ink`, check putih.

**Kbd chip**: 20×20, radius 5, bg #FFF, border `--line`, 11px `--ink-3`.

**Segmented control**, **Date pill**, **Select**: lihat 4.3 / 4.6 / 4.7.

---

## 5. CHART — SPESIFIKASI SUPER DETAIL

### 5.1 Sales Trend — **Pixel Matrix Bar Chart** (chart utama, paling khas)

**Konsep**: bar chart yang dibangun dari **kotak-kotak kecil** (seperti piksel/waffle). Setiap *kolom* = satu bar. Setiap sel = **2.5k** (revenue). Sel diisi dari bawah ke atas dengan 3 kondisi warna.

**Grid**
| Properti | Nilai |
|---|---|
| Jumlah kolom | **60** (5 kolom per bulan × 12 bulan; = data mingguan) |
| Jumlah baris | **25** (0k–60k, tiap baris = 2.5k; 4 baris = 10k) |
| Ukuran sel | **9×9** (unit SVG), radius **1.5** |
| Gap antar sel | **2** → pitch = **11** |
| Ukuran area plot | lebar `60×11−2 = 658`, tinggi `25×11−2 = 273` |

**Warna sel (urutan dari bawah)**
1. `existing` → sel `--chart-ink` (#141414), dari baris 0 sampai `round(existing/2.5)−1`.
2. `newUser` → sel `--chart-new` (#DEDEDB), ditumpuk **di atas** hitam sampai `round((existing+newUser)/2.5)−1`.
3. Sisanya (kosong) → `--chart-empty` (#F2F2F0). **Seluruh area plot selalu penuh sel** (matrix lengkap) sehingga terlihat seperti grid pixel pucat; bar muncul karena warnanya lebih gelap.

**Pola data (karakter visual)**
- Mayoritas kolom pendek (0–10k hitam, 0–25k abu).
- Muncul **spike** periodik (tinggi total sampai 45–50k, hitam sampai ±15–20k) kira-kira tiap 1–2 minggu — membuat siluet "gunung runcing".
- Ada kolom 0 (hanya sel kosong) di beberapa tempat, terutama dekat DEC.
- Bagian tertinggi di screenshot: area JUN (bar abu sampai ±49k).

**Axis Y** (kiri, gutter 44 unit)
- Label: `0k, 10k, 20k, 30k, 40k, 50k, 60k` — mono 11px `--ink-3`, rata kanan.
- Posisi vertikal: tepat di **tengah baris** ke `v/2.5` (0k = baris paling bawah; 60k = baris ke-24 / paling atas).
- Di kanan label ada **tick dot** kecil (titik 2px `--ink-4`) menempel ke grid.

**Axis X** (bawah)
- 12 label bulan: `JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC` — mono 11px UPPER `--ink-3`, `text-anchor: middle`, berpusat di kolom tengah tiap grup 5 kolom.
- **Separator** antar bulan: titik kecil "·" (circle r=1.5 `--ink-4`) di batas grup.
- **Bulan aktif/hover**: label bold, warna `--ink` (di screenshot: **JUN** aktif).
- Offset label dari bawah plot: ±18 unit.

**State hover/aktif (terlihat di screenshot pada kolom JUN)**
1. **Garis vertikal dotted**: dari atas ke bawah plot pada kolom aktif, stroke `--chart-ink`, 1px, `stroke-dasharray: 2 3`.
2. **Marker**: lingkaran solid `--chart-ink` r=4 dengan ring putih 2px, diposisikan di **puncak total stack** kolom itu (bukan di tengah).
3. **Tooltip** (HTML absolut, di kanan garis, offset ±12px, kalau mepet kanan flip ke kiri):
   - Kartu putih, radius 10, `--shadow-pop`, padding 6, lebar ≈ 150.
   - Header: `bg --bg-muted`, radius 6, padding 6×10, teks "Jun 2025" 12px `--ink-3`.
   - Baris 1: dot 6px `--chart-new` (outline `--line`) + "New User" (12px `--ink-3`) … nilai `38k` (mono, 14px, 700, `--ink`) rata kanan.
   - Baris 2: dot 6px `--chart-ink` + "Existing User" … nilai `18k`.
   - Tiap baris padding 6×10.
4. Kolom lain tetap normal. Hover berpindah per kolom (bukan per bulan); label bulan yang di-bold mengikuti bulan dari kolom aktif.
5. Default aktif saat load: kolom ke-27 (di JUN).

**Interaksi tambahan [INFERRED]**
- Toggle Weekly/Monthly/Yearly mengubah dataset & jumlah kolom (Monthly = 60 kolom seperti di screenshot; Weekly bisa 52–60 kolom dengan label minggu; Yearly = 5–8 kolom besar).
- Legend klik = toggle visibilitas seri (opsional).

### 5.2 Revenue Breakdown — **Grouped Dual Bar Chart**

**Ukuran** (unit SVG, viewBox ≈ `0 0 260 190`)
| Properti | Nilai |
|---|---|
| Jumlah grup | **16** |
| Pitch grup | ±16 |
| Bar hitam | lebar **5**, radius atas 2, warna `--chart-ink` |
| Bar abu (belakang) | lebar **7**, radius atas 2, warna `--chart-new` (#DEDEDB), **lebih tinggi** dari bar hitam, sepusat x |
| Baseline | garis dotted terbawah |
| Gridline | **8** garis horizontal dotted, spasi ±25 (screenshot) → ±20 unit |
| Gridline style | `stroke --chart-grid`, 1px, `stroke-dasharray: 1.5 3` |
| Tick kiri | dash pendek 4px `--ink-3` di awal tiap gridline (terlihat seperti titik-titik di tepi kiri) |

**Pola data** (kira-kira, nilai 0–1 dari tinggi plot): 
`main: [.40,.62,.30,.78,.55,.25,.45,.35,.80,.42,.38,.72,.30,.58,.32,.50]`
`ghost: [.60,.62,.46,.90,.62,.40,.55,.45,.97,.52,.50,.80,.42,.66,.38,.60]` (ghost ≥ main)

**Axis footer (di bawah chart)**
- Flex: kiri "1 JAN", kanan "30 JAN 2025" (mono 11px `--ink-3`), di antaranya **garis dotted** horizontal + **dot** kecil (r=2, `--ink-3`) di kedua ujung.
- Tidak ada label per bar.

**Hover [INFERRED]**: bar yang di-hover menaikkan opacity pasangan lain ke 0.5; tooltip gaya sama dengan Sales Trend (header tanggal + 2 baris).

### 5.3 KPI Sparkline — **Thin Vertical Bars**
- Kontainer kanan atas kartu KPI, tinggi ≈ 40, lebar ≈ 80.
- 12–14 bar vertikal, lebar **2px**, gap **~5px**, radius full, **rata tengah secara vertikal** (center-aligned), tinggi bervariasi 25–100%.
- Warna bar: `--chart-spark` (#D6D5D2). **1 bar highlight** (paling tinggi di tengah-kanan) `--chart-ink`; kadang 1–2 bar tetangga lebih gelap setengah (`#9A9993`).
- Data contoh (0–1):
  - Revenue: `[.45,.7,.35,.8,.55,.75,.4,1,.6,.5,.65,.45]`, highlight idx 7
  - Orders: `[.5,.8,.4,.9,.45,.7,1,.5,.75,.4,.6,.55]`, highlight idx 6
  - Customers: `[.7,.5,.85,.4,.9,.6,.5,1,.45,.7,.55,.65]`, highlight idx 7
  - Conversion: `[.4,.75,.55,.9,.45,.8,1,.5,.65,.35,.7,.5]`, highlight idx 6

### 5.4 Konvensi chart global
- Semua teks chart = **mono**, 11px.
- Tidak ada gradient, tidak ada area-fill, tidak ada garis tebal. Hanya blok solid + dotted.
- Hanya 3 nada: hitam `#141414`, abu `#DEDEDB`, abu pucat `#F2F2F0`.
- Axis tanpa garis solid; gunakan titik/dotted.

---

## 6. INVENTARIS KONTEN HALAMAN (SEMUA ELEMEN)

### 6.1 Sidebar — Copy & ikon (lucide)

| Group | Item | Ikon lucide |
|---|---|---|
| **Main Menu** | Dashboard *(aktif)* | `LayoutDashboard` (filled) |
| | Products | `Package` |
| | Transactions | `Banknote` |
| | Reports & Analytics | `ChartColumn` |
| | Messages | `MessageCircle` |
| | Team Performance | `Presentation` |
| | Campaigns | `Megaphone` |
| **Customers** | Customer List | `Users` |
| | Channels | `MessageSquare` |
| | Order Management | `ClipboardList` |
| **Management** | Roles & Permissions | `ShieldCheck` |
| | Billing & Subscription | `Receipt` |
| | Integrations | `Blocks` |
| **Settings** | Customer Support | `Headphones` |
| | Help Center | `CircleHelp` |
| | System Settings | `Settings` |

Workspace: `Agency` / `Spark Pixel Team`. User: `Salung Prastyo` / `Sales Operator`.

### 6.2 Topbar
Breadcrumb: `Dashboard` › `Overview`. Search placeholder: `Search...` + kbd `⌘` `K`. Ikon: `Bell`, `Inbox`. Avatar user.

### 6.3 Header halaman
`Welcome back, Salung` · select `Daily` · tanggal `6 Nov 2025` · tombol `Export CSV`.

### 6.4 Tabel Recent Transactions

**Kolom** (urutan, dengan sort icon `ChevronsUpDown` 12px `--ink-4` kecuali ACTIONS):
`[checkbox]` · `ID ⇅` · `CUSTOMER ⇅` · `PRODUCT ⇅` · `STATUS ⇅` · `QTY ⇅` · `UNIT PRICE ⇅` · `TOTAL REVENUE ⇅` · `ACTIONS`

**Grid**: `grid-template-columns: 36px 80px 1.1fr 1.1fr 1.1fr 0.9fr 1fr 1.1fr 80px` (ACTIONS rata kanan, align center).

**Header row**: tinggi 36, `bg #F8F7F5`, border-bottom `--line-subtle`, teks `label-mono` 11px `--ink-3`.
**Body row**: tinggi 41, border-bottom `--line-subtle`, padding-x 12; hover **[INFERRED]** `bg #FAFAF8`.

| Kolom | Gaya |
|---|---|
| ID | mono 13px `--ink-4` (contoh `#04910`) |
| CUSTOMER | sans 13px/500 `--ink` |
| PRODUCT | sans 13px `--ink` |
| STATUS | Status Badge (4.9) |
| QTY | mono 13px `--ink` |
| UNIT PRICE | mono 13px `--ink` |
| TOTAL REVENUE | mono 13px weight 500 `--ink` |
| ACTIONS | icon button 28×28 radius 6 border `--line`, ikon `Ellipsis` 14px |

**Data sampel (persis)**
| ID | Customer | Product | Status | Qty | Unit Price | Total Revenue |
|---|---|---|---|---|---|---|
| #04910 | Ryan Korsgaard | Ergo Office Chair | Success | 12 | $3,450 | $41,400 |
| #04911 | Madelyn Lubin | Sunset Desk 02 | Success | 20 | $2,980 | $89,200 |
| #04912 | Abram Bergson | Eco Bookshelf | Pending | 22 | $1,750 | $75,900 |
| #04913 | Phillip Mango | Green Leaf Desk | Refunded | 24 | $1,950 | $19,500 |

> Baris ke-4 (dan seterusnya) **memudar** ke bawah: terapkan `mask-image: linear-gradient(to bottom, #000 55%, transparent 100%)` pada body tabel (atau opacity 0.4 pada baris terakhir). Tabel di screenshot terpotong oleh tepi window — di implementasi nyata boleh scroll/paginasi.
> Catatan: Total Revenue di data tidak sama dengan `qty × unit price` (mis. 12×3,450 = 41,400 ✓; 20×2,980 = 59,600 ✗ ditulis 89,200). Pertahankan angka seperti di desain bila replika visual; untuk app nyata hitung otomatis.

### 6.5 Checklist semua elemen yang HARUS ada
- [ ] Window rounded di atas canvas abu
- [ ] Sidebar: switcher, 4 group nav (16 item), user card
- [ ] Topbar: breadcrumb, search + kbd, bell, inbox, avatar
- [ ] Header: sapaan, select Daily, date pill, Export CSV
- [ ] 4 KPI card (label, nilai, unit, sparkline, footer delta)
- [ ] Sales Trend: judul+info+menu, total revenue, legend, segmented, pixel chart, axis, tooltip hover, marker
- [ ] Revenue Breakdown: judul+info+menu, revenue by category, date range, AI banner, dual bar chart, axis footer
- [ ] Recent Transactions: judul+info, search, Add Transaction, menu, tabel (checkbox, sort, badge, actions), fade bawah

---

## 7. STATE, RESPONSIVE, AKSESIBILITAS

### 7.1 State (inferred)
| Elemen | Hover | Active | Focus | Disabled |
|---|---|---|---|---|
| Nav item | bg `--bg-hover`, teks `--ink` | bg #FFF + border + shadow | ring 2px `--ink` offset 2 | teks `--ink-4` |
| Button outline | bg `#FAFAF8` | bg `--bg-muted` | ring 2px `--ink` offset 2 | opacity .5 |
| Button dark | gradient lebih terang 4% | translateY(1px) | ring 2px `--ink` offset 2 + putih 2px | opacity .5 |
| Input | border `--line-strong` | — | border `--ink`, ring 3px `rgba(17,17,16,.08)` | bg `--bg-muted`, teks `--ink-4` |
| Row tabel | bg `#FAFAF8` | — | outline dalam | — |
| Segmented item | teks `--ink` | bg #FFF + shadow | ring | — |

### 7.2 Responsive
| Breakpoint | Perilaku |
|---|---|
| ≥ 1280 | Layout penuh seperti desain |
| 1024–1279 | Sidebar jadi rail ikon 72px (label disembunyikan, tooltip), KPI tetap 4 kolom, row tengah tetap 2 kolom |
| 768–1023 | Sidebar jadi drawer (hamburger di topbar); KPI 2×2; Sales Trend & Revenue Breakdown ditumpuk 1 kolom |
| < 768 | KPI 1 kolom; segmented & legend wrap; tabel `overflow-x: auto` dengan min-width 880; header halaman wrap (kontrol turun ke bawah sapaan) |

Pixel chart: gunakan `viewBox` + `width:100%` sehingga skala otomatis; di mobile boleh kurangi kolom (mis. 30) agar sel tetap terbaca.

### 7.3 Aksesibilitas
- Kontras teks `--ink-3` (#8B8A85) di atas putih ≈ 3.5:1 → hanya untuk teks sekunder ≥ 12px; teks penting pakai `--ink`/`--ink-2`.
- Chart: `role="img"` + `aria-label` ringkas, plus tabel data tersembunyi (`sr-only`) atau `aria-describedby`.
- Hover tooltip chart juga harus bisa lewat keyboard (`tabIndex=0` pada area, arrow-key pindah kolom).
- Status badge selalu teks + ikon (tidak mengandalkan warna saja).
- Hormati `prefers-reduced-motion`.

---

## 8. BOILERPLATE KODE (Vite + React + TS + Tailwind 3 + lucide-react)

### 8.1 Setup

```bash
npm create vite@latest spark-dashboard -- --template react-ts
cd spark-dashboard
npm i lucide-react @fontsource-variable/geist @fontsource-variable/geist-mono
npm i -D tailwindcss@3 postcss autoprefixer && npx tailwindcss init -p
```

### 8.2 Struktur folder

```
src/
├─ main.tsx
├─ App.tsx
├─ styles/
│  ├─ tokens.css
│  └─ index.css
├─ lib/
│  └─ cn.ts
├─ config/
│  └─ nav.ts
├─ data/
│  └─ mock.ts
├─ components/
│  ├─ layout/
│  │  ├─ AppShell.tsx
│  │  ├─ Sidebar.tsx
│  │  ├─ WorkspaceSwitcher.tsx
│  │  ├─ UserCard.tsx
│  │  ├─ Topbar.tsx
│  │  └─ PageHeader.tsx
│  ├─ ui/
│  │  ├─ Button.tsx
│  │  ├─ IconButton.tsx
│  │  ├─ SearchInput.tsx
│  │  ├─ Kbd.tsx
│  │  ├─ Segmented.tsx
│  │  ├─ Avatar.tsx
│  │  ├─ Checkbox.tsx
│  │  ├─ StatusBadge.tsx
│  │  ├─ Panel.tsx
│  │  └─ DateControls.tsx
│  ├─ charts/
│  │  ├─ SparkBars.tsx
│  │  ├─ PixelBarChart.tsx
│  │  ├─ ChartTooltip.tsx
│  │  └─ BreakdownChart.tsx
│  └─ dashboard/
│     ├─ KpiCard.tsx
│     ├─ SalesTrend.tsx
│     ├─ RevenueBreakdown.tsx
│     └─ TransactionsTable.tsx
└─ pages/
   └─ DashboardPage.tsx
```

### 8.3 `src/styles/tokens.css`

```css
:root {
  /* surface */
  --bg-canvas:#E6E6E4; --bg-app:#FFFFFF; --bg-sidebar:#F6F5F3; --bg-tray:#F4F3F1;
  --bg-card:#FFFFFF; --bg-muted:#F0EFED; --bg-hover:#EDECE9; --bg-switcher:#E9E8E6;
  /* line */
  --line-subtle:#ECEBE8; --line:#E0DFDB; --line-strong:#CFCDC8;
  /* text */
  --ink:#111110; --ink-2:#55544F; --ink-3:#8B8A85; --ink-4:#B8B7B2;
  /* chart */
  --chart-ink:#141414; --chart-new:#DEDEDB; --chart-empty:#F2F2F0; --chart-grid:#D2D1CD; --chart-spark:#D6D5D2;
  /* semantic */
  --success:#1F9D63; --success-ink:#18794D;
  --warning:#E5A71B; --warning-ink:#B7830F;
  --neutral-status:#9A9993; --presence:#22C55E;
  /* dark button */
  --btn-dark-top:#3A3A38; --btn-dark-bottom:#1B1B1A;
  /* radius */
  --r-window:20px; --r-tray:14px; --r-card:12px; --r-ctrl:10px; --r-sm:8px; --r-xs:6px;
  /* layout */
  --sidebar-w:240px; --topbar-h:56px;
  /* shadow */
  --shadow-window:0 24px 64px rgba(17,17,16,.10), 0 2px 6px rgba(17,17,16,.04);
  --shadow-card:0 1px 2px rgba(17,17,16,.04);
  --shadow-pop:0 10px 28px rgba(17,17,16,.12), 0 0 0 1px var(--line);
  /* font */
  --font-sans:'Geist Variable','Geist','Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
  --font-mono:'Geist Mono Variable','Geist Mono','JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;
}
```

### 8.4 `src/styles/index.css`

```css
@import "@fontsource-variable/geist";
@import "@fontsource-variable/geist-mono";
@import "./tokens.css";
@tailwind base; @tailwind components; @tailwind utilities;

@layer base {
  html, body, #root { height: 100%; }
  body {
    background: var(--bg-canvas); color: var(--ink);
    font-family: var(--font-sans); font-size: 13px; line-height: 20px;
    -webkit-font-smoothing: antialiased; font-variant-numeric: tabular-nums;
  }
  :focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
}
@layer utilities {
  .tray {
    background: var(--bg-tray); border: 1px solid #fff; padding: 3px;
    border-radius: var(--r-tray); box-shadow: 0 0 0 1px var(--line-subtle), inset 0 1px 0 rgba(255,255,255,.9);
  }
  .inner-card { background: var(--bg-card); border: 1px solid var(--line-subtle); border-radius: var(--r-card); }
  .label-mono { font-family: var(--font-mono); font-size: 12px; line-height: 16px; letter-spacing: .04em; text-transform: uppercase; font-weight: 500; }
}
```

### 8.5 `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)', app: 'var(--bg-app)', sidebar: 'var(--bg-sidebar)',
        tray: 'var(--bg-tray)', card: 'var(--bg-card)', muted: 'var(--bg-muted)',
        hover: 'var(--bg-hover)', switcher: 'var(--bg-switcher)',
        line: { DEFAULT: 'var(--line)', subtle: 'var(--line-subtle)', strong: 'var(--line-strong)' },
        ink: { DEFAULT: 'var(--ink)', 2: 'var(--ink-2)', 3: 'var(--ink-3)', 4: 'var(--ink-4)' },
        chart: { ink: 'var(--chart-ink)', new: 'var(--chart-new)', empty: 'var(--chart-empty)', grid: 'var(--chart-grid)', spark: 'var(--chart-spark)' },
        success: { DEFAULT: 'var(--success)', ink: 'var(--success-ink)' },
        warning: { DEFAULT: 'var(--warning)', ink: 'var(--warning-ink)' },
        neutralstatus: 'var(--neutral-status)', presence: 'var(--presence)',
      },
      borderRadius: {
        window: 'var(--r-window)', tray: 'var(--r-tray)', card: 'var(--r-card)',
        ctrl: 'var(--r-ctrl)', sm2: 'var(--r-sm)', xs2: 'var(--r-xs)',
      },
      boxShadow: { window: 'var(--shadow-window)', card: 'var(--shadow-card)', pop: 'var(--shadow-pop)' },
      fontFamily: { sans: 'var(--font-sans)', mono: 'var(--font-mono)' },
    },
  },
} satisfies Config
```

### 8.6 `src/lib/cn.ts`

```ts
export const cn = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ')
```

### 8.7 `src/config/nav.ts`

```ts
import {
  LayoutDashboard, Package, Banknote, ChartColumn, MessageCircle, Presentation, Megaphone,
  Users, MessageSquare, ClipboardList, ShieldCheck, Receipt, Blocks, Headphones, CircleHelp, Settings,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = { label: string; icon: LucideIcon; href: string }
export type NavGroup = { title: string; items: NavItem[] }

export const NAV: NavGroup[] = [
  { title: 'Main Menu', items: [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'Products', icon: Package, href: '/products' },
    { label: 'Transactions', icon: Banknote, href: '/transactions' },
    { label: 'Reports & Analytics', icon: ChartColumn, href: '/reports' },
    { label: 'Messages', icon: MessageCircle, href: '/messages' },
    { label: 'Team Performance', icon: Presentation, href: '/team' },
    { label: 'Campaigns', icon: Megaphone, href: '/campaigns' },
  ]},
  { title: 'Customers', items: [
    { label: 'Customer List', icon: Users, href: '/customers' },
    { label: 'Channels', icon: MessageSquare, href: '/channels' },
    { label: 'Order Management', icon: ClipboardList, href: '/orders' },
  ]},
  { title: 'Management', items: [
    { label: 'Roles & Permissions', icon: ShieldCheck, href: '/roles' },
    { label: 'Billing & Subscription', icon: Receipt, href: '/billing' },
    { label: 'Integrations', icon: Blocks, href: '/integrations' },
  ]},
  { title: 'Settings', items: [
    { label: 'Customer Support', icon: Headphones, href: '/support' },
    { label: 'Help Center', icon: CircleHelp, href: '/help' },
    { label: 'System Settings', icon: Settings, href: '/settings' },
  ]},
]
```

### 8.8 `src/data/mock.ts`

```ts
export const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'] as const
export const MONTHS_TITLE = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export type TrendCol = { month: number; newUser: number; existing: number } // satuan: k

// PRNG deterministik supaya chart stabil
function mulberry32(a: number) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}

export function makeTrendData(cols = 60, perMonth = 5): TrendCol[] {
  const rnd = mulberry32(7)
  return Array.from({ length: cols }, (_, i) => {
    const spike = i % 6 === 2 || i % 11 === 5            // spike periodik
    const dead  = rnd() < 0.06                            // kolom kosong sesekali
    const existing = dead ? 0 : Math.round((spike ? 10 + rnd() * 10 : 2 + rnd() * 6) / 2.5) * 2.5
    const newUser  = dead ? 0 : Math.round((spike ? 15 + rnd() * 25 : 5 + rnd() * 12) / 2.5) * 2.5
    return { month: Math.min(11, Math.floor(i / perMonth)), newUser, existing }
  })
}

export const KPIS = [
  { label: 'Total Revenue',   value: '$20,320', unit: undefined,    delta: '+0,94', bars: [.45,.7,.35,.8,.55,.75,.4,1,.6,.5,.65,.45], hi: [7] },
  { label: 'Total Orders',    value: '10,320',  unit: 'Orders',     delta: '+0,94', bars: [.5,.8,.4,.9,.45,.7,1,.5,.75,.4,.6,.55],   hi: [6] },
  { label: 'New Customers',   value: '4,305',   unit: 'New Users',  delta: '+0,94', bars: [.7,.5,.85,.4,.9,.6,.5,1,.45,.7,.55,.65],  hi: [7] },
  { label: 'Conversion Rate', value: '3.9%',    unit: undefined,    delta: '+0,94', bars: [.4,.75,.55,.9,.45,.8,1,.5,.65,.35,.7,.5], hi: [6] },
]

export const BREAKDOWN = {
  main:  [.40,.62,.30,.78,.55,.25,.45,.35,.80,.42,.38,.72,.30,.58,.32,.50],
  ghost: [.60,.62,.46,.90,.62,.40,.55,.45,.97,.52,.50,.80,.42,.66,.38,.60],
}

export type Txn = {
  id: string; customer: string; product: string
  status: 'Success' | 'Pending' | 'Refunded'
  qty: number; unitPrice: string; total: string
}
export const TXNS: Txn[] = [
  { id: '#04910', customer: 'Ryan Korsgaard', product: 'Ergo Office Chair', status: 'Success',  qty: 12, unitPrice: '$3,450', total: '$41,400' },
  { id: '#04911', customer: 'Madelyn Lubin',  product: 'Sunset Desk 02',    status: 'Success',  qty: 20, unitPrice: '$2,980', total: '$89,200' },
  { id: '#04912', customer: 'Abram Bergson',  product: 'Eco Bookshelf',     status: 'Pending',  qty: 22, unitPrice: '$1,750', total: '$75,900' },
  { id: '#04913', customer: 'Phillip Mango',  product: 'Green Leaf Desk',   status: 'Refunded', qty: 24, unitPrice: '$1,950', total: '$19,500' },
]
```

### 8.9 UI primitives

**`ui/Button.tsx`**
```tsx
import { cn } from '../../lib/cn'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'dark' | 'ghost'; size?: 'sm' | 'md' }

export function Button({ variant = 'outline', size = 'md', className, ...p }: Props) {
  return (
    <button
      {...p}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-ctrl px-3.5 text-[13px] font-medium transition-colors disabled:opacity-50',
        size === 'md' ? 'h-9' : 'h-8',
        variant === 'outline' && 'border border-line bg-card text-ink shadow-card hover:bg-[#FAFAF8] active:bg-muted',
        variant === 'ghost' && 'text-ink-2 hover:bg-hover',
        variant === 'dark' && 'border border-[#111110] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18)] bg-gradient-to-b from-[var(--btn-dark-top)] to-[var(--btn-dark-bottom)] hover:brightness-110 active:translate-y-px',
        className,
      )}
    />
  )
}
```

**`ui/IconButton.tsx`**
```tsx
import { cn } from '../../lib/cn'
export function IconButton({ className, round, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { round?: boolean }) {
  return (
    <button {...p} className={cn(
      'grid size-8 place-items-center border border-line bg-card text-ink-2 shadow-card transition-colors hover:bg-hover',
      round ? 'size-6 rounded-full' : 'rounded-sm2', className)} />
  )
}
```

**`ui/Kbd.tsx`**
```tsx
export const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="grid size-5 place-items-center rounded-[5px] border border-line bg-card text-[11px] font-medium text-ink-3">{children}</kbd>
)
```

**`ui/SearchInput.tsx`**
```tsx
import { Search } from 'lucide-react'
import { Kbd } from './Kbd'
import { cn } from '../../lib/cn'

export function SearchInput({ placeholder, kbd, variant = 'muted', className }:
  { placeholder: string; kbd?: boolean; variant?: 'muted' | 'white'; className?: string }) {
  return (
    <label className={cn('flex h-8 items-center gap-2 rounded-ctrl px-3 text-[13px] text-ink-3 focus-within:ring-2 focus-within:ring-ink/10',
      variant === 'muted' ? 'bg-muted' : 'border border-line bg-card', className)}>
      <Search className="size-4 shrink-0" strokeWidth={1.5} />
      <input className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-3" placeholder={placeholder} />
      {kbd && <span className="flex gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>}
    </label>
  )
}
```

**`ui/Segmented.tsx`**
```tsx
import { cn } from '../../lib/cn'
export function Segmented<T extends string>({ options, value, onChange }:
  { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="tablist" className="inline-flex rounded-ctrl bg-muted p-[3px]">
      {options.map(o => (
        <button key={o} role="tab" aria-selected={o === value} onClick={() => onChange(o)}
          className={cn('rounded-sm2 px-3.5 py-1.5 text-[12px] text-ink-3 transition-colors hover:text-ink',
            o === value && 'bg-card font-medium text-ink shadow-card')}>
          {o}
        </button>
      ))}
    </div>
  )
}
```

**`ui/Avatar.tsx`**
```tsx
import { cn } from '../../lib/cn'
export function Avatar({ src, alt, size = 32, online }: { src: string; alt: string; size?: number; online?: boolean }) {
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      <img src={src} alt={alt} className="size-full rounded-sm2 object-cover" />
      {online && <span className={cn('absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-presence ring-2 ring-white')} />}
    </span>
  )
}
```

**`ui/Checkbox.tsx`**
```tsx
export const Checkbox = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input type="checkbox" {...p}
    className="size-3.5 cursor-pointer appearance-none rounded-[4px] border border-line-strong bg-card checked:border-ink checked:bg-ink
               checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M4 8.5l2.5 2.5L12 5.5%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22/></svg>')]" />
)
```

**`ui/StatusBadge.tsx`**
```tsx
import { CircleCheck, Clock, Undo2 } from 'lucide-react'
import type { Txn } from '../../data/mock'

const MAP = {
  Success:  { Icon: CircleCheck, icon: 'text-success',       text: 'text-success-ink' },
  Pending:  { Icon: Clock,       icon: 'text-warning',       text: 'text-warning-ink' },
  Refunded: { Icon: Undo2,       icon: 'text-neutralstatus', text: 'text-neutralstatus' },
} as const

export function StatusBadge({ status }: { status: Txn['status'] }) {
  const { Icon, icon, text } = MAP[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1 text-[12px] font-medium ${text}`}>
      <Icon className={`size-3.5 ${icon}`} strokeWidth={2} /> {status}
    </span>
  )
}
```

**`ui/Panel.tsx`** (tray + inner card)
```tsx
import { Ellipsis, Info } from 'lucide-react'
import { IconButton } from './IconButton'
import { cn } from '../../lib/cn'

export function Panel({ title, actions, children, className, bodyClassName }:
  { title: string; actions?: React.ReactNode; children: React.ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <section className={cn('tray flex flex-col', className)}>
      <header className="flex h-10 shrink-0 items-center justify-between gap-3 px-3">
        <h3 className="label-mono flex items-center gap-1.5 text-ink-3">
          {title} <Info className="size-3.5 text-ink-4" strokeWidth={1.5} aria-hidden />
        </h3>
        <div className="flex items-center gap-2">
          {actions}
          <IconButton round aria-label="More options"><Ellipsis className="size-3.5" /></IconButton>
        </div>
      </header>
      <div className={cn('inner-card min-h-0 flex-1', bodyClassName)}>{children}</div>
    </section>
  )
}
```

**`ui/DateControls.tsx`**
```tsx
import { CalendarDays, ChevronDown } from 'lucide-react'

export function DailyDatePill({ period = 'Daily', date = '6 Nov 2025' }: { period?: string; date?: string }) {
  return (
    <div className="flex h-9 items-stretch overflow-hidden rounded-ctrl border border-line bg-card shadow-card text-[13px]">
      <button className="flex items-center gap-2 px-3 hover:bg-hover">{period}<ChevronDown className="size-3.5 text-ink-3" /></button>
      <span className="w-px bg-line" />
      <button className="flex items-center gap-2 px-3 hover:bg-hover"><CalendarDays className="size-3.5 text-ink-3" />{date}</button>
    </div>
  )
}

export function DateRangePill({ label = 'Jan 1 - Aug 30' }: { label?: string }) {
  return (
    <button className="flex h-8 items-center gap-2 rounded-ctrl border border-line bg-card px-2.5 text-[12px] shadow-card hover:bg-[#FAFAF8]">
      <CalendarDays className="size-3.5 text-ink-3" />{label}<ChevronDown className="size-3.5 text-ink-3" />
    </button>
  )
}
```

### 8.10 Layout

**`layout/AppShell.tsx`**
```tsx
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas p-4 lg:p-8">
      <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-[1440px] overflow-hidden rounded-window border border-white bg-app shadow-window lg:h-[calc(100vh-4rem)]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-[18px]">{children}</main>
        </div>
      </div>
    </div>
  )
}
```

**`layout/WorkspaceSwitcher.tsx`**
```tsx
import { ChevronsUpDown } from 'lucide-react'
export function WorkspaceSwitcher() {
  return (
    <button className="flex h-[52px] w-full items-center gap-2.5 rounded-ctrl bg-switcher px-2.5 text-left hover:brightness-[.98]">
      <span className="grid size-8 place-items-center rounded-sm2 bg-ink text-white font-semibold">S</span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block text-[11px] text-ink-3">Agency</span>
        <span className="block truncate text-[13px] font-semibold text-ink">Spark Pixel Team</span>
      </span>
      <ChevronsUpDown className="size-3.5 text-ink-3" />
    </button>
  )
}
```

**`layout/UserCard.tsx`**
```tsx
import { ChevronDown } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
export function UserCard() {
  return (
    <button className="flex h-[52px] w-full items-center gap-2.5 rounded-ctrl border border-line bg-card p-2 text-left shadow-card hover:bg-[#FAFAF8]">
      <Avatar src="/avatar-salung.jpg" alt="Salung Prastyo" online />
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-[13px] font-semibold text-ink">Salung Prastyo</span>
        <span className="block text-[11px] text-ink-3">Sales Operator</span>
      </span>
      <ChevronDown className="size-3.5 text-ink-3" />
    </button>
  )
}
```

**`layout/Sidebar.tsx`**
```tsx
import { NAV } from '../../config/nav'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'
import { UserCard } from './UserCard'
import { cn } from '../../lib/cn'

export function Sidebar({ active = 'Dashboard' }: { active?: string }) {
  return (
    <aside className="hidden w-[var(--sidebar-w)] shrink-0 flex-col border-r border-line bg-sidebar p-3.5 lg:flex">
      <WorkspaceSwitcher />
      <nav aria-label="Primary" className="mt-4 flex-1 overflow-y-auto">
        {NAV.map((g, i) => (
          <div key={g.title} className={cn(i > 0 && 'mt-3 border-t border-line pt-3')}>
            <p className="px-2 pb-2 text-[12px] font-medium text-ink-2">{g.title}</p>
            <ul className="space-y-0.5">
              {g.items.map(({ label, icon: Icon, href }) => {
                const isActive = label === active
                return (
                  <li key={label}>
                    <a href={href} aria-current={isActive ? 'page' : undefined}
                      className={cn('flex h-[30px] items-center gap-2.5 rounded-sm2 px-2.5 text-[14px] font-medium transition-colors',
                        isActive ? 'border border-line-subtle bg-card text-ink shadow-card'
                                 : 'text-ink-3 hover:bg-hover hover:text-ink')}>
                      <Icon className="size-4" strokeWidth={1.5} fill={isActive ? 'currentColor' : 'none'} />
                      {label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="pt-3"><UserCard /></div>
    </aside>
  )
}
```

**`layout/Topbar.tsx`**
```tsx
import { Bell, ChevronRight, Inbox } from 'lucide-react'
import { SearchInput } from '../ui/SearchInput'
import { IconButton } from '../ui/IconButton'
import { Avatar } from '../ui/Avatar'

export function Topbar() {
  return (
    <header className="flex h-[var(--topbar-h)] shrink-0 items-center justify-between gap-4 border-b border-line px-[18px]">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px]">
        <a href="/" className="text-ink-3 hover:text-ink">Dashboard</a>
        <ChevronRight className="size-3.5 text-ink-4" />
        <span className="font-medium text-ink">Overview</span>
      </nav>
      <div className="flex items-center gap-2">
        <SearchInput placeholder="Search..." kbd className="w-[330px] max-md:hidden" />
        <IconButton aria-label="Notifications"><Bell className="size-4" strokeWidth={1.5} /></IconButton>
        <IconButton aria-label="Inbox"><Inbox className="size-4" strokeWidth={1.5} /></IconButton>
        <Avatar src="/avatar-salung.jpg" alt="Profile" />
      </div>
    </header>
  )
}
```

**`layout/PageHeader.tsx`**
```tsx
import { FileDown } from 'lucide-react'
import { Button } from '../ui/Button'
import { DailyDatePill } from '../ui/DateControls'

export function PageHeader({ name = 'Salung' }: { name?: string }) {
  return (
    <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-[24px] font-medium leading-8 tracking-[-0.01em]">Welcome back, {name}</h1>
      <div className="flex items-center gap-2">
        <DailyDatePill />
        <Button variant="dark"><FileDown className="size-3.5" /> Export CSV</Button>
      </div>
    </div>
  )
}
```

### 8.11 Charts

**`charts/SparkBars.tsx`**
```tsx
import { cn } from '../../lib/cn'
export function SparkBars({ values, highlight = [] }: { values: number[]; highlight?: number[] }) {
  return (
    <div className="flex h-10 items-center gap-[5px]" aria-hidden>
      {values.map((v, i) => (
        <span key={i} style={{ height: `${v * 100}%` }}
          className={cn('w-0.5 rounded-full', highlight.includes(i) ? 'bg-chart-ink' : 'bg-chart-spark')} />
      ))}
    </div>
  )
}
```

**`charts/ChartTooltip.tsx`**
```tsx
export function ChartTooltip({ title, rows, style }:
  { title: string; rows: { dot: 'new' | 'ink'; label: string; value: string }[]; style?: React.CSSProperties }) {
  return (
    <div style={style} className="pointer-events-none absolute z-10 w-[150px] rounded-ctrl bg-card p-1.5 shadow-pop">
      <div className="rounded-xs2 bg-muted px-2.5 py-1.5 text-[12px] text-ink-3">{title}</div>
      {rows.map(r => (
        <div key={r.label} className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] text-ink-3">
          <span className={r.dot === 'ink' ? 'size-1.5 rounded-full bg-chart-ink' : 'size-1.5 rounded-full border border-line bg-chart-new'} />
          <span className="flex-1">{r.label}</span>
          <span className="font-mono text-[14px] font-bold text-ink">{r.value}</span>
        </div>
      ))}
    </div>
  )
}
```

**`charts/PixelBarChart.tsx`** ← chart inti
```tsx
import { useMemo } from 'react'
import { MONTHS, MONTHS_TITLE, type TrendCol } from '../../data/mock'
import { ChartTooltip } from './ChartTooltip'

const CELL = 9, GAP = 2, PITCH = CELL + GAP
const ROWS = 25            // 0k..60k, tiap baris 2.5k
const STEP = 2.5
const PADL = 44, PADB = 32
const PER_MONTH = 5

type Props = { data: TrendCol[]; activeIndex: number | null; onActive: (i: number | null) => void }

export function PixelBarChart({ data, activeIndex, onActive }: Props) {
  const cols = data.length
  const W = cols * PITCH - GAP
  const H = ROWS * PITCH - GAP
  const vbW = PADL + W, vbH = H + PADB
  const rowY = (r: number) => (ROWS - 1 - r) * PITCH           // y atas sel di baris r (0 = paling bawah)

  const cells = useMemo(() => data.flatMap((d, c) => {
    const ex = Math.round(d.existing / STEP)
    const tot = Math.round((d.existing + d.newUser) / STEP)
    return Array.from({ length: ROWS }, (_, r) => (
      <rect key={`${c}-${r}`} x={PADL + c * PITCH} y={rowY(r)} width={CELL} height={CELL} rx={1.5}
        fill={r < ex ? 'var(--chart-ink)' : r < tot ? 'var(--chart-new)' : 'var(--chart-empty)'} />
    ))
  }), [data])

  const a = activeIndex !== null ? data[activeIndex] : null
  const ax = activeIndex !== null ? PADL + activeIndex * PITCH + CELL / 2 : 0
  const topRow = a ? Math.max(0, Math.round((a.existing + a.newUser) / STEP) - 1) : 0
  const markerY = rowY(topRow) + CELL / 2
  const activeMonth = a?.month ?? -1

  return (
    <div className="relative" onMouseLeave={() => onActive(null)}>
      <svg viewBox={`0 0 ${vbW} ${vbH}`} className="block w-full" role="img"
           aria-label="Sales trend: new vs existing users by week, 0 to 60k">
        {/* sumbu Y */}
        {[0, 10, 20, 30, 40, 50, 60].map(v => {
          const cy = rowY(v / STEP) + CELL / 2
          return (
            <g key={v}>
              <text x={PADL - 14} y={cy} textAnchor="end" dominantBaseline="middle"
                    className="fill-ink-3" style={{ font: '400 11px var(--font-mono)' }}>{v}k</text>
              <circle cx={PADL - 6} cy={cy} r={1} fill="var(--ink-4)" />
            </g>
          )
        })}

        {cells}

        {/* garis dotted + marker */}
        {a && (
          <g pointerEvents="none">
            <line x1={ax} x2={ax} y1={0} y2={H} stroke="var(--chart-ink)" strokeWidth={1} strokeDasharray="2 3" />
            <circle cx={ax} cy={markerY} r={4.5} fill="var(--chart-ink)" stroke="#fff" strokeWidth={2} />
          </g>
        )}

        {/* sumbu X */}
        {MONTHS.map((m, i) => {
          const cx = PADL + (i * PER_MONTH + PER_MONTH / 2) * PITCH - GAP / 2
          return (
            <g key={m}>
              <text x={cx} y={H + 20} textAnchor="middle"
                    fill={i === activeMonth ? 'var(--ink)' : 'var(--ink-3)'}
                    style={{ font: `${i === activeMonth ? 700 : 400} 11px var(--font-mono)`, letterSpacing: '.02em' }}>{m}</text>
              {i > 0 && <circle cx={PADL + i * PER_MONTH * PITCH - GAP / 2} cy={H + 16.5} r={1.5} fill="var(--ink-4)" />}
            </g>
          )
        })}

        {/* hit-area per kolom */}
        {data.map((_, c) => (
          <rect key={c} x={PADL + c * PITCH - GAP / 2} y={0} width={PITCH} height={H} fill="transparent"
                onMouseEnter={() => onActive(c)} />
        ))}
      </svg>

      {a && (
        <ChartTooltip
          title={`${MONTHS_TITLE[a.month]} 2025`}
          rows={[
            { dot: 'new', label: 'New User', value: `${a.newUser}k` },
            { dot: 'ink', label: 'Existing User', value: `${a.existing}k` },
          ]}
          style={{
            left: `calc(${(ax / vbW) * 100}% + 12px)`,
            top: `${(markerY / vbH) * 100}%`,
            transform: (ax / vbW) > 0.78 ? 'translateX(calc(-100% - 24px))' : undefined, // flip bila mepet kanan
          }}
        />
      )}
    </div>
  )
}
```

**`charts/BreakdownChart.tsx`**
```tsx
type Props = { main: number[]; ghost: number[] }
const VBW = 260, VBH = 176, PADL = 10, PADR = 6, LINES = 8, TOP = 6, BOT = VBH - 4

export function BreakdownChart({ main, ghost }: Props) {
  const n = main.length
  const plotW = VBW - PADL - PADR
  const pitch = plotW / n
  const plotH = BOT - TOP
  const lineGap = plotH / (LINES - 1)

  return (
    <div>
      <svg viewBox={`0 0 ${VBW} ${VBH}`} className="block w-full" role="img" aria-label="Revenue breakdown by category">
        {Array.from({ length: LINES }, (_, i) => {
          const y = TOP + i * lineGap
          return (
            <g key={i}>
              <line x1={PADL} x2={VBW - PADR} y1={y} y2={y} stroke="var(--chart-grid)" strokeWidth={1} strokeDasharray="1.5 3" />
              <line x1={0} x2={4} y1={y} y2={y} stroke="var(--ink-3)" strokeWidth={1} />
            </g>
          )
        })}
        {main.map((m, i) => {
          const cx = PADL + i * pitch + pitch / 2
          const gh = ghost[i] * plotH, mh = m * plotH
          return (
            <g key={i}>
              <path d={roundTop(cx - 3.5, BOT - gh, 7, gh, 2)}   fill="var(--chart-new)" />
              <path d={roundTop(cx - 2.5, BOT - mh, 5, mh, 2)}   fill="var(--chart-ink)" />
            </g>
          )
        })}
      </svg>

      {/* axis footer */}
      <div className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase text-ink-3">
        <span>1 Jan</span>
        <span className="size-1 rounded-full bg-ink-3" />
        <span className="h-px flex-1 border-t border-dotted border-chart-grid" />
        <span className="size-1 rounded-full bg-ink-3" />
        <span>30 Jan 2025</span>
      </div>
    </div>
  )
}

// rect dengan sudut atas membulat
function roundTop(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h)
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`
}
```

### 8.12 Dashboard blocks

**`dashboard/KpiCard.tsx`**
```tsx
import { CircleArrowUp } from 'lucide-react'
import { SparkBars } from '../charts/SparkBars'

type Props = { label: string; value: string; unit?: string; delta: string; bars: number[]; hi: number[] }

export function KpiCard({ label, value, unit, delta, bars, hi }: Props) {
  return (
    <article className="tray">
      <div className="inner-card flex items-start justify-between gap-3 px-4 py-3.5">
        <div className="min-w-0">
          <p className="label-mono text-ink-2">{label}</p>
          <p className="mt-2.5 flex items-baseline gap-2">
            <span className="font-mono text-[24px] font-bold leading-6 tracking-[-0.01em]">{value}</span>
            {unit && <span className="text-[12px] text-ink-3">{unit}</span>}
          </p>
        </div>
        <SparkBars values={bars} highlight={hi} />
      </div>
      <footer className="flex items-center justify-between px-3 py-2 text-[12px] text-ink-3">
        <CircleArrowUp className="size-3.5 text-ink-4" strokeWidth={1.5} aria-hidden />
        <span><b className="font-mono font-medium text-success-ink">{delta}</b> last year</span>
      </footer>
    </article>
  )
}
```

**`dashboard/SalesTrend.tsx`**
```tsx
import { useMemo, useState } from 'react'
import { Panel } from '../ui/Panel'
import { Segmented } from '../ui/Segmented'
import { PixelBarChart } from '../charts/PixelBarChart'
import { makeTrendData } from '../../data/mock'

const RANGES = ['Weekly', 'Monthly', 'Yearly'] as const

export function SalesTrend() {
  const [range, setRange] = useState<(typeof RANGES)[number]>('Monthly')
  const [active, setActive] = useState<number | null>(27)       // default aktif: JUN
  const data = useMemo(() => makeTrendData(60, 5), [])

  return (
    <Panel title="Sales Trend">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4">
        <div className="flex items-baseline gap-2.5">
          <span className="text-[12px] text-ink-3">Total Revenue :</span>
          <span className="font-mono text-[24px] font-bold leading-6">$20,320</span>
        </div>
        <ul className="flex items-center gap-4 label-mono !text-[11px] text-ink-2">
          <li className="flex items-center gap-1.5"><span className="size-1.5 rounded-full border border-line bg-chart-new" />New User</li>
          <li className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-chart-ink" />Existing User</li>
        </ul>
        <Segmented options={RANGES} value={range} onChange={setRange} />
      </div>
      <div className="px-4 pb-4 pt-5"><PixelBarChart data={data} activeIndex={active} onActive={setActive} /></div>
    </Panel>
  )
}
```

**`dashboard/RevenueBreakdown.tsx`**
```tsx
import { ArrowRight, Sparkles } from 'lucide-react'
import { Panel } from '../ui/Panel'
import { DateRangePill } from '../ui/DateControls'
import { BreakdownChart } from '../charts/BreakdownChart'
import { BREAKDOWN } from '../../data/mock'

export function RevenueBreakdown() {
  return (
    <Panel title="Revenue Breakdown">
      <div className="flex items-start justify-between gap-2 px-4 pt-4">
        <div>
          <p className="text-[12px] text-ink-3">Revenue by Category</p>
          <p className="mt-1.5 font-mono text-[24px] font-bold leading-6">$20,320</p>
        </div>
        <DateRangePill />
      </div>

      <button className="mx-4 mt-3.5 flex h-9 w-[calc(100%-2rem)] items-center gap-2 rounded-sm2 bg-muted px-2 text-left text-[12px] font-medium hover:bg-hover">
        <span className="grid size-6 place-items-center rounded-xs2 bg-card shadow-card"><Sparkles className="size-3.5" /></span>
        <span className="flex-1">Get AI insight for better analysis</span>
        <ArrowRight className="size-3.5 text-ink-3" />
      </button>

      <div className="px-4 pb-4 pt-5"><BreakdownChart main={BREAKDOWN.main} ghost={BREAKDOWN.ghost} /></div>
    </Panel>
  )
}
```

**`dashboard/TransactionsTable.tsx`**
```tsx
import { ChevronsUpDown, Ellipsis, Plus } from 'lucide-react'
import { Panel } from '../ui/Panel'
import { SearchInput } from '../ui/SearchInput'
import { Button } from '../ui/Button'
import { IconButton } from '../ui/IconButton'
import { Checkbox } from '../ui/Checkbox'
import { StatusBadge } from '../ui/StatusBadge'
import { TXNS } from '../../data/mock'

const GRID = 'grid grid-cols-[36px_80px_1.1fr_1.1fr_1.1fr_.9fr_1fr_1.1fr_80px] items-center px-3'
const COLS = ['ID', 'CUSTOMER', 'PRODUCT', 'STATUS', 'QTY', 'UNIT PRICE', 'TOTAL REVENUE'] as const

export function TransactionsTable() {
  return (
    <Panel
      title="Recent Transactions"
      actions={<>
        <SearchInput variant="white" placeholder="Search transactions..." className="w-[225px] max-sm:hidden" />
        <Button size="sm"><Plus className="size-3.5" /> Add Transaction</Button>
      </>}
      bodyClassName="overflow-hidden"
    >
      <div className="overflow-x-auto">
        <div className="min-w-[880px]">
          <div className={`${GRID} h-9 border-b border-line-subtle bg-[#F8F7F5] label-mono !text-[11px] text-ink-3`} role="row">
            <Checkbox aria-label="Select all" />
            {COLS.map(c => (
              <span key={c} className="flex items-center gap-1">{c}<ChevronsUpDown className="size-3 text-ink-4" /></span>
            ))}
            <span className="text-right">ACTIONS</span>
          </div>

          <div className="[mask-image:linear-gradient(to_bottom,#000_55%,transparent_100%)]">
            {TXNS.map(t => (
              <div key={t.id} role="row" className={`${GRID} h-[41px] border-b border-line-subtle text-[13px] hover:bg-[#FAFAF8]`}>
                <Checkbox aria-label={`Select ${t.id}`} />
                <span className="font-mono text-ink-4">{t.id}</span>
                <span className="font-medium">{t.customer}</span>
                <span>{t.product}</span>
                <span><StatusBadge status={t.status} /></span>
                <span className="font-mono">{t.qty}</span>
                <span className="font-mono">{t.unitPrice}</span>
                <span className="font-mono font-medium">{t.total}</span>
                <span className="flex justify-end">
                  <IconButton className="!size-7 !rounded-xs2" aria-label={`Actions for ${t.id}`}><Ellipsis className="size-3.5" /></IconButton>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
}
```

### 8.13 Page & entry

**`pages/DashboardPage.tsx`**
```tsx
import { AppShell } from '../components/layout/AppShell'
import { PageHeader } from '../components/layout/PageHeader'
import { KpiCard } from '../components/dashboard/KpiCard'
import { SalesTrend } from '../components/dashboard/SalesTrend'
import { RevenueBreakdown } from '../components/dashboard/RevenueBreakdown'
import { TransactionsTable } from '../components/dashboard/TransactionsTable'
import { KPIS } from '../data/mock'

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader name="Salung" />
      <div className="grid gap-3.5">
        <section aria-label="Key metrics" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {KPIS.map(k => <KpiCard key={k.label} {...k} />)}
        </section>

        <section className="grid gap-3.5 xl:grid-cols-[2.2fr_1fr]">
          <SalesTrend />
          <RevenueBreakdown />
        </section>

        <TransactionsTable />
      </div>
    </AppShell>
  )
}
```

**`App.tsx`**
```tsx
import DashboardPage from './pages/DashboardPage'
export default function App() { return <DashboardPage /> }
```

**`main.tsx`**
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
```

---

## 9. ASUMSI & CATATAN KETIDAKPASTIAN

| Item | Status |
|---|---|
| Nama font asli | Terlihat seperti **Geist / Inter** (sans) + **Geist Mono / JetBrains Mono** (mono). Bukan 100% pasti; fallback sudah disiapkan |
| Hex warna | Estimasi dari tampilan visual (screenshot ter-resize/kompres) |
| Skala 1.2× | Nilai px = ukuran screenshot × 1.2 supaya cocok frame 1440. Rasio asli frame desain tidak diketahui |
| Jumlah kolom pixel chart (60) | Estimasi: ±532px lebar plot / ±9px pitch di screenshot |
| Tumpukan New + Existing | Diasumsikan **ditumpuk** (hitam di bawah, abu di atas). Di screenshot, total puncak JUN ≈ 49k sementara tooltip menulis 38k + 18k = 56k, jadi bisa jadi abu adalah overlay/kumulatif sendiri. Jika ingin cocok persis dengan tooltip, ubah rumus tinggi abu menjadi `newUser` (bukan `existing + newUser`) dan hitam tetap `existing` |
| Total Revenue tabel | Tidak konsisten dengan qty×harga (lihat catatan 6.4) |
| State hover/focus | Tidak terlihat → **[INFERRED]** |
| Avatar & logo | Placeholder: `/public/avatar-salung.jpg`, logo "S" teks sederhana. Ganti dengan aset asli |
| Ikon | Mendekati lucide; ikon Dashboard aktif tampak solid/filled |

---

## 10. CHECKLIST QA (ACCEPTANCE)

**Visual**
- [ ] Canvas abu `#E6E6E4`, window putih radius 20 dengan border putih & shadow lembut
- [ ] Sidebar `#F6F5F3`, item aktif = pill putih bertepi halus
- [ ] Semua label section/kolom = mono UPPERCASE kecil; semua angka = mono tabular
- [ ] Tray abu hangat membungkus kartu putih (padding 3px) di KPI & 3 panel utama
- [ ] Hanya warna: hitam, abu hangat, hijau (positif/success), kuning-oranye (pending)
- [ ] Tombol Export CSV gelap bergradien dengan highlight inset atas

**Chart**
- [ ] Pixel matrix 60×25, sel 9px gap 2px, 3 warna (hitam / abu / pucat), siluet spike
- [ ] Label Y `0k–60k` sejajar tengah baris; label X `JAN–DEC` dengan separator titik
- [ ] Hover: garis dotted + marker bulat + tooltip "Jun 2025 / New User / Existing User"; bulan aktif bold
- [ ] Breakdown: 16 grup bar (hitam 5px di depan abu 7px), 8 gridline dotted, footer "1 JAN ··· 30 JAN 2025"
- [ ] Sparkline KPI: bar 2px, 1 highlight hitam, center-aligned

**Fungsional**
- [ ] Segmented Weekly/Monthly/Yearly berpindah (state)
- [ ] Tooltip flip saat mepet kanan
- [ ] Tabel scroll horizontal di layar kecil; baris bawah memudar
- [ ] Fokus keyboard terlihat; chart punya `aria-label`
- [ ] Responsif sesuai tabel 7.2

---

*End of document.*