-- Admin portal sign-in.
-- The diagram has no password column because the apps authenticate with Firebase.
-- The admin portal signs in with email + password instead, so those credentials live
-- here, only for users who hold the ADMIN role. Swap this for Firebase later if you like
-- (see WALKTHROUGH.md) and drop the table.
CREATE TABLE admin_credentials (
    user_id       UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL,
    failed_logins INTEGER NOT NULL DEFAULT 0,
    locked_until  TIMESTAMPTZ,
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
