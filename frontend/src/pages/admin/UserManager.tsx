import React, { useState, useEffect } from 'react';
import { 
    Search, 
    MoreVertical, 
    User, 
    Mail, 
    Calendar,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserManager: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/users`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error loading users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
                credentials: 'include'
            });

            if (response.ok) {
                toast.success(`User role updated to ${newRole}`);
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                toast.error('Failed to update role');
            }
        } catch (error) {
            console.error('Role update error:', error);
            toast.error('An error occurred while updating role');
        }
        setActionMenuOpen(null);
    };

    const handleSuspendToggle = async (userId: string, isSuspended: boolean) => {
        if (!window.confirm(`Are you sure you want to ${isSuspended ? 'unsuspend' : 'suspend'} this user?`)) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/admin/users/${userId}/suspend`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ suspended: !isSuspended }),
                credentials: 'include'
            });

            if (response.ok) {
                toast.success(`User ${!isSuspended ? 'suspended' : 'unsuspended'} successfully`);
                setUsers(users.map(u => u.id === userId ? { ...u, suspended: !isSuspended } : u));
            } else {
                toast.error('Failed to update suspension status');
            }
        } catch (error) {
            console.error('Suspension update error:', error);
            toast.error('An error occurred');
        }
        setActionMenuOpen(null);
    };

    const filteredUsers = users.filter(user => 
        (user.displayName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            <header>
                <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <p className="text-gray-500 mt-2 font-medium">Manage permissions, roles, and oversee the LocalFind community.</p>
            </header>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border-none shadow-sm focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-6 py-3.5 bg-gray-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-md">
                        <ArrowUpDown className="w-4 h-4" />
                        Sort Results
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-gray-700">
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-800/50">User</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-800/50">Role</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-800/50">Joined</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-800/50">Status</th>
                                <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-800/50 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-gray-500 font-medium">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 font-bold overflow-hidden shadow-sm">
                                                    {user.photoURL ? (
                                                        <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-6 h-6" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{user.displayName || 'Anonymous'}</p>
                                                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1
                                                ${user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:border-red-800' : 
                                                  user.role === 'experience_owner' ? 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800' : 
                                                  'bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:border-gray-600'}
                                            `}>
                                                {user.role === 'admin' && <ShieldAlert className="w-3 h-3" />}
                                                {user.role === 'experience_owner' ? 'Owner' : user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                                                <Calendar className="w-4 h-4" />
                                                {user.createdAt?._seconds ? new Date(user.createdAt._seconds * 1000).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.suspended ? (
                                                <div className="flex items-center gap-1.5 text-red-500 text-sm font-bold bg-red-50 dark:bg-red-900/20 w-fit px-3 py-1 rounded-lg">
                                                    <XCircle className="w-4 h-4" />
                                                    Suspended
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-green-500 text-sm font-bold bg-green-50 dark:bg-green-900/20 w-fit px-3 py-1 rounded-lg">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Active
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right relative">
                                            <div className="relative inline-block text-left">
                                                <button 
                                                    onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                                                >
                                                    <MoreVertical className="w-5 h-5 text-gray-400" />
                                                </button>

                                                {actionMenuOpen === user.id && (
                                                    <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-10 overflow-hidden">
                                                        <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-700 mb-1">
                                                            Actions
                                                        </div>
                                                        <button 
                                                            onClick={() => handleRoleChange(user.id, 'user')}
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300"
                                                        >
                                                            Make Traveler
                                                        </button>
                                                        <button 
                                                            onClick={() => handleRoleChange(user.id, 'experience_owner')}
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300"
                                                        >
                                                            Make Owner
                                                        </button>
                                                        <button 
                                                            onClick={() => handleRoleChange(user.id, 'admin')}
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-red-600 dark:text-red-400"
                                                        >
                                                            Make Admin
                                                        </button>
                                                        
                                                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                                                        
                                                        <button 
                                                            onClick={() => handleSuspendToggle(user.id, !!user.suspended)}
                                                            className={`w-full text-left px-4 py-2 text-sm font-bold flex items-center gap-2 ${user.suspended ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                                                        >
                                                            {user.suspended ? (
                                                                <><CheckCircle2 className="w-4 h-4"/> Reactivate Account</>
                                                            ) : (
                                                                <><XCircle className="w-4 h-4"/> Suspend Account</>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManager;
