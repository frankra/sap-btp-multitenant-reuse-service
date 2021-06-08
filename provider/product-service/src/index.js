const express = require('express');
const pool = require('./pgConnector');
const { start } = require('./controller');
const bodyParser = require('body-parser');
const { configure } = require('./auth');
const cfenv = require("cfenv")
const appEnv = cfenv.getAppEnv();

const app = express();
const port = 3000 | appEnv.port;

app.use(bodyParser.json());
configure(app);
start(app, pool);

app.get('/', (req, res) => {
    res.send('Hello World!')
});
app.listen(appEnv.port, appEnv.bind, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});