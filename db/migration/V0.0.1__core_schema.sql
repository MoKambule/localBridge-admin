-- LocalBridge core schema, from the "LocalBridge Product & Backend Architecture" diagram.
-- Conventions (from the diagram): uuid ids, timestamptz, money as numeric(12,2) in ZAR.
-- gen_random_uuid() is built in to PostgreSQL 13+.

-- USERS ---------------------------------------------------------------------------
CREATE TABLE users (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email          VARCHAR(255) NOT NULL,
    phone          VARCHAR(30),
    display_name   VARCHAR(255),
    account_status VARCHAR(30)  NOT NULL DEFAULT 'ACTIVE',
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);
-- UQ email, case-insensitive.
CREATE UNIQUE INDEX uq_users_email ON users (lower(email));

CREATE TABLE user_roles (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role    VARCHAR(20) NOT NULL CHECK (role IN ('CUSTOMER', 'PROVIDER', 'ADMIN')),
    CONSTRAINT uq_user_roles_user_role UNIQUE (user_id, role)
);

-- CATEGORIES ----------------------------------------------------------------------
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

-- BUSINESS PROFILES / APPLICATIONS / ATTACHMENTS ---------------------------------
CREATE TABLE business_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    business_name   VARCHAR(255) NOT NULL,
    owner_name      VARCHAR(255),
    location_text   VARCHAR(255),
    category_id     UUID REFERENCES categories (id),
    capacity        VARCHAR(255),
    contact_number  VARCHAR(30),
    about           TEXT,
    business_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_business_profiles_owner ON business_profiles (owner_user_id);

-- A provider's application to become a service provider. The admin portal decides it.
-- MORE_INFO_REQUIRED is an addition to the diagram's accepted/rejected/pending.
CREATE TABLE applications (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id  UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    business_name  VARCHAR(255) NOT NULL,
    owner_name     VARCHAR(255),
    location_text  VARCHAR(255),
    category_id    UUID REFERENCES categories (id),
    capacity       VARCHAR(255),
    contact_number VARCHAR(30),
    about          TEXT,
    status         VARCHAR(30) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'MORE_INFO_REQUIRED')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_applications_status ON applications (status);
CREATE INDEX idx_applications_created_at ON applications (created_at DESC);

-- The diagram writes this FK as "applicant -> applications"; it is application_id here.
-- entity_type says which document it is: ID_DOCUMENT, PROOF_OF_ADDRESS, COMPANY_REGISTRATION.
CREATE TABLE attachments (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications (application_id) ON DELETE CASCADE,
    entity_type    VARCHAR(50) NOT NULL,
    file_url       TEXT NOT NULL,
    content_type   VARCHAR(100),
    size_bytes     BIGINT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_attachments_application ON attachments (application_id);

-- OPPORTUNITIES -------------------------------------------------------------------
CREATE TABLE opportunities (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_user_id UUID NOT NULL REFERENCES users (id),
    category_id   UUID REFERENCES categories (id),
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    location_text VARCHAR(255),
    budget_amount NUMERIC(12, 2),
    currency      CHAR(3) NOT NULL DEFAULT 'ZAR',
    closes_at     TIMESTAMPTZ,
    delivery_at   TIMESTAMPTZ,
    status        VARCHAR(20) NOT NULL DEFAULT 'OPEN'
        CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_opportunities_status_closes ON opportunities (status, closes_at);

CREATE TABLE opportunity_requirements (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id   UUID NOT NULL REFERENCES opportunities (id) ON DELETE CASCADE,
    requirement_text TEXT NOT NULL,
    is_mandatory     BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_opportunity_requirements_opp ON opportunity_requirements (opportunity_id);

-- QUOTES --------------------------------------------------------------------------
CREATE TABLE quotes (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id        UUID NOT NULL REFERENCES opportunities (id),
    provider_user_id      UUID NOT NULL REFERENCES users (id),
    status                VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
        CHECK (status IN ('DRAFT', 'SUBMITTED', 'ACCEPTED', 'DECLINED')),
    provider_message      TEXT,
    total_amount          NUMERIC(12, 2),
    shared_upfront_amount NUMERIC(12, 2),
    prepared_at           TIMESTAMPTZ,
    submitted_at          TIMESTAMPTZ,
    decision_at           TIMESTAMPTZ,
    buyer_feedback        TEXT,
    -- Quote integrity: one quote per provider per opportunity.
    CONSTRAINT uq_quotes_opportunity_provider UNIQUE (opportunity_id, provider_user_id)
);
-- Quote integrity: a buyer can accept at most one quote per opportunity.
CREATE UNIQUE INDEX uq_quotes_one_accepted ON quotes (opportunity_id) WHERE status = 'ACCEPTED';

CREATE TABLE quote_requirement_responses (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id       UUID NOT NULL REFERENCES quotes (id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES opportunity_requirements (id),
    response       VARCHAR(20) NOT NULL CHECK (response IN ('MEET', 'CANNOT_MEET')),
    response_note  TEXT,
    CONSTRAINT uq_qrr_quote_requirement UNIQUE (quote_id, requirement_id)
);

CREATE TABLE quote_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id    UUID NOT NULL REFERENCES quotes (id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity    NUMERIC(12, 3) NOT NULL,
    unit_price  NUMERIC(12, 2) NOT NULL,
    -- "line_total (derived)" in the diagram.
    line_total  NUMERIC(14, 2) GENERATED ALWAYS AS (round(quantity * unit_price, 2)) STORED,
    sort_order  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_quote_items_quote ON quote_items (quote_id);

-- Private to the provider. The admin portal never reads this table.
CREATE TABLE private_job_costs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id         UUID NOT NULL REFERENCES quotes (id) ON DELETE CASCADE,
    description      TEXT,
    estimated_amount NUMERIC(12, 2),
    payment_timing   VARCHAR(20) CHECK (payment_timing IN ('BEFORE', 'AFTER_DELIVERY')),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AUDIT_LOGS ----------------------------------------------------------------------
CREATE TABLE audit_logs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES users (id) ON DELETE SET NULL,
    action        VARCHAR(100) NOT NULL,
    entity_type   VARCHAR(50)  NOT NULL,
    entity_id     UUID,
    metadata      JSONB,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id, created_at DESC);
