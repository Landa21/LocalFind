import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface FavoriteItem {
    id: number | string;
    userName: string;
    userImage?: string;
    location: string;
    caption: string;
    rating: number;
    imageUrl?: string;
    initialLikes?: number;
}

interface FavoritesContextType {
    favorites: FavoriteItem[];
    addFavorite: (item: FavoriteItem) => void;
    removeFavorite: (id: number | string) => void;
    isFavorite: (id: number | string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
        try {
            const storedFavorites = localStorage.getItem('favorites');
            return storedFavorites ? JSON.parse(storedFavorites) : [];
        } catch (error) {
            console.error('Failed to parse favorites from localStorage:', error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error('Failed to save favorites to localStorage:', error);
        }
    }, [favorites]);

    const addFavorite = (item: FavoriteItem) => {
        setFavorites((prev) => {
            if (prev.some((fav) => fav.id === item.id)) {
                return prev;
            }
            return [...prev, item];
        });
    };

    const removeFavorite = (id: number | string) => {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
    };

    const isFavorite = (id: number | string) => {
        return favorites.some((item) => item.id === id);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
