import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import ReviewCard from '../components/ReviewCard';
import { Heart, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Favorites: React.FC = () => {
    const { favorites, removeFavorite } = useFavorites();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring' as const,
                stiffness: 100
            }
        }
    };

    if (favorites.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    {/* Floating elements for empty state decoration */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-12 -left-12 w-16 h-16 bg-orange-100 rounded-full blur-2xl opacity-60"
                    />
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-8 -right-8 w-20 h-20 bg-rose-100 rounded-full blur-2xl opacity-60"
                    />

                    <div className="relative bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center text-center max-w-md border border-gray-50">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-rose-400 rounded-[2rem] flex items-center justify-center mb-8 shadow-lg shadow-orange-200 rotate-3 transform transition-transform hover:rotate-0 duration-500">
                            <Heart className="w-12 h-12 text-white fill-white/20" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Your heart is empty</h2>
                        <p className="text-gray-500 mb-10 leading-relaxed">
                            Start exploring the best hidden gems in town and save your favorite moments to see them here in your private collection.
                        </p>
                        <Link
                            to="/dashboard"
                            className="group flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-orange-600 transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-orange-200 active:scale-95"
                        >
                            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                            Discover Experiences
                            <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {/* Premium Hero Section */}
            <div className="relative rounded-[3rem] overflow-hidden mb-12 h-80 flex items-end">
                {/* Abstract Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-orange-50 -z-10" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -right-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, 30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-10 left-10 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl"
                />

                <div className="p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full text-xs font-bold text-orange-600 uppercase tracking-widest border border-white/50 shadow-sm">
                            <Sparkles className="w-3 h-3" /> Curated By You
                        </div>
                        <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
                            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600">Favorites</span>
                        </h1>
                        <p className="text-gray-600 font-medium text-lg max-w-lg">
                            A personal gallery of moments that caught your heart. {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <AnimatePresence mode="popLayout">
                    {favorites.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={itemVariants}
                            layout
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/50 h-[30rem] flex flex-col"
                        >
                            {/* Card Content using ReviewCard component as base but wrapping it for better layout control if needed */}
                            {/* However, the current ReviewCard might be too rigid for a custom bento layout, 
                                but let's try to style it first. */}
                            <ReviewCard
                                {...item}
                                className="shadow-none border-none h-full w-full"
                            />

                            {/* Custom Remove Button Overly */}
                            <button
                                onClick={() => removeFavorite(item.id)}
                                className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-2xl text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg translate-y-2 group-hover:translate-y-0"
                                title="Remove from favorites"
                            >
                                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
            {/* Floating Heart-Eyes Cartoon GIF */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8, type: "spring" }}
                className="fixed bottom-8 right-8 z-50 pointer-events-none select-none hidden md:block"
            >
                <div className="relative group pointer-events-auto">
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="bg-white/40 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden"
                    >
                        <img
                            src="/images/heart-eyes-explorer.png"
                            alt="Heart eyes cartoon"
                            className="w-40 h-40 object-contain"
                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Favorites;
