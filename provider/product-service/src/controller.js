const { middleware } = require('./auth');

const start = (app, pool) => {

    app.get('/api/products', middleware, async (req, res) => {
        const result = await pool.query(`
            SELECT * FROM prod.products
            WHERE tenant_id = $1;
        `, [req.tenantId]);

        res
            .status(200)
            .json(result.rows);
    });

    app.post('/api/products', middleware, async (req, res) => {
        const product = req.body;
        const result = await pool.query(`
            INSERT INTO prod.products (
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
        const result = await pool.query(`
            UPDATE prod.products SET
                name = $1,
                price = $2
            WHERE 
                id = $3 AND
                tenant_id = $4;
        `, [
            product.name,
            product.price,
            //key
            req.params.id,
            req.tenantId
        ]);

        res
            .status(200)
            .json(product);
    });

    app.delete('/api/products/:id', middleware, async (req, res) => {
        await pool.query(`
            DELETE FROM prod.products 
            WHERE 
                id = $1 AND
                tenant_id = $1;
        `, [
            req.params.id,
            req.tenantId
        ]);

        res
            .status(201)
            .send();
    });
}

module.exports = {
    start
}