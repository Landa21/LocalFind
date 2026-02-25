import React from 'react';
import { X, Star, MapPin, Globe, Phone, Clock, Share2, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Place {
    id: number;
    name: string;
    category: string;
    rating: number;
    reviews: number;
    location: string;
    image: string;
    description?: string;
    address?: string;
    website?: string;
    phone?: string;
    hours?: string;
}

interface PlaceDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    place: Place | null;
}

const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({ isOpen, onClose, place }) => {
    if (!place) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors border border-white/20"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                            <img
                                src={place.image}
                                alt={place.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <div className="text-orange-400 font-bold text-xs uppercase tracking-widest mb-2">
                                    {place.category}
                                </div>
                                <h2 className="font-serif text-3xl font-bold">{place.name}</h2>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                                        <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                                        <span className="text-orange-700 font-bold text-sm">{place.rating}</span>
                                    </div>
                                    <span className="text-gray-400 text-sm">{place.reviews} reviews</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-orange-600 hover:border-orange-100 transition-all">
                                        <Share2 size={18} />
                                    </button>
                                    <button className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all">
                                        <Heart size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">About</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {place.description || "A hidden gem waiting to be discovered. Experience authentic local flavor and community-driven hospitality in this unique spot."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg text-orange-600">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">Location</div>
                                            <div className="text-sm text-gray-500">{place.address || `${place.location}, City`}</div>
                                        </div>
                                    </div>

                                    {place.hours && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg text-orange-600">
                                                <Clock size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">Opening Hours</div>
                                                <div className="text-sm text-gray-500">{place.hours}</div>
                                            </div>
                                        </div>
                                    )}

                                    {place.phone && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg text-orange-600">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">Contact</div>
                                                <div className="text-sm text-gray-500">{place.phone}</div>
                                            </div>
                                        </div>
                                    )}

                                    {place.website && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg text-orange-600">
                                                <Globe size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">Website</div>
                                                <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-600 hover:underline">
                                                    Visit official site
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 group">
                                        Plan a Visit
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PlaceDetailsModal;
