import { Star, MapPin, Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

interface RecommendationCardProps {
    name: string;
    category: string;
    rating: number;
    reviews: number;
    location: string;
    image: string;
    onLocationClick?: (location: string) => void;
    onClick?: () => void;
    description?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
    name,
    category,
    rating,
    reviews,
    location,
    image,
    onLocationClick,
    onClick,
    description
}) => {
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const isLiked = isFavorite('rec-' + name);

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLiked) {
            removeFavorite('rec-' + name);
        } else {
            addFavorite({
                id: 'rec-' + name,
                userName: name,
                location: location,
                caption: description || '',
                rating: rating,
                imageUrl: image
            });
        }
    };
    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group hover:shadow-md transition-all cursor-pointer"
        >
            <div className="h-32 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{rating}</span>
                    </div>
                    <button
                        onClick={handleFavorite}
                        className={`p-2 rounded-lg backdrop-blur-md transition-all ${isLiked
                                ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                                : 'bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-white'
                            }`}
                    >
                        <Heart size={14} className={isLiked ? 'fill-white' : ''} />
                    </button>
                </div>
            </div>
            <div className="p-4">
                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">{category}</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1 truncate">{name}</h4>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onLocationClick?.(location);
                    }}
                    className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group/loc"
                >
                    <MapPin className="w-3 h-3 mr-1 group-hover/loc:text-orange-500" />
                    <span className="underline decoration-transparent group-hover/loc:decoration-orange-300 underline-offset-2 transition-all">
                        {location}
                    </span>
                </button>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                    {reviews} reviews
                </div>
            </div>
        </div>
    );
};

export default RecommendationCard;
