const passport = require('passport');
const xssec = require('@sap/xssec');
const xsenv = require('@sap/xsenv');

const configure = () => {
    const JWTStrategy = xssec.JWTStrategy;
    const xsuaa_bind = xsenv.getServices({ uaa: { tag: 'xsuaa' } }).uaa;
    passport.use(new JWTStrategy(xsuaa_bind));
}

const middleware = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.statusCode(401);
        res.setHeader('content-type', 'application/json');
        res.end(
            JSON.stringify({
                statusCode: 401,
                errorCode: 'UNAUTHORIZED',
                message: 'Unauthorized',
            }),
        );
    }
}

module.exports = {
    configure,
    middleware
}