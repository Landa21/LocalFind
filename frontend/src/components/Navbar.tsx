import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../lib/contexts/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="absolute top-0 left-0 w-full z-50 py-6 px-12 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2">
                    <MapPin className="text-orange-500 w-6 h-6" />
                    <div className="text-2xl font-bold tracking-tight font-serif">
                        LocalFind
                    </div>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-10 font-medium text-sm tracking-wide">
                <a href="#featured-experiences" className="hover:text-orange-400 transition-colors">Experiences</a>
                <a href="#" className="hover:text-orange-400 transition-colors">Destinations</a>
                <a href="#about" className="hover:text-orange-400 transition-colors">About</a>
                <a href="#become-local-guide" className="text-orange-500 font-bold hover:text-orange-400 transition-colors">Become a Host</a>
            </div>

            <div className="flex items-center gap-6">
                {!user ? (
                    <>
                        <Link to="/signin" className="text-white hover:text-orange-400 font-medium transition-colors">
                            Sign In
                        </Link>
                        <Link to="/signup" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg">
                            Sign Up
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/profile" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                            <UserIcon size={18} />
                            <span className="hidden sm:inline font-medium text-sm capitalize">
                                {user.displayName || user.email?.split('@')[0] || 'Profile'}
                            </span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-sm border border-white/10"
                        >
                            <LogOut size={16} />
                            <span className="text-sm">Sign Out</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
