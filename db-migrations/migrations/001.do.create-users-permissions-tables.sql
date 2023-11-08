CREATE EXTENSION pgcrypto;

CREATE TABLE IF NOT EXISTS permission (
    id                              char(2) PRIMARY KEY,
    name                            text NOT NULL
);

CREATE TABLE IF NOT EXISTS employee (
    id                              serial PRIMARY KEY,
    name                            text NOT NULL,
    email                           text NOT NULL UNIQUE,
    password                        text NOT NULL,
    created_at                      timestamptz NOT NULL DEFAULT now(),
    updated_at                      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employee_permission (
    employee_id                     int NOT NULL REFERENCES employee(id) ON UPDATE CASCADE ON DELETE CASCADE,
    permission_id                   char(2) NOT NULL REFERENCES permission(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (employee_id, permission_id)
);
