const { middleware } = require('./auth');

const start = (app, db) => {

    app.get('/api/products', middleware, async (req, res) => {
        const result = await db.query(req.tenantId, `
            SELECT * FROM poc.products;
        `);

        res
            .status(200)
            .json(result.rows);
    });

    app.post('/api/products', middleware, async (req, res) => {
        const product = req.body;
        await db.query(req.tenantId, `
            INSERT INTO poc.products (
                name,
                price,
                tenant_id
            ) values (
                $1,
                $2,
                $3
            );
        `, [
            product.name,
            product.price,
            req.tenantId
        ]);

        res
            .status(200)
            .json(product);
    });

    app.put('/api/products/:id', middleware, async (req, res) => {
        const product = req.body;
        await db.query(req.tenantId, `
            UPDATE poc.products SET
                name = $1,
                price = $2
            WHERE 
                id = $3;
        `, [
            product.name,
            product.price,
            //key
            req.params.id
        ]);

        res
            .status(200)
            .json(product);
    });

    app.delete('/api/products/:id', middleware, async (req, res) => {
        await db.query(req.tenantId, `
            DELETE FROM poc.products 
            WHERE 
                id = $1;
        `, [
            req.params.id
        ]);

        res
            .status(201)
            .send();
    });
}

module.exports = {
    start
}