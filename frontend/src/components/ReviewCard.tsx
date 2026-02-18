import React, { useState } from 'react';
import { Heart, MapPin, Star } from 'lucide-react';

interface ReviewCardProps {
    userName: string;
    userImage?: string;
    location: string;
    caption: string;
    rating: number; // 1-5
    imageUrl?: string;
    initialLikes?: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    userName,
    userImage,
    location,
    caption,
    rating,
    imageUrl,
    initialLikes = 0
}) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = () => {
        if (isLiked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setIsLiked(!isLiked);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden">
                    {userImage ? (
                        <img src={userImage} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                        userName.charAt(0).toUpperCase()
                    )}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">{userName}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {location}
                    </div>
                </div>
            </div>

            {/* Image (Optional) */}
            {imageUrl && (
                <div className="aspect-square bg-gray-100 relative">
                    <img src={imageUrl} alt={`Review by ${userName}`} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-gray-900">{rating.toFixed(1)}</span>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="p-4">
                {!imageUrl && (
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                            />
                        ))}
                    </div>
                )}
                <p className="text-gray-600 text-sm mb-4">"{caption}"</p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        {likes} {likes === 1 ? 'Like' : 'Likes'}
                    </button>
                    <button className="text-sm font-medium text-gray-500 hover:text-gray-900">
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
