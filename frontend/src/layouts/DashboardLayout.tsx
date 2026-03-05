import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Compass,
    Heart,
    Bell
} from 'lucide-react';
import UserMenu from '../components/UserMenu';

const DashboardLayout: React.FC = () => {
    // const { logout, user } = useAuth(); // potentially unused now if only UserMenu needs it, but checked sidebar loop usage
    const location = useLocation();
    // const navigate = useNavigate(); // unused in this file now

    const menuItems = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { path: '/favorites', label: 'Favorites', icon: Heart },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full hidden md:flex flex-col z-20 transition-colors duration-300">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <Link to="/" className="flex items-center gap-2">
                        <Compass className="w-8 h-8 text-orange-500" />
                        <span className="font-serif text-xl font-bold text-gray-900 dark:text-white">LocalFind</span>
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
                                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-medium shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </aside>

            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden fixed top-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-20 px-4 py-3 flex items-center justify-between transition-colors duration-300">
                <Link to="/" className="flex items-center gap-2">
                    <Compass className="w-6 h-6 text-orange-500" />
                    <span className="font-serif text-lg font-bold dark:text-white">LocalFind</span>
                </Link>
                <UserMenu />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Desktop Top Navbar */}
                <header className="hidden md:flex items-center justify-end px-8 py-4 bg-transparent sticky top-0 z-50 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                        <UserMenu />
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
