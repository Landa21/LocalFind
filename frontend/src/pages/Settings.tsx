import React, { useState } from 'react';
import {
    Lock,
    Bell,
    Trash2,
    Shield,
    Palette,
    Globe,
    Mail,
    Smartphone,
    Moon,
    Sun,
    Monitor,
    Eye,
    UserCheck,
    MapPin,
    Star,
    Ghost,
    Clock,
    Bookmark
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { auth, googleProvider, appleProvider } from '../config/firebase';
import {
    linkWithPopup,
    unlink,
    deleteUser
} from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
    const { logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [activeSection, setActiveSection] = useState('preferences');
    const [profileVisibility, setProfileVisibility] = useState('public');

    const sections = [
        { id: 'preferences', label: 'Preferences', icon: Globe },
        { id: 'security', label: 'Account & Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'privacy', label: 'Privacy & Data', icon: Shield },
    ];

    const handleDeleteAccount = async () => {
        if (!auth.currentUser) {
            toast.error('No user is logged in.');
            return;
        }

        if (window.confirm('Are you sure you want to delete your account? This action is permanent and cannot be undone.')) {
            try {
                await deleteUser(auth.currentUser);
                toast.success('Account deleted successfully.');
                await logout(); // Ensure user is logged out after deletion
            } catch (error: any) {
                if (error.code === 'auth/requires-recent-login') {
                    toast.error('Please re-authenticate to delete your account.');
                } else {
                    toast.error(error.message);
                }
            }
        }
    };

    const handleLinkAccount = async (providerName: 'google' | 'apple') => {
        if (!auth.currentUser) return;
        const provider = providerName === 'google' ? googleProvider : appleProvider;

        try {
            await linkWithPopup(auth.currentUser, provider);
            toast.success(`Account successfully linked with ${providerName.charAt(0).toUpperCase() + providerName.slice(1)}!`);
        } catch (error: any) {
            if (error.code === 'auth/credential-already-in-use') {
                toast.error('This social account is already linked to another user.');
            } else {
                toast.error(error.message);
            }
        }
    };

    const handleUnlinkAccount = async (providerId: string) => {
        if (!auth.currentUser) return;
        if (auth.currentUser.providerData.length <= 1) {
            toast.error('You must have at least one sign-in method linked.');
            return;
        }

        try {
            await unlink(auth.currentUser, providerId);
            toast.success('Account unlinked successfully.');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const isProviderLinked = (providerId: string) => {
        return auth.currentUser?.providerData.some(p => p.providerId === providerId);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Settings Navigation Sidebar */}
            <aside className="w-full md:w-80 shrink-0">
                <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 p-8 shadow-sm sticky top-24 transition-colors duration-300">
                    <div className="space-y-4">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${isActive
                                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-bold shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'}`} />
                                    <span>{section.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
                <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors duration-300">
                    <div className="p-10 md:p-16">
                        <div className="max-w-4xl mx-auto">
                            {/* Preferences Section */}
                            {activeSection === 'preferences' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <section>
                                        <div className="flex items-center gap-6 mb-10">
                                            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600">
                                                <Globe className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">General Preferences</h3>
                                        </div>
                                        <div className="space-y-6">
                                            {/* Language Preference */}
                                            <div className="flex items-center justify-between p-6 rounded-[32px] bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 group hover:border-orange-200 dark:hover:border-orange-900/30 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-gray-400 group-hover:text-orange-500 transition-colors">
                                                        <Globe className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">Language</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred language</p>
                                                    </div>
                                                </div>
                                                <select className="bg-white dark:bg-gray-800 border-none text-sm font-bold text-gray-900 dark:text-white focus:ring-0 cursor-pointer rounded-xl px-4 py-2 shadow-sm">
                                                    <option>English (US)</option>
                                                    <option>French</option>
                                                    <option>Spanish</option>
                                                </select>
                                            </div>

                                            {/* Timezone Preference */}
                                            <div className="flex items-center justify-between p-6 rounded-[32px] bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 group hover:border-orange-200 dark:hover:border-orange-900/30 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-gray-400 group-hover:text-orange-500 transition-colors">
                                                        <Clock className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">Timezone</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Set your local time</p>
                                                    </div>
                                                </div>
                                                <select className="bg-white dark:bg-gray-800 border-none text-sm font-bold text-gray-900 dark:text-white focus:ring-0 cursor-pointer rounded-xl px-4 py-2 shadow-sm">
                                                    <option>UTC-5 (New York)</option>
                                                    <option>UTC+1 (Paris)</option>
                                                    <option>UTC+0 (London)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )}
                            {activeSection === 'security' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <section>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account & Security</h3>
                                        <div className="space-y-4">
                                            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                                                            <Lock className="w-5 h-5 text-gray-900 dark:text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white">Password</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Last changed 3 months ago</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-sm font-bold text-orange-600 hover:text-orange-700">Change</button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                                                            <Shield className="w-5 h-5 text-gray-900 dark:text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white">Two-Factor Authentication</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                                                        </div>
                                                    </div>
                                                    <div className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Linked Accounts */}
                                            <div className="mt-10">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 px-2 uppercase tracking-wider">Connected Accounts</h4>
                                                <div className="space-y-3">
                                                    {[
                                                        { id: 'google.com', name: 'Google', icon: Globe },
                                                        { id: 'apple.com', name: 'Apple', icon: Smartphone }
                                                    ].map(provider => (
                                                        <div key={provider.id} className="p-4 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                                                                    <provider.icon className={`w-5 h-5 ${isProviderLinked(provider.id) ? 'text-green-500' : 'text-gray-400'}`} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{provider.name}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{isProviderLinked(provider.id) ? 'Connected' : 'Not connected'}</p>
                                                                </div>
                                                            </div>
                                                            {isProviderLinked(provider.id) ? (
                                                                <button
                                                                    onClick={() => handleUnlinkAccount(provider.id)}
                                                                    className="text-xs font-bold text-red-600 hover:text-red-700"
                                                                >
                                                                    Disconnect
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleLinkAccount(provider.id === 'google.com' ? 'google' : 'apple')}
                                                                    className="text-xs font-bold text-gray-900 dark:text-white hover:text-orange-600"
                                                                >
                                                                    Connect
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Active Sessions */}
                                            <div className="mt-10">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 px-2 uppercase tracking-wider">Active Sessions</h4>
                                                <div className="space-y-3">
                                                    <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-gray-400">
                                                                <Monitor className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 dark:text-white">MacBook Pro (This device)</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Cape Town, South Africa • Active now</p>
                                                            </div>
                                                        </div>
                                                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[10px] font-bold">CURRENT</span>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 flex items-center justify-between group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-gray-400">
                                                                <Smartphone className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 dark:text-white">iPhone 14 Pro</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Johannesburg, South Africa • 2 days ago</p>
                                                            </div>
                                                        </div>
                                                        <button className="text-xs font-bold text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all">Revoke</button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Danger Zone */}
                                            <div className="mt-12 pt-10 border-t border-gray-100 dark:border-gray-700">
                                                <h4 className="text-sm font-bold text-red-600 mb-6 px-2 uppercase tracking-wider">Danger Zone</h4>
                                                <div className="p-8 rounded-[32px] bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-red-500">
                                                            <Trash2 className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-red-900 dark:text-red-400 text-lg">Deactivate Account</h4>
                                                            <p className="text-sm text-red-700 dark:text-red-500 mt-1 leading-relaxed">
                                                                Temporarily disable your profile. You can reactivate it at any time by signing back in.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => toast.error('Account deactivation is currently being processed. (Mock)')}
                                                        className="w-full py-4 bg-white dark:bg-gray-800 text-red-600 font-bold rounded-2xl border border-red-200 dark:border-red-900/30 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        Confirm Deactivation
                                                    </button>
                                                </div>

                                                <div className="p-8 rounded-[32px] bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 mt-6">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-red-500">
                                                            <Trash2 className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-red-900 dark:text-red-400 text-lg">Delete Account</h4>
                                                            <p className="text-sm text-red-700 dark:text-red-500 mt-1 leading-relaxed">
                                                                Permanently delete your account and all associated data. This action cannot be undone.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={handleDeleteAccount}
                                                        className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-sm"
                                                    >
                                                        Delete Permanently
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeSection === 'notifications' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <section>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Settings</h3>

                                        {/* Push Notifications Section */}
                                        <div className="mb-10">
                                            <div className="flex items-center gap-3 mb-6 px-2">
                                                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-sm">
                                                    <Smartphone className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">Push Notifications</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Alerts sent directly to your device</p>
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-900/50 rounded-[32px] border border-gray-100 dark:border-gray-700 overflow-hidden">
                                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                                    {[
                                                        { id: 'near_me', label: 'New hidden gems near me', desc: 'Get alerted when someone finds a gem in your current city' },
                                                        { id: 'likes', label: 'Someone liked my review', desc: 'Notifications for engagement on your contributions' },
                                                        { id: 'comments', label: 'Someone commented', desc: 'Stay updated on conversations you are part of' },
                                                        { id: 'friend_activity', label: 'Friend activity', desc: 'See what your friends are discovering' },
                                                        { id: 'weekly_reminders', label: 'Weekly discovery reminder', desc: 'A weekly recap of the best spots to visit' }
                                                    ].map((item) => (
                                                        <div key={item.id} className="p-6 flex items-center justify-between hover:bg-orange-50/10 dark:hover:bg-gray-800/50 transition-colors group">
                                                            <div className="pr-4">
                                                                <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">{item.label}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Email Notifications Section */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-6 px-2">
                                                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-sm">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white">Email Notifications</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Updates sent to your primary email address</p>
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-900/50 rounded-[32px] border border-gray-100 dark:border-gray-700 overflow-hidden">
                                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                                    {[
                                                        { id: 'monthly_digest', label: 'Monthly digest', desc: 'A curated summary of the best gems and reviews from the past month' },
                                                        { id: 'security_alerts', label: 'Security alerts', desc: 'Important notifications about your account security' },
                                                        { id: 'product_updates', label: 'Product updates', desc: 'New features and improvements to LocalFind' }
                                                    ].map((item) => (
                                                        <div key={item.id} className="p-6 flex items-center justify-between hover:bg-orange-50/10 dark:hover:bg-gray-800/50 transition-colors group">
                                                            <div className="pr-4">
                                                                <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">{item.label}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                                <input type="checkbox" defaultChecked={item.id === 'security_alerts'} className="sr-only peer" />
                                                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeSection === 'appearance' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-10">Appearance</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {[
                                            { id: 'light', label: 'Light', icon: Sun, color: 'bg-white border-gray-100' },
                                            { id: 'dark', label: 'Dark', icon: Moon, color: 'bg-[#111827] border-gray-800' },
                                            { id: 'system', label: 'System', icon: Monitor, color: 'bg-gradient-to-br from-white via-gray-400 to-[#111827] border-gray-100' },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setTheme(t.id as any)}
                                                className={`group relative flex flex-col items-center gap-6 p-1 rounded-[32px] border-4 transition-all ${theme === t.id
                                                    ? 'border-orange-500 shadow-lg'
                                                    : 'border-transparent hover:border-gray-100 dark:hover:border-gray-700'
                                                    }`}
                                            >
                                                <div className={`w-full aspect-[4/3] rounded-[28px] border border-gray-100 dark:border-gray-700 shadow-sm ${t.color}`}></div>
                                                <div className="flex items-center gap-2 pb-4">
                                                    <t.icon className={`w-4 h-4 ${theme === t.id ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'}`} />
                                                    <span className={`text-sm font-bold ${theme === t.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {t.label}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Action Buttons inside section to match screenshot better */}
                                    <div className="flex justify-end items-center gap-8 mt-16">
                                        <button className="text-gray-500 dark:text-gray-400 font-bold text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
                                            Discard
                                        </button>
                                        <button
                                            onClick={() => toast.success('Appearance settings saved!')}
                                            className="px-12 py-4 bg-[#111827] dark:bg-orange-600 text-white font-bold rounded-2xl hover:bg-black dark:hover:bg-orange-700 transition-all shadow-md active:scale-95 text-sm"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'privacy' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <section>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Privacy & Data</h3>

                                        {/* Profile Visibility */}
                                        <div className="p-8 rounded-[32px] bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 mb-8">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm text-gray-900 dark:text-white">
                                                        <Eye className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white">Profile Visibility</h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Control who can see your activity and profile details.</p>
                                                    </div>
                                                </div>
                                                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                    <button
                                                        onClick={() => setProfileVisibility('public')}
                                                        className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${profileVisibility === 'public' ? 'bg-gray-900 dark:bg-orange-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                                    >
                                                        Public
                                                    </button>
                                                    <button
                                                        onClick={() => setProfileVisibility('private')}
                                                        className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${profileVisibility === 'private' ? 'bg-gray-900 dark:bg-orange-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                                    >
                                                        Private
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                {[
                                                    { id: 'saved', label: 'Show my saved places publicly', icon: Bookmark },
                                                    { id: 'visited', label: 'Show my visited places', icon: MapPin },
                                                    { id: 'reviews', label: 'Show my reviews publicly', icon: Star },
                                                    { id: 'followers', label: 'Allow others to see my followers', icon: UserCheck },
                                                ].map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition-colors">
                                                                <item.icon className="w-5 h-5" />
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Activity Privacy */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 group">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                                        <Ghost className="w-5 h-5" />
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Incognito Mode</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Browse without appearing active to your followers.</p>
                                            </div>

                                            <div className="p-6 rounded-3xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 group">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-purple-500 transition-colors">
                                                        <Clock className="w-5 h-5" />
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                    </label>
                                                </div>
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Hide Check-in Timestamps</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Remove specific times from your public check-ins.</p>
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-green-500 transition-colors">
                                                    <Shield className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Anonymous Gem Submissions</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Your name won't be visible on hidden gems you contribute.</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>
                                    </section>
                                </div>
                            )}
                        </div>

                        {/* Sticky Footer simplified or removed if matched perfectly in section */}
                        {activeSection !== 'appearance' && (
                            <div className="p-6 bg-white dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-4">
                                <button className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-bold text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
                                    Discard
                                </button>
                                <button className="px-8 py-3 bg-gray-900 dark:bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-600 dark:hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-200 active:scale-95 text-sm">
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
