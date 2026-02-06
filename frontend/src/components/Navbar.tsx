import React from 'react';
import { MapPin } from 'lucide-react';

const Navbar: React.FC = () => {
    return (
        <nav className="absolute top-0 left-0 w-full z-10 py-6 px-12 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
                <MapPin className="text-orange-500 w-6 h-6" />
                <div className="text-2xl font-bold tracking-tight font-serif">
                    LocalFind
                </div>
            </div>

            <div className="hidden md:flex items-center gap-10 font-medium text-sm tracking-wide">
                <a href="#" className="hover:text-orange-400 transition-colors">Experiences</a>
                <a href="#" className="hover:text-orange-400 transition-colors">Destinations</a>
                <a href="#" className="text-orange-500 font-bold hover:text-orange-400 transition-colors">Become a Host</a>
                <a href="#about" className="hover:text-orange-400 transition-colors">About</a>
            </div>

            <div className="flex items-center gap-6">
                <button className="text-white hover:text-orange-400 font-medium transition-colors">
                    Sign In
                </button>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg">
                    Sign Up
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
