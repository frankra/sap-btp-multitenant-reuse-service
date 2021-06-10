CREATE SCHEMA IF NOT EXISTS poc;

CREATE TABLE IF NOT EXISTS poc.products (
    id serial NOT NULL,
    name text NOT NULL,
    price decimal NOT NULL,
    tenant_id text NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE poc.products ENABLE ROW LEVEL SECURITY;

DO
$do$
    BEGIN
        IF NOT EXISTS (
            SELECT FROM pg_catalog.pg_policies
            WHERE policyname = 'tenant_aware_products')
        THEN
            CREATE POLICY tenant_aware_products ON poc.products
            USING (tenant_id = current_setting('tenant.id'));
        END IF;
    END
$do$;

DO
$do$
    BEGIN
        IF NOT EXISTS (
            SELECT FROM pg_catalog.pg_roles  -- SELECT list can be empty for this
            WHERE  rolname = 'tenant_aware_user') 
        THEN
            CREATE ROLE tenant_aware_user;
            GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA poc TO tenant_aware_user;
            GRANT ALL PRIVILEGES ON SCHEMA poc TO tenant_aware_user;
            GRANT INSERT, SELECT, UPDATE, DELETE ON ALL TABLES IN SCHEMA poc TO tenant_aware_user;
        END IF;
    END
$do$;
