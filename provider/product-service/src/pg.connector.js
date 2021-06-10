const { Pool } = require('pg');
const xsenv = require('@sap/xsenv');
const fs = require('fs');

const createPool = () => {
    try {
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

        return new Pool(config);
    } catch (e) {
        console.error(`\nFailed to create DB Connection Pool\n`, e);
        throw e;
    }
}

const createSchema = async (pool) => {
    try {
        //Create tables
        const schemaSQL = fs.readFileSync(`src/schema.sql`).toString();
        await pool.query(schemaSQL);
        return pool;
    } catch (e) {
        console.error(`\nFailed to create schema\n`, e);
        throw e;
    }
}

const initDB = async () => {
    try {
        const pool = await createPool();
        await createSchema(pool);
        return pool;
    } catch (e) {
        console.error(`\n\n\nFailed to init DB \n\n\n`)
        throw e;
    }
}


class TenantAwarePGConnector {
    constructor(pool) {
        this.pool = pool;
    }
    async query(tenantId, query, params) {
        if (!tenantId) {
            throw Error('Could not execute query. Parameter "tenantId" missing!!');
        }
        try {
            // Make query tenant aware

            const client = await this.pool.connect();
            // Use the tenant aware user for query
            await client.query(`SET ROLE tenant_aware_user`);
            // Configure tenant for this client instance
            await client.query(`SET tenant.id TO '${tenantId}'`);
            // run tenant aware query
            const result = await client.query(query, params);
            // remove tenantId reference to avoid data leak
            await client.query(`RESET tenant.id`);
            // release client to the pool
            client.release();

            return result;
        } catch (e) {
            console.error(`Failed to run query \n\n`, query, params, e);
            throw e;
        }

    }
}



module.exports = {
    initDB,
    TenantAwarePGConnector
};