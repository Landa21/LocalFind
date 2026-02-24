import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Search, Filter, Plus } from 'lucide-react';
import ReviewCard from '../components/ReviewCard';
import MapPopup from '../components/MapPopup';
import UploadMomentPopup from '../components/UploadMomentPopup';
import { useDebounce } from '../lib/utils';

const CommunityMoments: React.FC = () => {
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const categories = ['All', 'Nature', 'Shopping', 'Cafe', 'Culture', 'Nightlife', 'Wellness', 'Entertainment', 'Food'];

    // Mock Data
    const [allMoments, setAllMoments] = useState([
        { id: 1, userName: 'Sarah M.', location: 'The Hidden Garden', caption: 'It was great!', rating: 5, imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600', initialLikes: 24, category: 'Nature' },
        { id: 2, userName: 'John D.', location: 'Retro Vinyl Shop', caption: 'Amazing collection!', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?auto=format&fit=crop&q=80&w=600', initialLikes: 12, category: 'Shopping' },
        { id: 3, userName: 'Emily R.', location: 'Artisan Coffee Co.', caption: 'Best latte in town.', rating: 5, imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600', initialLikes: 45, category: 'Cafe' },
        { id: 4, userName: 'Michael B.', location: 'Midnight Library', caption: 'A quiet place to read.', rating: 4, imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600', initialLikes: 18, category: 'Culture' },
        { id: 5, userName: 'Jessica K.', location: 'Skyline Terrace', caption: 'Stunning city views.', rating: 5, imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600', initialLikes: 56, category: 'Nightlife' },
        { id: 6, userName: 'David L.', location: 'Ocean Mist Spa', caption: 'Feeling recharged.', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600', initialLikes: 32, category: 'Wellness' },
        { id: 7, userName: 'Sophia W.', location: 'Vintage Cinema', caption: 'Classic vibes.', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600', initialLikes: 21, category: 'Entertainment' },
        { id: 8, userName: 'Ryan P.', location: 'Local Farmer Market', caption: 'Fresh produce everywhere!', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=600', initialLikes: 38, category: 'Food' },
    ]);

    const handleLocationClick = (location: string) => {
        setSelectedLocation(location);
    };

    const handleShareMoment = (newMoment: {
        userName: string;
        location: string;
        caption: string;
        rating: number;
        imageUrl: string;
        category: string;
    }) => {
        const momentToAdd = {
            ...newMoment,
            id: Date.now(),
            initialLikes: 0
        };
        setAllMoments([momentToAdd, ...allMoments]);
    };

    const handleDeleteMoment = (id: number | string) => {
        setAllMoments(allMoments.filter(m => m.id !== id));
    };

    const filteredMoments = allMoments.filter(moment => {
        const matchesSearch = moment.userName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            moment.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            moment.caption.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || moment.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <MapPopup
                isOpen={!!selectedLocation}
                onClose={() => setSelectedLocation(null)}
                locationName={selectedLocation || ''}
            />

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
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-orange-500 mb-2">
                            <MessageCircle size={20} />
                            <span className="text-xs font-bold uppercase tracking-widest">Community Feed</span>
                        </div>
                        <h1 className="font-serif text-4xl font-bold text-gray-900">Community Moments</h1>
                        <p className="text-gray-500 mt-2 max-w-xl text-lg">
                            See what the community is saying about their favorite hidden gems.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsUploadPopupOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 hover:shadow-orange-300 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Share a Moment</span>
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                    <div className="relative group flex-1 md:min-w-[320px]">
                        <input
                            type="text"
                            placeholder="Search moments by user, place or caption..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-200 focus:ring-2 focus:ring-orange-100 text-sm w-full transition-all outline-none text-gray-900"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            className={`p-2.5 border shadow-sm rounded-xl transition-all ${isFilterMenuOpen ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-gray-50 border-transparent text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
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

            {/* Moments Grid */}
            {filteredMoments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMoments.map((moment, idx) => (
                        <div
                            key={moment.id}
                            className="h-[400px] animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <ReviewCard
                                {...moment}
                                className="border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all"
                                onLocationClick={handleLocationClick}
                                onDelete={moment.userName === 'You' ? () => handleDeleteMoment(moment.id) : undefined}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No moments found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                </div>
            )}

            {/* Footer info */}
            <div className="pt-8 flex flex-col items-center">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>
                <p className="text-gray-400 text-sm italic">Share your own moments and inspire others.</p>
            </div>
            <UploadMomentPopup
                isOpen={isUploadPopupOpen}
                onClose={() => setIsUploadPopupOpen(false)}
                onShare={handleShareMoment}
            />
        </div>
    );
};

export default CommunityMoments;
