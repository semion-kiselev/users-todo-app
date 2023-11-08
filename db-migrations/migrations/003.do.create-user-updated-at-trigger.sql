CREATE OR REPLACE FUNCTION modify_employee_updated_at() RETURNS trigger AS
$$
BEGIN
    CASE tg_op
        WHEN 'UPDATE' THEN
            NEW.updated_at = NOW();
            RETURN NEW;
    END CASE;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employee_update_trigger
    BEFORE UPDATE on employee
    FOR EACH ROW
    EXECUTE FUNCTION modify_employee_updated_at();
