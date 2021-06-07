const { Pool } = require('pg');
const xsenv = require('@sap/xsenv');

xsenv.loadEnv();
const services = xsenv.getServices({ "postgresql-db": {name: 'postgresql'}})
const pgCredentials = services['postgresql-db'];

const pool = new Pool({
  user: pgCredentials.username,
  host: pgCredentials.hostname,
  password: pgCredentials.password,
  port: pgCredentials.port,
  database: pgCredentials.dbname,
})

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})

module.exports = pool;