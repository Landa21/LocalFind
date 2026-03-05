import React, { useState, useEffect } from 'react';
import { Heart, MapPin, MessageCircle, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, increment, arrayUnion, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import CommentsModal from './CommentsModal';

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
    onDelete?: () => void;
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
    onLocationClick,
    onDelete
}) => {
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const { user } = useAuth();
    const [likes, setLikes] = useState(initialLikes);
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Check if the item is already favored locally
    const isLiked = isFavorite(id);

    const [comments, setComments] = useState<any[]>([]);

    useEffect(() => {
        if (typeof id === 'string') {
            const unsubscribe = onSnapshot(doc(db, 'moments', id), (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.likes !== undefined) setLikes(data.likes);
                    if (data.comments) setComments(data.comments);
                }
            });
            return () => unsubscribe();
        }
    }, [id]);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLiked) {
            setLikes(likes - 1);
            removeFavorite(id);
            if (typeof id === 'string') {
                await updateDoc(doc(db, 'moments', id), { likes: increment(-1) }).catch(console.error);
            }
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
                initialLikes: likes + 1
            });
            if (typeof id === 'string') {
                await updateDoc(doc(db, 'moments', id), { likes: increment(1) }).catch(console.error);
            }
        }
    };

    const handleAddComment = async (text: string) => {
        const newComment = {
            id: Date.now(),
            user: user?.displayName || user?.email?.split('@')[0] || 'You',
            text
        };
        setComments([...comments, newComment]);
        if (typeof id === 'string') {
            await updateDoc(doc(db, 'moments', id), {
                comments: arrayUnion(newComment)
            }).catch(console.error);
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
                        <img src={userImage} alt={userName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                        (userName || '?').charAt(0).toUpperCase()
                    )}
                </div>
                <div className="text-white drop-shadow-md">
                    <h4 className="font-bold text-sm leading-tight">{userName}</h4>
                    <div className="flex items-center text-xs text-white/90">
                        <MapPin className="w-3 h-3 mr-1" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onLocationClick?.(location || '');
                            }}
                            className="hover:underline decoration-white/50 underline-offset-2 transition-all hover:text-white truncate max-w-[150px] text-left"
                            title={location || ''}
                        >
                            {location || 'Unknown Location'}
                        </button>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this moment?')) {
                                    onDelete();
                                }
                            }}
                            className="bg-red-500/20 backdrop-blur-md p-1.5 rounded-lg text-red-100 hover:bg-red-500 hover:text-white transition-all border border-white/20 shadow-sm"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Content Container (Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 m-3 p-4 rounded-xl flex flex-col transition-all duration-300">
                <p
                    className={cn(
                        "text-white text-sm font-medium drop-shadow-md transition-all duration-300",
                        !isExpanded ? "line-clamp-2 mb-1" : "mb-1"
                    )}
                >
                    "{caption || 'No description available'}"
                </p>
                {(caption?.length || 0) > 80 ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="text-xs text-white/70 hover:text-white font-medium self-start mb-3 transition-colors"
                    >
                        {isExpanded ? 'See less' : 'See more'}
                    </button>
                ) : (
                    <div className="mb-3" />
                )}

                <div className="flex items-center gap-4">
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
                        onClick={() => setIsCommentsModalOpen(true)}
                        className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-orange-200 transition-colors"
                    >
                        <MessageCircle className="w-4 h-4" />
                        {comments.length}
                    </button>
                </div>
            </div>

            <CommentsModal
                isOpen={isCommentsModalOpen}
                onClose={() => setIsCommentsModalOpen(false)}
                comments={comments}
                onAddComment={handleAddComment}
                locationName={location}
            />
        </div>
    );
};

export default ReviewCard;
