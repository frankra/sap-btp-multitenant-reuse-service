const { Pool } = require('pg');
const xsenv = require('@sap/xsenv');

xsenv.loadEnv();
const services = xsenv.getServices({ "postgresql-db": { name: 'postgresql' } })
const pgCredentials = services['postgresql-db'];

const pool = new Pool({
    user: pgCredentials.username,
    host: pgCredentials.hostname,
    password: pgCredentials.password,
    port: pgCredentials.port,
    database: pgCredentials.dbname,
})

//Create tables
pool.query(`
    CREATE SCHEMA IF NOT EXISTS prod;

    CREATE TABLE IF NOT EXISTS prod.products (
        id integer NOT NULL,
        name text NOT NULL,
        price decimal NOT NULL,
        tenant_id string NOT NULL,
        PRIMARY KEY (id)
    );
`, (err, res) => {
    console.log(err, res)
    pool.end();
})

module.exports = pool;