import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Search } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import WelcomePopup from '../components/WelcomePopup';
import ReviewCard from '../components/ReviewCard';
import EventCard from '../components/EventCard';
import RecommendationCard from '../components/RecommendationCard';
import { CardStack, type CardStackItem } from '../components/ui/card-stack';
import MapPopup from '../components/MapPopup';
import PlaceDetailsModal, { type Place } from '../components/PlaceDetailsModal';

const Dashboard: React.FC = () => {
    const { user, userData } = useAuth();
    const [showWelcome, setShowWelcome] = useState(() => {
        return !sessionStorage.getItem('welcomeShown');
    });
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLocationClick = (location: string) => {
        setSelectedLocation(location);
    };

    const moods = [
        { id: 'all', label: 'All' },
        { id: 'chill', label: 'Chill' },
        { id: 'adventurous', label: 'Adventurous' },
        { id: 'romantic', label: 'Romantic' },
        { id: 'foodie', label: 'Foodie' },
        { id: 'nightlife', label: 'Nightlife' },
        { id: 'nature', label: 'Nature' },
        { id: 'cultural', label: 'Cultural' },
    ];
    const [selectedMood, setSelectedMood] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data
    const recommendations: Place[] = [
        {
            id: 1,
            name: 'The Hidden Garden',
            category: 'nature',
            rating: 4.8,
            reviews: 124,
            location: 'City Center',
            image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400',
            description: 'A sanctuary of peace in the heart of the city. This secret garden features rare botanical specimens and cozy nooks for reading.',
            address: '12 Secret Lane, City Center',
            website: 'https://garden.local',
            hours: '08:00 - 18:00',
            phone: '+27 12 345 6789'
        },
        {
            id: 2,
            name: 'Retro Vinyl Shop',
            category: 'cultural',
            rating: 4.9,
            reviews: 85,
            location: 'East Side',
            image: 'https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?auto=format&fit=crop&q=80&w=400',
            description: 'A treasure trove for music lovers. From rare jazz records to the latest indie releases, find your next favorite sound here.',
            address: '45 Groove St, East Side',
            website: 'https://vinyl.local',
            hours: '10:00 - 20:00',
            phone: '+27 11 222 3333'
        },
        {
            id: 3,
            name: 'Artisan Coffee Co.',
            category: 'foodie',
            rating: 4.7,
            reviews: 203,
            location: 'Downtown',
            image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=400',
            description: 'Where every cup is a masterpiece. We slow-roast our beans in-house to bring you the most authentic coffee experience in town.',
            address: '88 Caffeine Way, Downtown',
            website: 'https://artisan.coffee',
            hours: '07:00 - 17:00'
        },
        {
            id: 4,
            name: 'Sunset Peak',
            category: 'adventurous',
            rating: 4.9,
            reviews: 56,
            location: 'Mountain View',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
            description: 'A breathtaking viewpoint perfect for sunset hikes. The trail is moderate but rewarding with 360-degree views of the valley.',
            address: 'Peak Drive, Mountain View',
            hours: '24/7'
        },
    ];

    const upcomingEvents = [
        { id: 1, title: 'Jazz Night', date: 'Fri, 24 Feb', time: '19:00', location: 'The Blue Note', image: 'https://images.unsplash.com/photo-1562593623-9731b885cd0d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'nightlife' },
        { id: 2, title: 'Pottery Workshop', date: 'Sat, 25 Feb', time: '10:00', location: 'Clay Studio', image: 'https://images.unsplash.com/photo-1508269151431-a34449ca161d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'cultural' },
        { id: 3, title: 'Spa & Wellness Day', date: 'Sun, 26 Feb', time: '09:00', location: 'Zen Retreat', image: 'https://i.pinimg.com/1200x/4b/d4/3a/4bd43a1a21a45a6b98d7be56406e2fb5.jpg', category: 'chill' },
    ];

    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'moments'), orderBy('createdAt', 'desc'), limit(5));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const momentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(momentsData);
        });

        return () => unsubscribe();
    }, []);

    // Filtering Logic
    const filteredRecommendations = useMemo(() => {
        return recommendations.filter(item => {
            const matchesMood = selectedMood === 'all' || item.category.toLowerCase() === selectedMood.toLowerCase();
            const matchesSearch = searchQuery === '' ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                item.location.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesMood && matchesSearch;
        });
    }, [selectedMood, searchQuery]);

    const filteredEvents = useMemo(() => {
        return upcomingEvents.filter(item => {
            const matchesMood = selectedMood === 'all' || item.category.toLowerCase() === selectedMood.toLowerCase();
            const matchesSearch = searchQuery === '' ||
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesMood && matchesSearch;
        });
    }, [selectedMood, searchQuery]);

    const filteredReviews = useMemo(() => {
        return reviews.filter(item => {
            const matchesMood = selectedMood === 'all' || item.category.toLowerCase() === selectedMood.toLowerCase();
            const matchesSearch = searchQuery === '' ||
                item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesMood && matchesSearch;
        });
    }, [reviews, selectedMood, searchQuery]);

    // Extend CardStackItem to include the review object
    type ReviewStackItem = CardStackItem & { review: any };

    const stackItems: ReviewStackItem[] = useMemo(() => {
        return filteredReviews.map(review => ({
            id: review.id,
            title: review.userName,
            description: review.caption,
            imageSrc: review.imageUrl,
            review: review
        }));
    }, [filteredReviews]);

    return (
        <div className="space-y-8 pb-12 transition-colors duration-300">
            {showWelcome && (
                <WelcomePopup
                    userName={(userData?.displayName || user?.displayName)?.split(' ')[0] || 'Friend'}
                    onClose={() => {
                        setShowWelcome(false);
                        sessionStorage.setItem('welcomeShown', 'true');
                    }}
                />
            )}

            <MapPopup
                isOpen={!!selectedLocation}
                onClose={() => setSelectedLocation(null)}
                locationName={selectedLocation || ''}
            />

            <PlaceDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                place={selectedPlace}
            />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                        Welcome back, {(userData?.displayName || user?.displayName)?.split(' ')[0] || 'Explorer'}!
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6 transition-colors">Discover what's happening around you.</p>

                    <div className="relative group max-w-md">
                        <input
                            type="text"
                            placeholder="Search places..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border-0 dark:border dark:border-gray-700 shadow-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 focus:shadow-md w-full transition-all"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    </div>

                    {/* Mood Selector */}
                    <div className="mt-8">
                        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 mask-linear-fade">
                            {moods.map((mood) => (
                                <button
                                    key={mood.id}
                                    onClick={() => setSelectedMood(mood.id)}
                                    className={`
                                        whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                                        ${selectedMood === mood.id
                                            ? 'bg-gray-900 dark:bg-orange-600 text-white shadow-md transform scale-105'
                                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-orange-50/10 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                                        }
                                    `}
                                >
                                    {mood.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Recommendations */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
                                <Sparkles className="w-5 h-5 text-orange-500" />
                                Recommended for You
                            </h2>
                            <Link to="/user/recommendations" className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors">See All</Link>
                        </div>
                        {filteredRecommendations.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {filteredRecommendations.map(place => (
                                    <RecommendationCard
                                        key={place.id}
                                        {...place}
                                        onLocationClick={handleLocationClick}
                                        onClick={() => {
                                            setSelectedPlace(place);
                                            setIsModalOpen(true);
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-white dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 transition-colors">
                                <p className="text-gray-500 dark:text-gray-400">No recommendations found for this mood.</p>
                            </div>
                        )}
                    </section>

                    {/* Community Feed / Reviews */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white transition-colors">Community Moments</h2>
                             <Link to="/user/moments" className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors">View More</Link>
                        </div>
                        <div className="flex items-center justify-center w-full">
                            {stackItems.length > 0 ? (
                                <div className="dark:card-stack-dark scale-90 md:scale-100">
                                    <CardStack<ReviewStackItem>
                                        items={stackItems}
                                        cardWidth={300}
                                        cardHeight={380}
                                        overlap={0.55}
                                        spreadDeg={35}
                                        renderCard={(item) => (
                                            <ReviewCard
                                                {...item.review}
                                                id={item.review.id}
                                                className="shadow-none border-none w-full h-full"
                                                onLocationClick={handleLocationClick}
                                            />
                                        )}
                                    />
                                </div>
                            ) : (
                                <div className="py-8 w-full text-center bg-white dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 transition-colors">
                                    <p className="text-gray-500 dark:text-gray-400">No moments shared for this mood yet.</p>
                                </div>
                            )}
                        </div>
                    </section>

                </div>

                {/* Sidebar */}
                <div className="space-y-8">

                    {/* Upcoming Events */}
                    <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg transition-colors">Upcoming Events</h3>
                        </div>
                        {filteredEvents.length > 0 ? (
                            <div className="space-y-4">
                                {filteredEvents.map(event => (
                                    <EventCard key={event.id} {...event} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center bg-white dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 transition-colors">
                                <p className="text-gray-400 dark:text-gray-500 text-sm">No events found.</p>
                            </div>
                        )}
                        <Link to="/user/events" className="block w-full mt-6 py-2.5 bg-white dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:bg-orange-50/20 dark:hover:bg-gray-700 transition-colors text-sm border border-transparent dark:border-gray-700 text-center">
                            Find More Events
                        </Link>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
