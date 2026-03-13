const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountkey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkUser() {
    const email = 'thabouser@gmail.com';
    const snapshot = await db.collection('users').where('email', '==', email).get();
    
    if (snapshot.empty) {
        console.log('No user found with email:', email);
        return;
    }

    snapshot.forEach(doc => {
        console.log('User ID:', doc.id);
        console.log('User Data:', JSON.stringify(doc.data(), null, 2));
    });
}

checkUser().catch(console.error);
