import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Compass, 
    TrendingUp, 
    ArrowUpRight, 
    ShieldCheck, 
    BarChart3,
    Activity,
    Clock,
    MapPin
} from 'lucide-react';

const StatCard: React.FC<{
    title: string;
    value: string | number;
    change: string;
    icon: React.ElementType;
    color: string;
}> = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 transition-transform group-hover:scale-110 duration-500`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-4 h-4" />
                {change}
            </div>
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
);

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOwners: 0,
        totalExperiences: 0,
        pendingApprovals: 0,
        growthTrend: [] as number[],
        recentExperiences: [] as any[]
    });
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, logsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/dashboard-stats`, { credentials: 'include' }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/activity-logs`, { credentials: 'include' })
                ]);

                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }

                if (logsRes.ok) {
                    const logsData = await logsRes.json();
                    setLogs(logsData);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        
        // Polling for updates every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">Platform Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Welcome back, Administrator. Here's a pulse check of LocalFind.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-sm font-bold border border-green-100 dark:border-green-800 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        System Online
                    </div>
                </div>
            </header>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Explorers" 
                    value={stats.totalUsers} 
                    change="+5%" 
                    icon={Users} 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Business Owners" 
                    value={stats.totalOwners} 
                    change="+2%" 
                    icon={ShieldCheck} 
                    color="bg-purple-500" 
                />
                <StatCard 
                    title="Total Experiences" 
                    value={stats.totalExperiences} 
                    change="+12%" 
                    icon={Compass} 
                    color="bg-orange-500" 
                />
                <StatCard 
                    title="Pending Reviews" 
                    value={stats.pendingApprovals} 
                    change="New" 
                    icon={Activity} 
                    color="bg-red-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Growth Analytics</h3>
                            <p className="text-sm text-gray-500">Sign-up trends and platform activity</p>
                        </div>
                    </div>
                    
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {stats.growthTrend.map((height: number, i: number) => (
                            <div key={i} className="flex-1 group relative">
                                <div 
                                    className="w-full bg-orange-100 dark:bg-gray-700/50 rounded-t-lg group-hover:bg-orange-500 transition-all duration-500 cursor-pointer"
                                    style={{ height: `${height}%` }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity Table */}
                    <div className="mt-12 overflow-hidden border-t border-gray-50 dark:border-gray-700 pt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                            <Activity className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            {(isExpanded ? logs : logs.slice(0, 3)).length > 0 ? (isExpanded ? logs : logs.slice(0, 3)).map((log: any) => (
                                <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{log.message}</p>
                                            <p className="text-xs text-gray-500">{log.timestamp?._seconds ? new Date(log.timestamp?._seconds * 1000).toLocaleString() : 'Just now'}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700">
                                        {log.type.replace('_', ' ')}
                                    </span>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 py-4">No recent activity found.</p>
                            )}
                            
                            {logs.length > 3 && (
                                <button 
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="w-full mt-4 py-3 text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors border-t border-gray-100 dark:border-gray-700 pt-6"
                                >
                                    {isExpanded ? 'Show less' : `View more (${logs.length - 3} additional logs)`}
                                </button>
                            )}
                        </div>
                    </div>

                </div>

                {/* System Health */}
                <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <BarChart3 className="absolute -right-8 -top-8 w-48 h-48 text-white/5 rotate-12" />
                    <h3 className="text-xl font-bold mb-6 relative z-10">System Health</h3>
                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Database Load</span>
                                <span className="text-green-400 font-bold">Normal</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[12%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Cloud Storage</span>
                                <span className="text-orange-400 font-bold">68%</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[68%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Uptime</span>
                                <span className="text-blue-400 font-bold">99.9%</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[99%]" />
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-10 mb-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all border border-white/10 group">
                        <span className="flex items-center justify-center gap-2">
                            Management Center
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                    </button>

                    {/* Recently Added Experiences */}
                    <div className="border-t border-white/10 pt-8 relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Recently Added</h3>
                            <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            {stats.recentExperiences && stats.recentExperiences.length > 0 ? stats.recentExperiences.map((exp: any) => (
                                <div key={exp.id} className="flex gap-4 p-4 bg-white/5 rounded-2xl items-center transition-colors hover:bg-white/10 border border-white/5">
                                    <img 
                                        src={exp.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'} 
                                        alt={exp.title} 
                                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{exp.title}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {exp.location}</span>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${exp.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                                        {exp.status || 'pending'}
                                    </span>
                                </div>
                            )) : (
                                <p className="text-center text-gray-400 py-4">No recent experiences.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
