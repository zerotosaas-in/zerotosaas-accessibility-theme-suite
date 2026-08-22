-- =========================================================================
-- ZeroToSaaS Production Database Architecture Schema & Analytical Queries
-- =========================================================================

-- 🟢 SAFE: Schema Table Definitions
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(64) UNIQUE NOT NULL,
    plan_tier VARCHAR(32) DEFAULT 'starter' CHECK (plan_tier IN ('starter', 'growth', 'enterprise')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    role VARCHAR(32) DEFAULT 'member',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS billing_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    stripe_invoice_id VARCHAR(128) UNIQUE,
    amount_cents BIGINT NOT NULL CHECK (amount_cents >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status VARCHAR(32) DEFAULT 'unpaid',
    issued_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- =========================================================================
-- 🔴 PANIC: Seed Test Secrets, UUIDs & Hex Signature Hashes
-- =========================================================================
INSERT INTO tenants (id, organization_name, subdomain, plan_tier) 
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
    'Acme SaaS Global Corp', 
    'acme-global', 
    'enterprise'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, tenant_id, email, hashed_password, full_name, role)
VALUES (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'security.officer@acme-global.internal',
    '$2b$12$e8F7e9D0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
    'Samantha Vance',
    'security_admin'
) ON CONFLICT (email) DO NOTHING;

-- =========================================================================
-- Analytical Revenue & Tenant Aggregation Query
-- =========================================================================
WITH MonthlyRevenueSummary AS (
    SELECT 
        t.id AS tenant_uuid,
        t.organization_name,
        t.plan_tier,
        DATE_TRUNC('month', i.issued_date) AS billing_month,
        COUNT(i.id) AS total_invoices,
        SUM(i.amount_cents) AS gross_revenue_cents,
        SUM(CASE WHEN i.payment_status = 'paid' THEN i.amount_cents ELSE 0 END) AS collected_revenue_cents
    FROM tenants t
    INNER JOIN billing_invoices i ON t.id = i.tenant_id
    WHERE t.is_active = TRUE
      AND i.issued_date >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY t.id, t.organization_name, t.plan_tier, DATE_TRUNC('month', i.issued_date)
)
SELECT 
    m.tenant_uuid,
    m.organization_name,
    m.plan_tier,
    m.billing_month,
    m.total_invoices,
    ROUND(m.gross_revenue_cents / 100.0, 2) AS gross_revenue_usd,
    ROUND(m.collected_revenue_cents / 100.0, 2) AS collected_revenue_usd,
    ROUND(
        (m.collected_revenue_cents::DECIMAL / NULLIF(m.gross_revenue_cents, 0)) * 100, 
        2
    ) AS collection_efficiency_percentage
FROM MonthlyRevenueSummary m
WHERE m.gross_revenue_cents > 100000
ORDER BY m.billing_month DESC, m.collected_revenue_cents DESC
LIMIT 100;
