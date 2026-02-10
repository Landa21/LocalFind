import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Heart } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Upcoming Bookings', value: '0', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Saved Places', value: '0', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50' },
        { label: 'Reviews Given', value: '0', icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="font-serif text-3xl font-bold text-gray-900">
                    Welcome back, {user?.displayName?.split(' ')[0] || 'Explorer'}!
                </h1>
                <p className="text-gray-500 mt-2">Here's what's happening with your account.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Placeholder Content */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center py-20">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No activities yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                    Start exploring featured experiences to book your next adventure or save specific places for later.
                </p>
                <button className="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors">
                    Explore Experiences
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
