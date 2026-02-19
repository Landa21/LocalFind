import React, { useState } from 'react';
import { Heart, MapPin, Star, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFavorites } from '../context/FavoritesContext';

interface ReviewCardProps {
    id: number | string;
    userName: string;
    userImage?: string;
    location: string;
    caption: string;
    rating: number; // 1-5
    imageUrl?: string;
    initialLikes?: number;
    className?: string;
    onLocationClick?: (location: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    id,
    userName,
    userImage,
    location,
    caption,
    rating,
    imageUrl,
    initialLikes = 0,
    className,
    onLocationClick
}) => {
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const [likes, setLikes] = useState(initialLikes);
    const [showComments, setShowComments] = useState(false);

    // Check if the item is already favored
    const isLiked = isFavorite(id);

    const [comments, setComments] = useState([
        { id: 1, user: 'Alex', text: 'Looks amazing! 😍' },
        { id: 2, user: 'Jordan', text: 'Adding this to my list.' },
        { id: 3, user: 'Taylor', text: 'I need to go here.' },
        { id: 4, user: 'Casey', text: 'Great photo!' },
    ]);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLiked) {
            setLikes(likes - 1);
            removeFavorite(id);
        } else {
            setLikes(likes + 1);
            addFavorite({
                id,
                userName,
                userImage,
                location,
                caption,
                rating,
                imageUrl,
                initialLikes
            });
        }
    };

    const hasImage = !!imageUrl;

    return (
        <div className={cn(
            "rounded-2xl h-full relative overflow-hidden transition-all group",
            className
        )}>
            {/* Full Background Image */}
            {hasImage ? (
                <img
                    src={imageUrl}
                    alt={userName}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600" />
            )}

            {/* Gradient Overlay for Text Readability (Top) */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

            {/* Gradient Overlay for Text Readability (Bottom - moves with text) */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

            {/* Header (Top Left) */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center gap-3 z-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold overflow-hidden bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-sm">
                    {userImage ? (
                        <img src={userImage} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                        userName.charAt(0).toUpperCase()
                    )}
                </div>
                <div className="text-white drop-shadow-md">
                    <h4 className="font-bold text-sm leading-tight">{userName}</h4>
                    <div className="flex items-center text-xs text-white/90">
                        <MapPin className="w-3 h-3 mr-1" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onLocationClick?.(location);
                            }}
                            className="hover:underline decoration-white/50 underline-offset-2 transition-all hover:text-white"
                        >
                            {location}
                        </button>
                    </div>
                </div>
                {/* Rating Badge */}
                <div className="ml-auto bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/20 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
                </div>
            </div>

            {/* Content Container (Bottom) */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 m-3 p-4 rounded-xl",
                "transition-all duration-300 ease-in-out",
                showComments
                    ? "bg-black/60 border border-white/20 shadow-lg max-h-[200px]"
                    : "bg-transparent border-transparent max-h-min",
                "flex flex-col"
            )}>
                {/* Scrollable Container with Hidden Scrollbar */}
                <div className="overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style>{`
                        .overflow-y-auto::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    <p className="text-white text-sm font-medium drop-shadow-md mb-3">
                        "{caption}"
                    </p>

                    <div className={cn(
                        "flex items-center gap-4 pt-3 transition-colors",
                        showComments ? "border-t border-white/20" : "border-transparent"
                    )}>
                        <button
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-1.5 text-xs font-bold transition-colors",
                                isLiked ? "text-red-400" : "text-white hover:text-red-400"
                            )}
                        >
                            <Heart className={cn("w-4 h-4", isLiked ? "fill-current" : "")} />
                            {likes}
                        </button>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className={cn(
                                "flex items-center gap-1.5 text-xs font-bold transition-colors",
                                showComments ? "text-orange-200" : "text-white hover:text-orange-200"
                            )}
                        >
                            <MessageCircle className="w-4 h-4" />
                            {comments.length}
                        </button>
                    </div>

                    {/* Comments Section (Expandable) */}
                    {showComments && (
                        <div className="mt-3 pt-3 border-t border-white/20 space-y-2 animate-in slide-in-from-bottom-2 fade-in duration-300">
                            {comments.map((comment: { id: number; user: string; text: string }) => (
                                <div key={comment.id} className="flex gap-2 items-start text-xs text-white/90">
                                    <span className="font-bold text-white">{comment.user}:</span>
                                    <span>{comment.text}</span>
                                </div>
                            ))}
                            <div className="pt-2">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="w-full bg-white/20 border-none rounded-full px-3 py-1.5 text-xs text-white placeholder:text-white/60 focus:ring-1 focus:ring-white/50 focus:outline-none"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const target = e.target as HTMLInputElement;
                                            if (target.value.trim()) {
                                                setComments([...comments, { id: Date.now(), user: 'You', text: target.value }]);
                                                target.value = '';
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
