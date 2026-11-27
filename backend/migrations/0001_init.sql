-- Initial PostgreSQL schema for POS UMKM Indonesia (v1.0)
-- Standard: UUID v7 primary keys, created_at/updated_at/deleted_at audit columns.

BEGIN;

-- 1. Tenant & Auth
CREATE TABLE umkms (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE branches (
    id UUID PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES umkms(id),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_branches_umkm_id ON branches(umkm_id) WHERE deleted_at IS NULL;

CREATE TABLE web_users (
    id UUID PRIMARY KEY,
    umkm_id UUID REFERENCES umkms(id),
    branch_id UUID REFERENCES branches(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'owner', 'branch_admin')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_web_users_email ON web_users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_web_users_umkm_id ON web_users(umkm_id) WHERE deleted_at IS NULL;

CREATE TABLE branch_settings (
    id UUID PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES umkms(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    setup_done BOOLEAN NOT NULL DEFAULT FALSE,
    store_name TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    receipt_header TEXT NOT NULL DEFAULT '',
    receipt_footer TEXT NOT NULL DEFAULT '',
    logo_url TEXT,
    qris_image_url TEXT,
    receipt_prefix TEXT NOT NULL DEFAULT 'INV',
    daily_reset BOOLEAN NOT NULL DEFAULT TRUE,
    tax_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    tax_name TEXT NOT NULL DEFAULT 'PPN',
    tax_rate_bp INT NOT NULL DEFAULT 1100,
    tax_inclusive BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_branch_settings_branch_id ON branch_settings(branch_id) WHERE deleted_at IS NULL;

CREATE TABLE branch_staff (
    id UUID PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES umkms(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    name TEXT NOT NULL,
    photo_url TEXT,
    pin_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('branch_admin', 'cashier')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_branch_staff_pin ON branch_staff(branch_id, pin_hash) WHERE deleted_at IS NULL;
CREATE INDEX idx_branch_staff_branch_id ON branch_staff(branch_id) WHERE deleted_at IS NULL;

-- 2. Licensing, Notifications & Attendance
CREATE TABLE subscription_transactions (
    id UUID PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES umkms(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    amount INT NOT NULL DEFAULT 30000,
    payment_method TEXT,
    payment_proof_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
    confirmed_by UUID REFERENCES web_users(id),
    confirmed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_subscription_tx_branch_id ON subscription_transactions(branch_id, status) WHERE deleted_at IS NULL;

CREATE TABLE branch_licenses (
    id UUID PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES umkms(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    subscription_transaction_id UUID NOT NULL REFERENCES subscription_transactions(id),
    license_key TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unused' CHECK (status IN ('unused', 'active', 'expired', 'revoked')),
    duration_days INT NOT NULL DEFAULT 30,
    issued_by UUID NOT NULL REFERENCES web_users(id),
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_branch_licenses_key ON branch_licenses(license_key) WHERE deleted_at IS NULL;
CREATE INDEX idx_branch_licenses_active ON branch_licenses(branch_id, status, expires_at) WHERE deleted_at IS NULL;

CREATE TABLE attendances (
    id UUID PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES umkms(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    staff_id UUID NOT NULL REFERENCES branch_staff(id),
    business_date DATE NOT NULL,
    clock_in_at TIMESTAMPTZ NOT NULL,
    clock_out_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_attendances_branch_date ON attendances(branch_id, business_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_attendances_staff_date ON attendances(staff_id, business_date) WHERE deleted_at IS NULL;

CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES umkms(id),
    branch_id UUID REFERENCES branches(id),
    license_id UUID REFERENCES branch_licenses(id),
    channel TEXT NOT NULL CHECK (channel IN ('web', 'tablet', 'email')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_umkm_unread ON notifications(umkm_id, read_at) WHERE deleted_at IS NULL;

CREATE TABLE sync_logs (
    id UUID PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES umkms(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    device_id TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('push', 'pull')),
    records_count INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
    error_message TEXT,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_sync_logs_branch_synced ON sync_logs(branch_id, synced_at DESC) WHERE deleted_at IS NULL;

-- 3. POS & Inventory (Synced from Mobile)
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES umkms(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    name TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_categories_branch_id ON categories(branch_id) WHERE deleted_at IS NULL;

CREATE TABLE products (
    id UUID PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES umkms(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    category_id UUID NOT NULL REFERENCES categories(id),
    name TEXT NOT NULL,
    sku TEXT,
    price INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 0,
    photo_url TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_products_branch_name ON products(branch_id, name) WHERE deleted_at IS NULL;

CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES umkms(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    cashier_id UUID REFERENCES branch_staff(id),
    receipt_no TEXT NOT NULL,
    business_date DATE NOT NULL,
    order_type TEXT NOT NULL DEFAULT 'Dine in',
    payment_method TEXT NOT NULL,
    subtotal INT NOT NULL,
    tax_name TEXT NOT NULL,
    tax_rate_bp INT NOT NULL,
    tax_inclusive BOOLEAN NOT NULL,
    tax_amount INT NOT NULL,
    total INT NOT NULL,
    received INT NOT NULL,
    change_amount INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    void_reason TEXT,
    voided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX uq_transactions_branch_receipt ON transactions(branch_id, receipt_no) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_branch_date ON transactions(branch_id, business_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_umkm_created ON transactions(umkm_id, created_at DESC) WHERE deleted_at IS NULL;

CREATE TABLE transaction_items (
    id UUID PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES umkms(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    product_id UUID NOT NULL REFERENCES products(id),
    product_name TEXT NOT NULL,
    price INT NOT NULL,
    qty INT NOT NULL,
    line_total INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_transaction_items_tx_id ON transaction_items(transaction_id) WHERE deleted_at IS NULL;

CREATE TABLE stock_movements (
    id UUID PRIMARY KEY,
    umkm_id UUID NOT NULL REFERENCES umkms(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    product_id UUID NOT NULL REFERENCES products(id),
    staff_id UUID REFERENCES branch_staff(id),
    transaction_id UUID REFERENCES transactions(id),
    type TEXT NOT NULL,
    qty_change INT NOT NULL,
    stock_after INT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_stock_movements_branch_product ON stock_movements(branch_id, product_id, created_at DESC) WHERE deleted_at IS NULL;

COMMIT;
