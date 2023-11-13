ALTER TABLE employee ADD COLUMN token_expired_at timestamptz NOT NULL DEFAULT '1970-01-01'::timestamptz;
