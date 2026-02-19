import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    Settings,
    LogOut,
    Compass,
    Heart,
    Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout: React.FC = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/signin');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const menuItems = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { path: '/profile', label: 'My Profile', icon: User },
        { path: '/bookings', label: 'My Bookings', icon: Calendar },
        { path: '/favorites', label: 'Favorites', icon: Heart },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full hidden md:flex flex-col z-20">
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2">
                        <Compass className="w-8 h-8 text-orange-500" />
                        <span className="font-serif text-xl font-bold text-gray-900">LocalFind</span>
                    </Link>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-orange-50 text-orange-600 font-medium shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                            {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.displayName || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-20 px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <Compass className="w-6 h-6 text-orange-500" />
                    <span className="font-serif text-lg font-bold">LocalFind</span>
                </Link>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                    {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
