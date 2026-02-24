const express = require('express');
const admin = require('firebase-admin');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

// Initialize Firebase Admin
// Using lowercase 'k' as found in the directory listing
const serviceAccount = require('./serviceAccountkey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Session Login
app.post('/api/sessionLogin', async (req, res) => {
    const idToken = req.body.idToken;
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    try {
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
        const options = { maxAge: expiresIn, httpOnly: true, secure: false }; // secure: true in production
        res.cookie('session', sessionCookie, options);
        res.status(200).send({ status: 'success' });
    } catch (error) {
        console.error('Session Login Error:', error);
        res.status(401).send('Unauthorized');
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
        res.status(200).send({ status: 'authenticated', user: decodedClaims });
    } catch (error) {
        res.status(401).send({ status: 'unauthenticated' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
