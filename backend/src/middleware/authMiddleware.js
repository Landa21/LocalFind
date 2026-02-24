const admin = require('firebase-admin');

/**
 * Middleware to verify Firebase Session Cookie
 */
const checkAuth = async (req, res, next) => {
    const sessionCookie = req.cookies.session || '';

    if (!sessionCookie) {
        return res.status(401).send({ status: 'unauthenticated', message: 'No session cookie provided' });
    }

    try {
        // Verify the session cookie. In this case, we check if revoked is true
        // to ensure the session is still valid.
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decodedClaims;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).send({ status: 'unauthenticated', message: 'Invalid or expired session' });
    }
};

module.exports = checkAuth;
