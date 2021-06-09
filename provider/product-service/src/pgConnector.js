const { Pool } = require('pg');
const xsenv = require('@sap/xsenv');

xsenv.loadEnv();
const services = xsenv.getServices({ "postgresql-db": { name: 'postgresql' } })
const pgCredentials = services['postgresql-db'];

const config = {
    user: pgCredentials.username,
    host: pgCredentials.hostname,
    password: pgCredentials.password,
    port: pgCredentials.port,
    database: pgCredentials.dbname,
}

// Do not use SSL for localhost
config.ssl = process.env.LOCAL_DEV ? undefined : {
    rejectUnauthorized: false,
    ca: pgCredentials.sslrootcert,
    cert: pgCredentials.sslcert
}

const pool = new Pool(config);

//Create tables
pool.query(`
    CREATE SCHEMA IF NOT EXISTS prod;

    CREATE TABLE IF NOT EXISTS prod.products (
        id serial NOT NULL,
        name text NOT NULL,
        price decimal NOT NULL,
        tenant_id text NOT NULL,
        PRIMARY KEY (id)
    );
`, (err, res) => {
    if (err) {
        console.error(`Error creating schema`, err);
    }
})

module.exports = pool;