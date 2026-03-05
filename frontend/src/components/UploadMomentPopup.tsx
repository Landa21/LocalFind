import React, { useState, useRef } from 'react';
import { X, Camera, MapPin, Star, Upload } from 'lucide-react';
import { cn } from '../lib/utils';

interface UploadMomentPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onShare: (moment: {
        userName: string;
        location: string;
        caption: string;
        rating: number;
        imageUrl: string;
        category: string;
    }) => void;
}

const UploadMomentPopup: React.FC<UploadMomentPopupProps> = ({ isOpen, onClose, onShare }) => {
    const [location, setLocation] = useState('');
    const [caption, setCaption] = useState('');
    const [rating, setRating] = useState(0);
    const [category, setCategory] = useState('Food');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = ['Nature', 'Shopping', 'Cafe', 'Culture', 'Nightlife', 'Wellness', 'Entertainment', 'Food'];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!location || !caption || !imagePreview) return;

        onShare({
            userName: 'You', // Hardcoded for demo
            location,
            caption,
            rating,
            imageUrl: imagePreview,
            category
        });

        // Reset and close
        setLocation('');
        setCaption('');
        setRating(0);
        setCategory('Food');
        setImagePreview(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
                {/* Header */}
                <div className="bg-orange-50 px-8 py-6 flex items-center justify-between border-b border-orange-100">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900">Share a Moment</h2>
                        <p className="text-orange-600/70 text-sm font-medium">Inspire the community with your discovery</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-orange-100 rounded-full transition-colors group"
                    >
                        <X size={20} className="text-orange-900 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Image Upload Area */}
                    <div className="relative group">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "aspect-[16/9] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden relative",
                                imagePreview
                                    ? "border-transparent"
                                    : "border-gray-200 bg-gray-50 hover:bg-orange-50 hover:border-orange-200"
                            )}
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
                                            <Upload className="text-white w-6 h-6" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                        <Camera className="text-orange-500 w-8 h-8" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Click to upload photo</p>
                                    <p className="text-gray-400 text-xs mt-1">JPEG, PNG or HEIC</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Location Name */}
                        <div className="relative">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Location Name</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-4 h-4" />
                                <input
                                    type="text"
                                    required
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Where was this?"
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all outline-none text-gray-900 font-medium"
                                />
                            </div>
                        </div>

                        {/* Category & Rating Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all outline-none text-gray-900 font-medium appearance-none"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Your Rating</label>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-4 py-3 rounded-2xl">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(prev => prev === star ? 0 : star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={20}
                                                className={cn(
                                                    "transition-colors",
                                                    star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Caption */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Caption</label>
                            <textarea
                                required
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Tell us about your experience..."
                                rows={3}
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all outline-none text-gray-900 font-medium resize-none"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl border border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!imagePreview || !location || !caption || rating === 0}
                            className="flex-[2] bg-orange-500 py-4 rounded-2xl font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-600 hover:shadow-orange-300 disabled:opacity-50 disabled:shadow-none transition-all scale-100 active:scale-95"
                        >
                            Share Moment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadMomentPopup;
