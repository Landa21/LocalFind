import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { ParallaxScroll } from '../components/ui/parallax-scroll';
import ReviewCard from '../components/ReviewCard';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites: React.FC = () => {
    const { favorites } = useFavorites();

    if (favorites.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <Compass className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">No favorites yet</h2>
                <p className="text-gray-500 max-w-sm">
                    Start exploring and like some community moments to see them here!
                </p>
                <Link to="/dashboard" className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors">
                    Explore Now
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold text-gray-900">Your Favorites</h1>
            <div className="h-[calc(100vh-200px)]">
                <ParallaxScroll
                    items={favorites}
                    renderItem={(item, index) => (
                        <ReviewCard
                            key={item.id}
                            {...item}
                            className="shadow-md border border-gray-100 h-96 w-full"
                        />
                    )}
                />
            </div>
        </div>
    );
};

export default Favorites;
