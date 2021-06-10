const express = require('express');
const { initDB, TenantAwarePGConnector } = require('./pg.connector');
const { start } = require('./product.controller');
const { configure } = require('./auth');
const xsenv = require('@sap/xsenv');
xsenv.loadEnv();

const cfenv = require("cfenv");
const appEnv = cfenv.getAppEnv();

const run = async () => {
    const app = express();
    const port = 3000 | appEnv.port;

    const pool = await initDB();
    const db = new TenantAwarePGConnector(pool);

    app.use(express.json());
    configure(app);
    start(app, db);

    app.listen(appEnv.port, appEnv.bind, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });
}
run();