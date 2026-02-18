import React from 'react';
import { Star, MapPin } from 'lucide-react';

interface RecommendationCardProps {
    name: string;
    category: string;
    rating: number;
    reviews: number;
    location: string;
    image: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
    name,
    category,
    rating,
    reviews,
    location,
    image
}) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <div className="h-32 bg-gray-100 relative overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-gray-900">{rating}</span>
                </div>
            </div>
            <div className="p-4">
                <div className="text-xs text-orange-600 font-medium mb-1">{category}</div>
                <h4 className="font-bold text-gray-900 mb-1 truncate">{name}</h4>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    {location}
                </div>
                <div className="text-xs text-gray-400">
                    {reviews} reviews
                </div>
            </div>
        </div>
    );
};

export default RecommendationCard;
