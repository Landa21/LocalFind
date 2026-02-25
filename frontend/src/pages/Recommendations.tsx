import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Filter, Search } from 'lucide-react';
import RecommendationCard from '../components/RecommendationCard';
import MapPopup from '../components/MapPopup';
import PlaceDetailsModal, { type Place } from '../components/PlaceDetailsModal';
import { useDebounce } from '../lib/utils';

const Recommendations: React.FC = () => {
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const categories = ['All', 'Nature', 'Shopping', 'Cafe', 'Culture', 'Nightlife', 'Wellness', 'Entertainment', 'Food'];

    const handleLocationClick = (location: string) => {
        setSelectedLocation(location);
    };

    // Mock Data (Ideally this would come from an API/Context)
    const allRecommendations: Place[] = [
        {
            id: 1,
            name: 'The Hidden Garden',
            category: 'Nature',
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
            category: 'Shopping',
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
            category: 'Cafe',
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
            name: 'Midnight Library',
            category: 'Culture',
            rating: 4.6,
            reviews: 92,
            location: 'Old Town',
            image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400',
            description: 'Books and beyond. Our extensive collection and 24/7 access make us the perfect retreat for late-night thinkers.',
            address: '32 Wisdom Ave, Old Town',
            hours: 'Open 24/7'
        },
        {
            id: 5,
            name: 'Skyline Terrace',
            category: 'Nightlife',
            rating: 4.9,
            reviews: 312,
            location: 'Harbor Front',
            image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400',
            description: 'The city at your feet. Enjoy premium cocktails and panoramic views from our award-winning rooftop terrace.',
            address: '100 Height Towers, Harbor Front',
            website: 'https://skyline.local',
            hours: '18:00 - 02:00'
        },
        {
            id: 6,
            name: 'Ocean Mist Spa',
            category: 'Wellness',
            rating: 4.8,
            reviews: 156,
            location: 'Beach Road',
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400',
            description: 'Rejuvenate your soul with treatments inspired by the sea. Our luxury spa offers full-body relaxation with a view of the waves.',
            address: '15 Shoreline Dr, Beach Road',
            hours: '09:00 - 21:00'
        },
        {
            id: 7,
            name: 'Vintage Cinema',
            category: 'Entertainment',
            rating: 4.7,
            reviews: 118,
            location: 'Cinema District',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=400',
            description: 'Experience the magic of film as it used to be. We screen classic masterpieces in a beautifully restored 1920s theater.',
            address: '22 Reel Road, Cinema District',
            website: 'https://vintagecinema.local',
            hours: '14:00 - 23:00'
        },
        {
            id: 8,
            name: 'Local Farmer Market',
            category: 'Food',
            rating: 4.9,
            reviews: 425,
            location: 'Green Plaza',
            image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=400',
            description: 'The freshest produce from the best local growers. Support our community and taste the difference of farm-to-table food.',
            address: 'Green Plaza Square',
            hours: 'Sat-Sun: 08:00 - 14:00'
        },
    ];

    const filteredRecommendations = allRecommendations.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

            {/* Back Button & Header */}
            <div className="flex flex-col space-y-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors w-fit group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Explorer</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-orange-500 mb-2">
                            <Sparkles size={20} />
                            <span className="text-xs font-bold uppercase tracking-widest">Personalized Selection</span>
                        </div>
                        <h1 className="font-serif text-4xl font-bold text-gray-900">Recommended for You</h1>
                        <p className="text-gray-500 mt-2 max-w-xl text-lg">
                            Pieces of the city handpicked based on your interests and community trends.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group min-w-[240px]">
                            <input
                                type="text"
                                placeholder="Filter results..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-200 w-full transition-all text-gray-900"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                className={`p-2.5 border shadow-sm rounded-xl transition-all ${isFilterMenuOpen ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-100 text-gray-600 hover:text-orange-600 hover:border-orange-100'}`}
                            >
                                <Filter size={20} />
                            </button>

                            {isFilterMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Filter by Category</div>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                setIsFilterMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedCategory === cat ? 'text-orange-600 font-bold bg-orange-50' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            {filteredRecommendations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRecommendations.map(place => (
                        <div key={place.id} className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both" style={{ animationDelay: `${place.id * 50}ms` }}>
                            <RecommendationCard
                                {...place}
                                onLocationClick={handleLocationClick}
                                onClick={() => {
                                    setSelectedPlace(place);
                                    setIsModalOpen(true);
                                }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No results found</h3>
                    <p className="text-gray-500 mt-2">We couldn't find any recommendations matching "{searchQuery}"</p>
                </div>
            )}

            {/* Empty State / Load More */}
            <div className="pt-8 flex flex-col items-center">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>
                <p className="text-gray-400 text-sm italic">Showing {filteredRecommendations.length} recommendations found for you.</p>
            </div>
        </div>
    );
};

export default Recommendations;
