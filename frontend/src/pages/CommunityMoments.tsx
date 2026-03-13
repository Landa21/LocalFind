import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Search, Filter, Plus } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import ReviewCard from '../components/ReviewCard';
import MapPopup from '../components/MapPopup';
import UploadMomentPopup from '../components/UploadMomentPopup';
import { useDebounce } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

// Compress image to fit within Firestore's 1MB document limit
const compressImage = (dataUrl: string, maxWidth = 800, maxHeight = 800, quality = 0.6): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = dataUrl;
    });
};

const CommunityMoments: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const categories = ['All', 'Nature', 'Shopping', 'Cafe', 'Culture', 'Nightlife', 'Wellness', 'Entertainment', 'Food'];

    const [allMoments, setAllMoments] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'moments'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const momentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAllMoments(momentsData);
        }, (error) => {
            console.error("Error fetching moments:", error);
        });

        return () => unsubscribe();
    }, []);

    const handleLocationClick = (location: string) => {
        setSelectedLocation(location);
    };

    const handleShareMoment = async (newMoment: {
        userName: string;
        location: string;
        caption: string;
        rating: number;
        imageUrl: string;
        category: string;
    }) => {
        try {
            // Compress image to fit within Firestore's 1MB document limit
            let finalImageUrl = newMoment.imageUrl;
            if (newMoment.imageUrl && newMoment.imageUrl.startsWith('data:')) {
                finalImageUrl = await compressImage(newMoment.imageUrl);
            }

            const momentToAdd = {
                ...newMoment,
                imageUrl: finalImageUrl,
                userName: user?.displayName || user?.email?.split('@')[0] || 'You',
                userImage: user?.photoURL || null,
                userId: user?.uid || null,
                initialLikes: 0,
                likes: 0,
                comments: [],
                createdAt: new Date().toISOString()
            };
            await addDoc(collection(db, 'moments'), momentToAdd);
        } catch (error) {
            console.error("Error saving moment: ", error);
        }
    };

    const handleDeleteMoment = async (id: number | string) => {
        if (typeof id === 'string') {
            try {
                await deleteDoc(doc(db, 'moments', id));
            } catch (error) {
                console.error("Error deleting moment: ", error);
            }
        } else {
            setAllMoments(allMoments.filter(m => m.id !== id));
        }
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
                                onDelete={(moment.userId && user?.uid && moment.userId === user.uid) ? () => handleDeleteMoment(moment.id) : undefined}
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
