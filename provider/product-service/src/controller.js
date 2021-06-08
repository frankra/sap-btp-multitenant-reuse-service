const { middleware } = require('./auth');

const start = (app, pool) => {
    
    app.get('/products', middleware, async (req, res) => {

    });
}

module.exports = {
    start
}