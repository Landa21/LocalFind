import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Filter, Search } from 'lucide-react';
import EventCard from '../components/EventCard';
import { useDebounce } from '../lib/utils';

const Events: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedMonth, setSelectedMonth] = useState('All');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const categories = ['All', 'Music', 'Art', 'Food', 'Culture', 'Sports', 'Wellness'];

    // Mock Data
    const allEvents = [
        { id: 1, title: 'Jazz Night', date: 'Fri, 24 Feb', time: '19:00', location: 'The Blue Note', image: 'https://images.unsplash.com/photo-1562593623-9731b885cd0d?q=80&w=1470&auto=format&fit=crop', category: 'Music' },
        { id: 2, title: 'Pottery Workshop', date: 'Sat, 25 Feb', time: '10:00', location: 'Clay Studio', image: 'https://images.unsplash.com/photo-1508269151431-a34449ca161d?q=80&w=1470&auto=format&fit=crop', category: 'Art' },
        { id: 3, title: 'Street Food Festival', date: 'Sun, 26 Feb', time: '12:00', location: 'Green Plaza', image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1470&auto=format&fit=crop', category: 'Food' },
        { id: 4, title: 'Photography Walk', date: 'Sat, 4 Mar', time: '09:00', location: 'Old Town', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1470&auto=format&fit=crop', category: 'Art' },
        { id: 5, title: 'Rooftop Yoga', date: 'Sun, 5 Mar', time: '07:30', location: 'Skyline Terrace', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1470&auto=format&fit=crop', category: 'Wellness' },
        { id: 6, title: 'Local Indie Gig', date: 'Fri, 10 Mar', time: '20:30', location: 'The Underground', image: 'https://images.unsplash.com/photo-1514525253344-f81bad3b057f?q=80&w=1470&auto=format&fit=crop', category: 'Music' },
        { id: 7, title: 'Traditional Dance Show', date: 'Sat, 11 Mar', time: '18:00', location: 'Cultural Center', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1470&auto=format&fit=crop', category: 'Culture' },
        { id: 8, title: 'Wine Tasting', date: 'Sun, 12 Mar', time: '15:00', location: 'Vineyard Estate', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1470&auto=format&fit=crop', category: 'Food' },
    ];

    const filteredEvents = allEvents.filter(event => {
        const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
        const matchesMonth = selectedMonth === 'All' || event.date.includes(selectedMonth);
        const matchesSearch = event.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
        return matchesCategory && matchesMonth && matchesSearch;
    });

    return (
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Back Button & Header */}
            <div className="flex flex-col space-y-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors w-fit group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-orange-500 mb-2">
                            <Calendar size={20} />
                            <span className="text-xs font-bold uppercase tracking-widest">Community Happenings</span>
                        </div>
                        <h1 className="font-serif text-4xl font-bold text-gray-900">Upcoming Events</h1>
                        <p className="text-gray-500 mt-2 max-w-xl text-lg">
                            Don't miss out on the best local experiences, workshops, and gatherings happening this week.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`
                                whitespace-nowrap px-5 py-2 rounded-xl text-sm font-medium transition-all
                                ${selectedCategory === cat
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 md:min-w-[240px]">
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-200 focus:ring-2 focus:ring-orange-100 text-sm w-full transition-all outline-none text-gray-900"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2.5 rounded-xl transition-all border ${isMenuOpen ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-gray-50 text-gray-600 border-transparent hover:text-orange-600 hover:bg-orange-50'}`}
                        >
                            <Filter size={18} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Filter by Month</div>
                                {['All', 'Feb', 'Mar'].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => {
                                            setSelectedMonth(m);
                                            setIsMenuOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedMonth === m ? 'text-orange-600 font-bold bg-orange-50' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {m === 'All' ? 'All Months' : `${m} 2026`}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredEvents.map((event, idx) => (
                        <div
                            key={event.id}
                            className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both h-40"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <EventCard {...event} className="border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No events found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                </div>
            )}

            {/* Footer info */}
            <div className="pt-8 flex flex-col items-center">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>
                <p className="text-gray-400 text-sm italic">Join our community and create your own amazing experiences.</p>
            </div>
        </div>
    );
};

export default Events;
