CREATE TABLE IF NOT EXISTS todo (
    id                              serial PRIMARY KEY,
    name                            text NOT NULL,
    done                            bool NOT NULL DEFAULT false
);
