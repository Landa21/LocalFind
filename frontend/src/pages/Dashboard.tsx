import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Sparkles } from 'lucide-react';
import WelcomePopup from '../components/WelcomePopup';
import ReviewCard from '../components/ReviewCard';
import EventCard from '../components/EventCard';
import RecommendationCard from '../components/RecommendationCard';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [showWelcome, setShowWelcome] = useState(true);

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
        { id: 2, userName: 'John D.', location: 'Retro Vinyl Shop', caption: 'Amazing collection!', rating: 4.5, initialLikes: 12 },
        { id: 3, userName: 'Emily R.', location: 'Artisan Coffee Co.', caption: 'Best latte in town.', rating: 5, initialLikes: 45 },
    ];

    return (
        <div className="space-y-8 pb-12">
            {showWelcome && (
                <WelcomePopup
                    userName={user?.displayName?.split(' ')[0] || 'Friend'}
                    onClose={() => setShowWelcome(false)}
                />
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-gray-900">
                        Welcome back, {user?.displayName?.split(' ')[0] || 'Explorer'}!
                    </h1>
                    <p className="text-gray-500 mt-1">Discover what's happening around you.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:shadow-sm transition-all relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search places..."
                            className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 w-full md:w-64 transition-all"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
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
                                <RecommendationCard key={place.id} {...place} />
                            ))}
                        </div>
                    </section>

                    {/* Community Feed / Reviews */}
                    <section>
                        <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Community Moments</h2>
                        <div className="space-y-6">
                            {reviews.map(review => (
                                <ReviewCard key={review.id} {...review} />
                            ))}
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

                    {/* Quick Stats/Activity */}
                    <section className="bg-orange-600 text-white rounded-3xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

                        <div className="relative z-10">
                            <h3 className="font-bold text-xl mb-1">Weekly Goal</h3>
                            <p className="text-orange-100 text-sm mb-6">You've visited 2 new places this week!</p>

                            <div className="flex items-end gap-1 mb-2">
                                <span className="text-4xl font-bold">2</span>
                                <span className="text-lg text-orange-200 mb-1">/ 5 places</span>
                            </div>

                            <div className="w-full bg-black/20 rounded-full h-2 mb-6">
                                <div className="bg-white rounded-full h-2 w-2/5"></div>
                            </div>

                            <button className="w-full py-2.5 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors text-sm shadow-sm">
                                View Achievements
                            </button>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
