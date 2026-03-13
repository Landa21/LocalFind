import React, { useState, useEffect } from 'react';
import { 
    Search, 
    MoreVertical, 
    ShieldAlert, 
    CheckCircle2, 
    XCircle,
    Star,
    Trash2,
    Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminListings: React.FC = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

    const fetchListings = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/listings`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setListings(data);
            } else {
                toast.error('Failed to fetch listings');
            }
        } catch (error) {
            console.error('Error fetching listings:', error);
            toast.error('Error loading listings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this listing permanently?')) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/listings/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                toast.success('Listing deleted');
                setListings(listings.filter(listing => listing.id !== id));
            } else {
                toast.error('Failed to delete listing');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Error deleting listing');
        }
    };

    const handleToggleFeature = async (id: string, currentFeatured: boolean) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/listings/${id}/feature`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: !currentFeatured }),
                credentials: 'include'
            });

            if (response.ok) {
                toast.success(`Listing ${!currentFeatured ? 'featured' : 'unfeatured'}`);
                setListings(listings.map(listing => 
                    listing.id === id ? { ...listing, featured: !currentFeatured } : listing
                ));
            } else {
                toast.error('Failed to update feature status');
            }
        } catch (error) {
            console.error('Feature error:', error);
            toast.error('Error updating feature status');
        }
        setActionMenuOpen(null);
    };

    const filteredListings = listings.filter(listing => 
        (listing.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (listing.location?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (listing.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">Listings Management</h1>
                    <p className="text-gray-500 font-medium mt-2">View and manage all active, pending, and featured experiences.</p>
                </div>
            </header>

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search listings by title, location, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-orange-100"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Listing</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status & Featured</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700 text-sm">
                                {filteredListings.map((listing) => (
                                    <tr key={listing.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                    {listing.image ? (
                                                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{listing.title}</p>
                                                    <p className="text-gray-500 font-medium mt-0.5">{listing.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2 items-start">
                                                {listing.status === 'approved' ? (
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 font-bold rounded-full text-xs">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Approved
                                                    </span>
                                                ) : listing.status === 'pending' ? (
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 font-bold rounded-full text-xs">
                                                        <ShieldAlert className="w-3.5 h-3.5" />
                                                        Pending
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-full text-xs">
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        {listing.status}
                                                    </span>
                                                )}
                                                
                                                {listing.featured && (
                                                    <span className="flex items-center gap-1 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 font-bold rounded-full text-xs">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300">
                                            {listing.location}
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button 
                                                onClick={() => setActionMenuOpen(actionMenuOpen === listing.id ? null : listing.id)}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>

                                            {actionMenuOpen === listing.id && (
                                                <div className="absolute right-8 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-10">
                                                    <button 
                                                        onClick={() => handleToggleFeature(listing.id, listing.featured)}
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                                                    >
                                                        <Star className={`w-4 h-4 ${listing.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                                        {listing.featured ? 'Unfeature Listing' : 'Feature Listing'}
                                                    </button>
                                                    
                                                    {/* We can add an edit modal here later, for now just basic actions */}
                                                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                                                    
                                                    <button 
                                                        onClick={() => handleDelete(listing.id)}
                                                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-3 text-sm font-bold transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Remove Listing
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredListings.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-12 text-gray-500 font-medium">
                                            No listings found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminListings;
