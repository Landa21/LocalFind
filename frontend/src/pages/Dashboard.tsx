import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Search } from 'lucide-react';
import WelcomePopup from '../components/WelcomePopup';
import ReviewCard from '../components/ReviewCard';
import EventCard from '../components/EventCard';
import RecommendationCard from '../components/RecommendationCard';
import { CardStack, type CardStackItem } from '../components/ui/card-stack';
import MapPopup from '../components/MapPopup';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [showWelcome, setShowWelcome] = useState(() => {
        return !sessionStorage.getItem('welcomeShown');
    });
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

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

    // Mock Data
    const recommendations = [
        { id: 1, name: 'The Hidden Garden', category: 'Nature', rating: 4.8, reviews: 124, location: 'City Center', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400' },
        { id: 2, name: 'Retro Vinyl Shop', category: 'Shopping', rating: 4.9, reviews: 85, location: 'East Side', image: 'https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?auto=format&fit=crop&q=80&w=400' },
        { id: 3, name: 'Artisan Coffee Co.', category: 'Cafe', rating: 4.7, reviews: 203, location: 'Downtown', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=400' },
    ];

    const upcomingEvents = [
        { id: 1, title: 'Jazz Night', date: 'Fri, 24 Feb', time: '19:00', location: 'The Blue Note', image: 'https://images.unsplash.com/photo-1511192394262-628d615e8743?auto=format&fit=crop&q=80&w=200', category: 'Music' },
        { id: 2, title: 'Pottery Workshop', date: 'Sat, 25 Feb', time: '10:00', location: 'Clay Studio', image: 'https://images.unsplash.com/photo-1565193566173-7a64b27876e9?auto=format&fit=crop&q=80&w=200', category: 'Art' },
    ];

    const reviews = [
        { id: 1, userName: 'Sarah M.', userImage: '', location: 'The Hidden Garden', caption: 'it was great!', rating: 5, imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600', initialLikes: 24 },
        { id: 2, userName: 'John D.', location: 'Retro Vinyl Shop', caption: 'Amazing collection!', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?auto=format&fit=crop&q=80&w=600', initialLikes: 12 },
        { id: 3, userName: 'Emily R.', location: 'Artisan Coffee Co.', caption: 'Best latte in town.', rating: 5, imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600', initialLikes: 45 },
    ];

    // Extend CardStackItem to include the review object
    type ReviewStackItem = CardStackItem & { review: typeof reviews[0] };

    const stackItems: ReviewStackItem[] = reviews.map(review => ({
        id: review.id,
        title: review.userName,
        description: review.caption,
        imageSrc: review.imageUrl,
        review: review
    }));

    return (
        <div className="space-y-8 pb-12">
            {showWelcome && (
                <WelcomePopup
                    userName={user?.displayName?.split(' ')[0] || 'Friend'}
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

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-gray-900">
                        Welcome back, {user?.displayName?.split(' ')[0] || 'Explorer'}!
                    </h1>
                    <p className="text-gray-500 mt-1 mb-6">Discover what's happening around you.</p>

                    <div className="relative group max-w-md">
                        <input
                            type="text"
                            placeholder="Search places..."
                            className="pl-12 pr-4 py-3.5 rounded-2xl bg-white border-0 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:shadow-md w-full transition-all"
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
                                            ? 'bg-gray-900 text-white shadow-md transform scale-105'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 hover:border-gray-200'
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
                            <h2 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-orange-500" />
                                Recommended for You
                            </h2>
                            <button className="text-sm font-medium text-orange-600 hover:text-orange-700">See All</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {recommendations.map(place => (
                                <RecommendationCard
                                    key={place.id}
                                    {...place}
                                    onLocationClick={handleLocationClick}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Community Feed / Reviews */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-serif text-xl font-bold text-gray-900">Community Moments</h2>
                            <button className="text-sm font-medium text-orange-600 hover:text-orange-700">View More</button>
                        </div>
                        <div className="flex items-center justify-center w-full">
                            <CardStack<ReviewStackItem>
                                items={stackItems}
                                cardWidth={400}
                                cardHeight={220}
                                renderCard={(item) => (
                                    <ReviewCard
                                        {...item.review}
                                        className="shadow-none border-none w-full h-full"
                                        onLocationClick={handleLocationClick}
                                    />
                                )}
                            />
                        </div>
                    </section>

                </div>

                {/* Sidebar */}
                <div className="space-y-8">

                    {/* Upcoming Events */}
                    <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 text-lg">Upcoming Events</h3>
                            <button className="text-xs font-bold text-orange-600 uppercase tracking-wide hover:text-orange-700">View All</button>
                        </div>
                        <div className="space-y-4">
                            {upcomingEvents.map(event => (
                                <EventCard key={event.id} {...event} />
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2.5 bg-gray-50 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors text-sm">
                            Find More Events
                        </button>
                    </section>



                </div>
            </div>
        </div>
    );
};

export default Dashboard;
