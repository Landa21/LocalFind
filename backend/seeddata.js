const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const experiences = [
    {
        title: "Street Food Walking Tour",
        category: "Food",
        description: "Explore hidden culinary gems with a local foodie guide through the historic district.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop",
        duration: "3h",
        location: "Old Town",
        stops: "5+ stops",
        rating: 4.9,
        reviews: 124,
        featured: true,
        size: "large" // distinct property for layout if needed
    },
    {
        title: "Music & Dance",
        category: "Culture",
        description: "Traditional performances",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop",
        location: "City Center",
        featured: true
    },
    {
        title: "Photo Tour",
        category: "Photography",
        description: "Hidden gems & viewpoints",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
        location: "Scattered",
        featured: true
    },
    {
        title: "Coffee Culture",
        category: "Food",
        description: "Artisan cafés & roasters",
        image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop",
        location: "Downtown",
        featured: true
    },
    {
        title: "Local Markets",
        category: "Shopping",
        description: "Fresh produce & crafts",
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop",
        location: "Market Square",
        featured: true
    }
];

async function seedData() {
    const collectionRef = db.collection('experiences');

    for (const exp of experiences) {
        try {
            await collectionRef.add(exp);
            console.log(`Added: ${exp.title}`);
        } catch (error) {
            console.error(`Error adding ${exp.title}:`, error);
        }
    }

    console.log('Seeding complete!');
}

seedData();
