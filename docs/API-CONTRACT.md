# API Contract — POS UMKM Indonesia (`/api/v1`)

Dokumen ini menjadi acuan resmi antara **Backend (Go/Gin)** dan **Frontend (Next.js)** untuk seluruh endpoint aplikasi web.

## Global Rules & Envelope

Mengacu pada [API-CONTRACT-REF.md](./API-CONTRACT-REF.md):
- **Base URL:** `http://localhost:8080/api/v1` (kecuali `/health`).
- **Response Envelope:** Seluruh response menggunakan format:
  ```json
  {
    "message": "Human-readable message",
    "data": {},
    "status": 200
  }
  ```
- **HTTP Status Header == `status` di Body:** Jangan pernah mengembalikan HTTP `200` dengan body error.
- **`data` selalu ada:** Berisi payload saat sukses, `null` saat error (atau `{"errors": {...}}` pada `422`).
- **`meta` & `links`:** Hanya ada pada endpoint list yang menggunakan pagination. List kosong tetap mengembalikan `200` dengan `"data": []`.
- **Naming & Tipe Data:** Konsisten `snake_case`. Tanggal menggunakan ISO 8601 (`YYYY-MM-DD` atau `RFC3339`). Nominal uang menggunakan `integer` (Rupiah).
- **Auth Header:** `Authorization: Bearer <access_token>` untuk seluruh endpoint terproteksi.

### Standard Error Responses
- `400`: `{"message": "Bad request", "data": null, "status": 400}`
- `401`: `{"message": "Unauthenticated", "data": null, "status": 401}`
- `403`: `{"message": "You do not have permission to perform this action", "data": null, "status": 403}`
- `404`: `{"message": "Resource not found", "data": null, "status": 404}`
- `409`: `{"message": "Resource already exists", "data": null, "status": 409}`
- `422`: `{"message": "Validation failed", "data": {"errors": {"field": ["reason"]}}, "status": 422}`
- `500`: `{"message": "Internal server error", "data": null, "status": 500}`

---

## 1. Health

### `GET /health`
- **Auth:** Public
- **200 OK:**
  ```json
  {
    "message": "Service healthy",
    "data": { "status": "ok" },
    "status": 200
  }
  ```

---

## 2. Auth (`/api/v1/auth`)

### `POST /api/v1/auth/login`
- **Auth:** Public
- **Request:**
  ```json
  { "email": "owner@warung.id", "password": "secret123" }
  ```
- **200 OK:**
  ```json
  {
    "message": "Login successful",
    "data": {
      "access_token": "<jwt>",
      "token_type": "Bearer",
      "user": {
        "id": "01900000-0000-7000-8000-000000000002",
        "umkm_id": "01900000-0000-7000-8000-000000000010",
        "branch_id": null,
        "name": "Budi Owner",
        "email": "owner@warung.id",
        "role": "owner",
        "is_active": true
      }
    },
    "status": 200
  }
  ```
- **Errors:** `401` (kredensial salah), `403` (akun/UMKM/cabang nonaktif), `422` (validasi gagal).

### `POST /api/v1/auth/refresh`
- **Auth:** Bearer (`superadmin`, `owner`, `branch_admin`)
- **200 OK:**
  ```json
  {
    "message": "Token refreshed",
    "data": { "access_token": "<jwt>", "token_type": "Bearer" },
    "status": 200
  }
  ```

### `POST /api/v1/auth/change-password`
- **Auth:** Bearer
- **Request:**
  ```json
  { "old_password": "secret123", "new_password": "newpass123" }
  ```
- **200 OK:**
  ```json
  { "message": "Password updated", "data": null, "status": 200 }
  ```

### `GET /api/v1/auth/me`
- **Auth:** Bearer
- **200 OK:**
  ```json
  {
    "message": "Profile retrieved",
    "data": {
      "id": "01900000-0000-7000-8000-000000000002",
      "umkm_id": "01900000-0000-7000-8000-000000000010",
      "branch_id": null,
      "name": "Budi Owner",
      "email": "owner@warung.id",
      "role": "owner",
      "is_active": true
    },
    "status": 200
  }
  ```

---

## 3. UMKM & Cabang

### 3.1 Superadmin (`/api/v1/admin/umkms`)

#### `POST /api/v1/admin/umkms`
- **Auth:** Bearer (`superadmin`)
- **Request:**
  ```json
  {
    "name": "Warung Maju Jaya",
    "phone": "08123456789",
    "address": "Jl. Merdeka No. 10, Jakarta",
    "owner_name": "Budi Santoso",
    "owner_email": "budi@warungmaju.id",
    "owner_password": "secret123"
  }
  ```
- **201 Created:**
  ```json
  {
    "message": "UMKM created",
    "data": {
      "umkm": {
        "id": "01900000-0000-7000-8000-000000000010",
        "name": "Warung Maju Jaya",
        "phone": "08123456789",
        "address": "Jl. Merdeka No. 10, Jakarta",
        "is_active": true
      },
      "owner_id": "01900000-0000-7000-8000-000000000002"
    },
    "status": 201
  }
  ```
- **Errors:** `409` (email owner sudah terdaftar).

#### `GET /api/v1/admin/umkms`
- **Auth:** Bearer (`superadmin`)
- **200 OK:**
  ```json
  {
    "message": "UMKMs retrieved",
    "data": [
      {
        "id": "01900000-0000-7000-8000-000000000010",
        "name": "Warung Maju Jaya",
        "phone": "08123456789",
        "address": "Jl. Merdeka No. 10, Jakarta",
        "is_active": true,
        "branch_count": 2
      }
    ],
    "status": 200
  }
  ```

#### `GET /api/v1/admin/umkms/:id`
- **Auth:** Bearer (`superadmin`)
- **200 OK:** Single `umkm` object di dalam `data`.

#### `GET /api/v1/admin/umkms/:id/branches`
- **Auth:** Bearer (`superadmin`)
- **200 OK:** Array of `Branch` di dalam `data`.

#### `PATCH /api/v1/admin/umkms/:id/status`
- **Auth:** Bearer (`superadmin`)
- **Request:** `{ "is_active": false }`
- **200 OK:** `{ "message": "UMKM status updated", "data": null, "status": 200 }`

### 3.2 Owner & Branch Admin (`/api/v1/umkm`, `/api/v1/branches`)

#### `GET /api/v1/umkm`
- **Auth:** Bearer (`owner`, `branch_admin`)
- **200 OK:** Mengembalikan detail UMKM milik user dari JWT (`data` = `UMKM` object).

#### `POST /api/v1/branches`
- **Auth:** Bearer (`owner`)
- **Request:** `{ "name": "Cabang Sudirman", "address": "Jl. Sudirman No. 5", "phone": "08129998887" }`
- **201 Created:**
  ```json
  {
    "message": "Branch created",
    "data": {
      "id": "01900000-0000-7000-8000-000000000020",
      "umkm_id": "01900000-0000-7000-8000-000000000010",
      "name": "Cabang Sudirman",
      "address": "Jl. Sudirman No. 5",
      "phone": "08129998887",
      "is_active": true
    },
    "status": 201
  }
  ```

#### `GET /api/v1/branches`
- **Auth:** Bearer (`owner`)
- **200 OK:** Array of `Branch` di dalam `data`.

#### `PATCH /api/v1/branches/:id`
- **Auth:** Bearer (`owner`)
- **Request:** `{ "name": "...", "address": "...", "phone": "...", "is_active": true }` (semua field opsional)
- **200 OK:** Updated `Branch` di dalam `data`.

#### `GET /api/v1/branches/:id/settings` & `PUT /api/v1/branches/:id/settings`
- **Auth:** Bearer (`owner`, `branch_admin` hanya untuk `branch_id` miliknya)
- **Request (`PUT`) / Response `data`:**
  ```json
  {
    "branch_id": "01900000-0000-7000-8000-000000000020",
    "setup_done": true,
    "store_name": "Warung Maju - Sudirman",
    "address": "Jl. Sudirman No. 5",
    "phone": "08129998887",
    "receipt_header": "Selamat Datang",
    "receipt_footer": "Terima kasih",
    "logo_url": "",
    "qris_image_url": "https://example.com/qris.png",
    "receipt_prefix": "INV",
    "daily_reset": true,
    "tax_enabled": true,
    "tax_name": "PPN",
    "tax_rate_bp": 1100,
    "tax_inclusive": false
  }
  ```

#### `POST /api/v1/branches/:id/web-users`
- **Auth:** Bearer (`owner`)
- **Request:** `{ "name": "Siti Admin", "email": "siti@warung.id", "password": "secret123" }`
- **201 Created:** `{ "message": "Branch web user created", "data": { "id": "...", "role": "branch_admin" }, "status": 201 }`

#### `POST /api/v1/branches/:id/staff`
- **Auth:** Bearer (`owner`)
- **Request:** `{ "name": "Andi Kasir", "role": "cashier", "pin": "1234" }` (`role`: `branch_admin` | `cashier`, `pin`: 4–8 karakter)
- **201 Created:** `{ "message": "Staff created", "data": { "id": "...", "branch_id": "...", "name": "Andi Kasir", "role": "cashier", "is_active": true }, "status": 201 }`
- **Errors:** `409` (PIN duplikat di cabang yang sama).

#### `GET /api/v1/branches/:id/staff`
- **Auth:** Bearer (`owner`)
- **200 OK:** Array of `Staff` di dalam `data`.

#### `PATCH /api/v1/branches/:id/staff/:staffId`
- **Auth:** Bearer (`owner`)
- **Request:** `{ "name": "...", "role": "cashier", "is_active": true }`
- **200 OK:** Updated `Staff` di dalam `data`.

#### `PATCH /api/v1/branches/:id/staff/:staffId/pin`
- **Auth:** Bearer (`owner`)
- **Request:** `{ "pin": "5678" }`
- **200 OK:** `{ "message": "PIN updated", "data": null, "status": 200 }`

---

## 4. Licensing, Subscriptions & Notifications

### 4.1 Superadmin (`/api/v1/admin/*`)

#### `GET /api/v1/admin/subscriptions`
- **Auth:** Bearer (`superadmin`)
- **Query:** `?status=pending|confirmed|rejected&umkm_id=&branch_id=`
- **200 OK:** Array of `SubscriptionTransaction` di dalam `data`.

#### `PATCH /api/v1/admin/subscriptions/:id/confirm`
- **Auth:** Bearer (`superadmin`)
- **Request (opsional):** `{ "duration_days": 30, "notes": "Transfer BCA terverifikasi" }`
- **200 OK:** Mengembalikan `BranchLicense` yang baru diterbitkan di dalam `data` (`license_key`, `status: "unused"`, `duration_days: 30`, dll.).

#### `PATCH /api/v1/admin/subscriptions/:id/reject`
- **Auth:** Bearer (`superadmin`)
- **Request:** `{ "notes": "Bukti transfer tidak terbaca" }`
- **200 OK:** `{ "message": "Subscription rejected", "data": null, "status": 200 }`

#### `GET /api/v1/admin/licenses`
- **Auth:** Bearer (`superadmin`)
- **Query:** `?umkm_id=&branch_id=&status=`
- **200 OK:** Array of `BranchLicense` di dalam `data`.

#### `PATCH /api/v1/admin/licenses/:id/revoke`
- **Auth:** Bearer (`superadmin`)
- **200 OK:** `{ "message": "License revoked", "data": null, "status": 200 }`

### 4.2 Owner (`/api/v1/branches/:id/*`, `/api/v1/notifications`)

#### `POST /api/v1/branches/:id/subscriptions`
- **Auth:** Bearer (`owner`)
- **Request:** `{ "payment_method": "BCA Transfer", "payment_proof_url": "https://...", "notes": "Bayar bulan Desember" }`
- **201 Created:** `SubscriptionTransaction` (`amount: 30000`, `status: "pending"`) di dalam `data`.

#### `GET /api/v1/branches/:id/subscriptions`
- **Auth:** Bearer (`owner`)
- **200 OK:** Array of `SubscriptionTransaction` di dalam `data`.

#### `GET /api/v1/branches/:id/licenses`
- **Auth:** Bearer (`owner`)
- **200 OK:**
  ```json
  {
    "message": "Licenses retrieved",
    "data": {
      "licenses": [],
      "active_until": "2026-12-28T00:00:00Z"
    },
    "status": 200
  }
  ```

#### `POST /api/v1/branches/:id/licenses/activate`
- **Auth:** Bearer (`owner`)
- **Request:** `{ "license_key": "ABCD-EFGH-IJKL-MNOP" }`
- **200 OK:** `BranchLicense` dengan `status: "active"`, `activated_at`, dan `expires_at` di dalam `data`.

#### `GET /api/v1/notifications`
- **Auth:** Bearer (`owner`)
- **200 OK:** Array of `Notification` di dalam `data`.

#### `PATCH /api/v1/notifications/:id/read`
- **Auth:** Bearer (`owner`)
- **200 OK:** `{ "message": "Notification marked as read", "data": null, "status": 200 }`

---

## 5. Transactions (`/api/v1/transactions`)

### `GET /api/v1/transactions`
- **Auth:** Bearer (`owner`)
- **Query:** `?page=1&limit=50&branch_id=&cashier_id=&payment_method=&status=&from=YYYY-MM-DD&to=YYYY-MM-DD`
- **200 OK (Paginated):**
  ```json
  {
    "message": "Transactions retrieved",
    "data": [
      {
        "id": "...",
        "branch_id": "...",
        "cashier_id": "...",
        "receipt_no": "INV-20261128-0001",
        "business_date": "2026-11-28",
        "order_type": "Dine in",
        "payment_method": "cash",
        "subtotal": 25000,
        "tax_amount": 0,
        "total": 25000,
        "received": 50000,
        "change_amount": 25000,
        "status": "completed",
        "created_at": "2026-11-28T08:00:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "per_page": 50,
      "total": 1,
      "last_page": 1,
      "from": 1,
      "to": 1
    },
    "status": 200
  }
  ```

### `GET /api/v1/transactions/:id`
- **Auth:** Bearer (`owner`)
- **200 OK:** Detail transaksi beserta array `items` (`product_id`, `product_name`, `price`, `qty`, `line_total`) di dalam `data`.

---

## 6. Reports (`/api/v1/reports`)

### `GET /api/v1/reports/summary`
- **Auth:** Bearer (`owner`)
- **Query:** `?from=YYYY-MM-DD&to=YYYY-MM-DD&period=daily|monthly&branch_id=` (`from` & `to` wajib)
- **200 OK:** Ringkasan agregat penjualan, jumlah transaksi, breakdown metode pembayaran, dan breakdown per cabang di dalam `data`.

---

## 7. Attendances (`/api/v1/attendances`)

### `GET /api/v1/attendances`
- **Auth:** Bearer (`owner`)
- **Query:** `?from=YYYY-MM-DD&to=YYYY-MM-DD&branch_id=&staff_id=` (`from` & `to` wajib)
- **200 OK:** Array of `Attendance` (`id`, `branch_id`, `staff_id`, `business_date`, `clock_in_at`, `clock_out_at`) di dalam `data`.
