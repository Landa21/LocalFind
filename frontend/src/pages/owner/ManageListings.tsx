import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    MapPin, 
    Star, 
    Edit3,
    Trash2,
    TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ManageListings: React.FC = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'experiences'), 
            where('ownerId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setListings(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await deleteDoc(doc(db, 'experiences', id));
            toast.success('Listing deleted successfully');
        } catch (error) {
            toast.error('Failed to delete listing');
        }
    };

    const filteredListings = listings.filter(item => 
        (item.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.location?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">My Listings</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage your hosted experiences and track their performance.</p>
                </div>
                <Link 
                    to="/owner/add-listing"
                    className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-[1.5rem] font-bold hover:shadow-xl transition-all active:scale-[0.98] w-fit"
                >
                    <Plus className="w-5 h-5" />
                    Add New Experience
                </Link>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-8 rounded-[2rem] border border-orange-100 dark:border-orange-800">
                    <p className="text-orange-600 dark:text-orange-400 font-bold mb-1">Total Views</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white">1,248</p>
                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold mt-2">
                        <TrendingUp className="w-4 h-4" />
                        +14% this month
                    </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-[2rem] border border-blue-100 dark:border-blue-800">
                    <p className="text-blue-600 dark:text-blue-400 font-bold mb-1">Active Listings</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white">{listings.length}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-8 rounded-[2rem] border border-purple-100 dark:border-purple-800">
                    <p className="text-purple-600 dark:text-purple-400 font-bold mb-1">Average Rating</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white">4.9</p>
                    <div className="flex items-center gap-1 text-orange-500 mt-2">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                </div>
            </div>

            {/* Listings Grid */}
            <div className="space-y-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search your experiences..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border-none shadow-sm focus:ring-2 focus:ring-orange-100 transition-all font-medium"
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500"></div>
                    </div>
                ) : filteredListings.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-20 text-center border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 font-medium">No listings found. Start by creating your first experience!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredListings.map((listing) => (
                            <div key={listing.id} className="group bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500">
                                <div className="h-56 relative overflow-hidden">
                                    <img 
                                        src={listing.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'} 
                                        alt={listing.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900">
                                        {listing.category}
                                    </div>
                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 backdrop-blur
                                        ${listing.status === 'approved' ? 'bg-green-500/80 text-white' : 'bg-orange-500/80 text-white'}
                                    `}>
                                        {listing.status || 'pending'}
                                    </div>
                                </div>
                                
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
                                                {listing.title}
                                            </h3>
                                            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {listing.location}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 border-t border-gray-50 dark:border-gray-700 pt-6 mt-2">
                                        <button className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 font-bold text-sm">
                                            <Edit3 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(listing.id)} className="p-3 bg-gray-50 dark:bg-gray-700 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageListings;
