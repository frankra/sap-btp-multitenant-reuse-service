const { middleware } = require('./auth');

const start = (app, pool) => {

    app.get('/callback/v1.0/dependencies', middleware, async (req, res) => {

    });

    app.put('/callback/v1.0/tenants/:tenantId', middleware, async (req, res) => {

    });
}

module.exports = {
    start
}