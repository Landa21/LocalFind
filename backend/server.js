require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const checkAuth = require('./src/middleware/authMiddleware');

// Initialize Firebase Admin
const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY || './serviceAccountkey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Session Login
app.post('/api/sessionLogin', async (req, res) => {
    const { idToken } = req.body;
    console.log('--- Session Login Attempt ---');
    console.log('Received idToken:', idToken ? (idToken.substring(0, 10) + '...') : 'missing');

    if (!idToken) {
        return res.status(400).json({ error: 'Missing idToken' });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    try {
        // Verify the ID token first
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;
        console.log('Token verified for UID:', uid);

        // Initialize/Update User Profile in Firestore (Optional catch to prevent blocking session creation)
        try {
            const userRef = db.collection('users').doc(uid);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                await userRef.set({
                    uid,
                    email: email || '',
                    displayName: name || '',
                    photoURL: picture || '',
                    role: 'user',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    lastLogin: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log(`Created new profile for user: ${uid}`);
            } else {
                await userRef.update({
                    lastLogin: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log(`Updated last login for user: ${uid}`);
            }
        } catch (firestoreError) {
            console.error('Firestore Profile Sync Error (Non-blocking):', firestoreError.message);
            // We continue even if Firestore fails, as the auth session is primary
        }

        // Create the session cookie
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
        console.log('Session cookie created successfully');

        const options = { maxAge: expiresIn, httpOnly: true, secure: false }; // Set secure: true in production
        res.cookie('session', sessionCookie, options);
        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error('Session Login Fatal Error:', error);
        res.status(401).json({
            error: 'Authentication failed',
            message: error.message,
            code: error.code
        });
    }
});

// Session Logout
app.post('/api/sessionLogout', (req, res) => {
    res.clearCookie('session');
    res.status(200).send({ status: 'success' });
});

// Session Status
app.get('/api/sessionStatus', async (req, res) => {
    const sessionCookie = req.cookies.session || '';

    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        const userDoc = await db.collection('users').doc(decodedClaims.uid).get();
        const userData = userDoc.exists ? userDoc.data() : {};

        res.status(200).send({
            status: 'authenticated',
            user: { ...decodedClaims, ...userData }
        });
    } catch (error) {
        res.status(401).send({ status: 'unauthenticated' });
    }
});

// Protected Route Example
app.get('/api/protected/profile', checkAuth, async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.user.uid).get();
        if (!userDoc.exists) {
            return res.status(404).send('User profile not found');
        }
        res.status(200).send(userDoc.data());
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Update Role (Protected)
app.post('/api/protected/update-role', checkAuth, async (req, res) => {
    const { role } = req.body;

    if (!['user', 'experience_owner', 'admin'].includes(role)) {
        return res.status(400).send('Invalid role');
    }

    try {
        await db.collection('users').doc(req.user.uid).update({ role });
        res.status(200).send({ status: 'success', message: `Role updated to ${role}` });
    } catch (error) {
        res.status(500).send('Failed to update role');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
