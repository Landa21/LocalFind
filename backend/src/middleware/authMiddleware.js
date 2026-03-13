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
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        
        // Fetch role from Firestore
        const db = admin.firestore();
        const userDoc = await db.collection('users').doc(decodedClaims.uid).get();
        const userData = userDoc.exists ? userDoc.data() : {};
        
        req.user = { 
            ...decodedClaims, 
            role: userData.role || 'user' 
        };
        
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).send({ status: 'unauthenticated', message: 'Invalid or expired session' });
    }
};

module.exports = checkAuth;
