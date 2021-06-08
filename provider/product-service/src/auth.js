const passport = require('passport');
const xssec = require('@sap/xssec');
const xsenv = require('@sap/xsenv');

const configure = (app) => {
    const JWTStrategy = xssec.JWTStrategy;
    const xsuaa_bind = xsenv.getServices({ uaa: { tag: 'xsuaa' } }).uaa;
    passport.use(new JWTStrategy(xsuaa_bind));

    app.use(passport.initialize());
    app.use(passport.authenticate('JWT', { session: false }));
}

const middleware = (req, res, next) => {
    if (req.user) {
        req.tenantId = req.tokenInfo.getZoneId();
        next();
    } else {
        res
            .status(401)
            .json(
                {
                    statusCode: 401,
                    errorCode: 'UNAUTHORIZED',
                    message: 'Unauthorized',
                }
            );
    }
}

module.exports = {
    configure,
    middleware
}