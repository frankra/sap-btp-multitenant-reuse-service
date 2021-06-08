const express = require('express');
const pool = require('./pgConnector');
const { start } = require('./controller');
const cfenv = require("cfenv")
const appEnv = cfenv.getAppEnv();

const app = express();
const port = 3000 | process.env.PORT;

start(app, pool);

app.listen(appEnv.port, appEnv.bind, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});