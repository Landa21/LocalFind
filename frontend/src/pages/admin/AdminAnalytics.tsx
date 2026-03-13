import React, { useState, useEffect } from 'react';
import { 
    BarChart3, 
    TrendingUp, 
    MapPin, 
    Users, 
    Activity,
    Compass
} from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
}> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group flex items-center gap-4">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 transition-transform group-hover:scale-110 duration-500`}>
            <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const AdminAnalytics: React.FC = () => {
    const [analytics, setAnalytics] = useState({
        totalExperiences: 0,
        activeUsers: 0,
        totalLogins: 0,
        popularLocations: [] as { location: string; count: number }[],
        userGrowthTrend: [] as number[],
        monthlyActiveUsers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/analytics`, {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setAnalytics(data);
                } else {
                    toast.error('Failed to load analytics data');
                }
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
                toast.error('Error fetching analytics');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
        
        // Refresh every minute
        const interval = setInterval(fetchAnalytics, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    // Determine the max count for the location progress bars
    const maxLocationCount = Math.max(...analytics.popularLocations.map(l => l.count), 1);

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                    <p className="text-gray-500 font-medium mt-2">Deep dive into platform insights and engagement metrics.</p>
                </div>
                <div className="px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl text-sm font-bold border border-orange-100 dark:border-orange-800 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Live Data
                </div>
            </header>

            {/* High-level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Experiences" 
                    value={analytics.totalExperiences} 
                    icon={Compass} 
                    color="bg-orange-500" 
                />
                <StatCard 
                    title="Total Registered Users" 
                    value={analytics.activeUsers} 
                    icon={Users} 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Total Logins Recorded" 
                    value={analytics.totalLogins} 
                    icon={TrendingUp} 
                    color="bg-purple-500" 
                />
                <StatCard 
                    title="Estimated MAU" 
                    value={analytics.monthlyActiveUsers} 
                    icon={BarChart3} 
                    color="bg-green-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Popular Locations */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Most Popular Locations</h3>
                            <p className="text-sm text-gray-500">Based on experience listings</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {analytics.popularLocations.length > 0 ? analytics.popularLocations.map((loc, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-gray-700 dark:text-gray-300">{loc.location}</span>
                                    <span className="text-gray-900 dark:text-white">{loc.count} listings</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-red-500 rounded-full transition-all duration-1000" 
                                        style={{ width: `${(loc.count / maxLocationCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-8">Not enough data to determine popular locations.</p>
                        )}
                    </div>
                </div>

                {/* Simulated User Growth Chart */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">User Growth</h3>
                            <p className="text-sm text-gray-500">Trailing 30-day simulated trend</p>
                        </div>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-2 px-2 pt-8">
                        {analytics.userGrowthTrend.map((height, i) => (
                            <div key={i} className="w-full relative group">
                                <div 
                                    className="w-full bg-blue-100 dark:bg-gray-700/50 rounded-t-lg group-hover:bg-blue-500 transition-all duration-300 cursor-pointer"
                                    style={{ height: `${height}%`, minHeight: '10%' }}
                                />
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    {height} points
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
