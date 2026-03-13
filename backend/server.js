require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
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

// Static files for uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Helper to log platform activity
async function logActivity(type, message, userId, metadata = {}) {
    try {
        await db.collection('activity_logs').add({
            type,
            message,
            userId,
            metadata,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
}

// Session Login
app.post('/api/sessionLogin', async (req, res) => {
    const { idToken, displayName } = req.body;
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

        // Initialize/Update User Profile in Firestore
        try {
            const userRef = db.collection('users').doc(uid);
            const userDoc = await userRef.get();

            const profileData = {
                uid,
                email: email || '',
                photoURL: picture || '',
                lastLogin: admin.firestore.FieldValue.serverTimestamp()
            };

            const incomingDisplayName = displayName || name || (email ? email.split('@')[0] : '');
            if (incomingDisplayName) {
                profileData.displayName = incomingDisplayName;
            }

            if (!userDoc.exists) {
                await userRef.set({
                    ...profileData,
                    role: 'user',
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log(`Created new profile for user: ${uid}`);
                await logActivity('user_signup', `New user signed up: ${email}`, uid);
            } else {
                await userRef.update(profileData);
                console.log(`Updated profile for user: ${uid}`);
                await logActivity('user_login', `User logged in: ${email}`, uid);
            }
        } catch (firestoreError) {
            console.error('Firestore Profile Sync Error (Non-blocking):', firestoreError.message);
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

// Update Profile (Protected)
app.post('/api/protected/update-profile', checkAuth, async (req, res) => {
    const { displayName, bio, photoURL } = req.body;

    try {
        const updateData = {};
        if (displayName) updateData.displayName = displayName;
        if (bio !== undefined) updateData.bio = bio;
        if (photoURL) updateData.photoURL = photoURL;

        await db.collection('users').doc(req.user.uid).update(updateData);
        res.status(200).send({ status: 'success', message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Failed to update profile:', error);
        res.status(500).send('Failed to update profile');
    }
});

// Profile Image Upload (Protected)
app.post('/api/protected/upload-profile-image', checkAuth, upload.single('profileImage'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    try {
        await db.collection('users').doc(req.user.uid).update({ photoURL: imageUrl });
        await logActivity('profile_image_update', `User updated profile image`, req.user.uid);
        res.status(200).json({
            status: 'success',
            imageUrl: imageUrl,
            message: 'Profile image updated successfully'
        });
    } catch (error) {
        console.error('Failed to update profile image in Firestore:', error);
        res.status(500).json({ error: 'Failed to update profile image' });
    }
});

// Admin Dashboard Stats
app.get('/api/admin/dashboard-stats', checkAuth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }

    try {
        const [usersSnap, experiencesSnap, recentExpSnap] = await Promise.all([
            db.collection('users').get(),
            db.collection('experiences').get(),
            db.collection('experiences').orderBy('createdAt', 'desc').limit(5).get()
        ]);

        const usersCount = usersSnap.size;
        const ownersCount = usersSnap.docs.filter(d => d.data().role === 'experience_owner').length;
        const experiencesCount = experiencesSnap.size;
        const pendingCount = experiencesSnap.docs.filter(d => d.data().status === 'pending').length;

        const recentExperiences = recentExpSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json({
            totalUsers: usersCount,
            totalOwners: ownersCount,
            totalExperiences: experiencesCount,
            pendingApprovals: pendingCount,
            growthTrend: [40, 65, 45, 80, 55, 90, 70, 85, 60, 100, 75, 95], // Mock trend for now
            recentExperiences
        });
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Admin Activity Logs
app.get('/api/admin/activity-logs', checkAuth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }

    try {
        const snapshot = await db.collection('activity_logs')
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();

        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(logs);
    } catch (error) {
        console.error('Failed to fetch activity logs:', error);
        res.status(500).send('Internal Server Error');
    }
});

// --- Admin Listings Management ---

// Get all listings
app.get('/api/admin/listings', checkAuth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }

    try {
        const snapshot = await db.collection('experiences')
            .orderBy('createdAt', 'desc') // Assuming there's a createdAt field, if not it might fall back to unordered
            .get();

        const listings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(listings);
    } catch (error) {
        console.error('Failed to fetch all listings:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete a listing
app.delete('/api/admin/listings/:id', checkAuth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }

    try {
        const listingId = req.params.id;
        await db.collection('experiences').doc(listingId).delete();
        await logActivity('admin_delete_listing', `Admin deleted listing ${listingId}`, req.user.uid);
        res.status(200).json({ status: 'success', message: 'Listing deleted' });
    } catch (error) {
        console.error('Failed to delete listing:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Toggle feature status
app.put('/api/admin/listings/:id/feature', checkAuth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }

    try {
        const listingId = req.params.id;
        const { featured } = req.body;
        
        await db.collection('experiences').doc(listingId).update({ featured });
        await logActivity('admin_feature_listing', `Admin ${featured ? 'featured' : 'unfeatured'} listing ${listingId}`, req.user.uid);
        
        res.status(200).json({ status: 'success', message: `Listing ${featured ? 'featured' : 'unfeatured'}` });
    } catch (error) {
        console.error('Failed to update feature status:', error);
        res.status(500).send('Internal Server Error');
    }
});

// --- Admin Analytics ---
app.get('/api/admin/analytics', checkAuth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }

    try {
        const [usersSnap, experiencesSnap, logsSnap] = await Promise.all([
            db.collection('users').get(),
            db.collection('experiences').get(),
            db.collection('activity_logs').where('type', '==', 'user_login').get()
        ]);

        const totalExperiences = experiencesSnap.size;
        const activeUsers = usersSnap.size;
        
        // Calculate popular locations
        const locationCounts = {};
        experiencesSnap.forEach(doc => {
            const data = doc.data();
            if (data.location) {
                // Simplified location matching (e.g. taking the city part)
                const mainLocation = data.location.split(',')[0].trim();
                locationCounts[mainLocation] = (locationCounts[mainLocation] || 0) + 1;
            }
        });

        // Convert to array and sort
        const popularLocations = Object.entries(locationCounts)
            .map(([location, count]) => ({ location, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5

        const totalLogins = logsSnap.size;

        res.status(200).json({
            totalExperiences,
            activeUsers,
            totalLogins: totalLogins > 0 ? totalLogins : Math.floor(activeUsers * 2.5), // Fallback if no logs
            popularLocations: popularLocations.length > 0 ? popularLocations : [
                { location: 'Cape Town', count: 12 },
                { location: 'Johannesburg', count: 8 },
                { location: 'Durban', count: 5 }
            ], // Fallback if no experiences have locations parsed
            userGrowthTrend: [10, 25, 30, 45, 60, 58, 75, 82, 90, 85, 95, 100], // Mock growth curve
            monthlyActiveUsers: Math.floor(activeUsers * 0.8) // Mock MAU as 80% of total users
        });

    } catch (error) {
        console.error('Failed to fetch analytics:', error);
        res.status(500).send('Internal Server Error');
    }
});

// --- Admin User Management ---
app.get('/api/admin/users', checkAuth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }

    try {
        const snapshot = await db.collection('users')
            .orderBy('createdAt', 'desc')
            .get();

        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/api/admin/users/:id/role', checkAuth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }

    try {
        const userId = req.params.id;
        const { role } = req.body;
        
        if (!['user', 'experience_owner', 'admin'].includes(role)) {
            return res.status(400).send('Invalid role');
        }

        await db.collection('users').doc(userId).update({ role });
        await logActivity('admin_update_user_role', `Admin updated user ${userId} to role ${role}`, req.user.uid);
        
        res.status(200).json({ status: 'success', message: `Role updated to ${role}` });
    } catch (error) {
        console.error('Failed to update user role:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/api/admin/users/:id/suspend', checkAuth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }

    try {
        const userId = req.params.id;
        const { suspended } = req.body;
        
        await db.collection('users').doc(userId).update({ suspended });
        await logActivity('admin_suspend_user', `Admin ${suspended ? 'suspended' : 'unsuspended'} user ${userId}`, req.user.uid);
        
        res.status(200).json({ status: 'success', message: `User ${suspended ? 'suspended' : 'unsuspended'}` });
    } catch (error) {
        console.error('Failed to update suspension status:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
