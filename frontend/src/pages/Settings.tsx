import React, { useState } from 'react';
import {
    Lock,
    Bell,
    Shield,
    Palette,
    Globe,
    Mail,
    Smartphone,
    ChevronRight,
    Moon,
    Sun,
    Monitor,
    Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { auth, googleProvider, appleProvider } from '../config/firebase';
import {
    linkWithPopup,
    unlink,
    deleteUser
} from 'firebase/auth';

const Settings: React.FC = () => {
    const { logout } = useAuth();
    const [activeSection, setActiveSection] = useState('preferences');

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
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="font-serif text-4xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-2">Manage your account, preferences, and security settings.</p>
            </div>

            {/* Horizontal Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide border-b border-gray-100">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap text-sm font-medium ${activeSection === section.id
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <section.icon className="w-4 h-4" />
                        {section.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-8">
                {/* Main Content Area */}
                <main className="w-full">
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                        <div className="p-6 md:p-10">
                            {activeSection === 'preferences' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <section>
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Account Preferences</h3>
                                        <p className="text-sm text-gray-500 -mt-4 mb-8">
                                            Manage your localization and regional settings. Profile details can be managed in your <a href="/profile" className="text-orange-600 font-bold hover:underline">Profile Page</a>.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-orange-200 transition-all text-left group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                                        <Globe className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">Language</p>
                                                        <p className="text-xs text-gray-500">English (South Africa)</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-all" />
                                            </button>
                                            <button className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-orange-200 transition-all text-left group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-gray-400 font-bold group-hover:text-orange-500 transition-colors">
                                                        R
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">Currency</p>
                                                        <p className="text-xs text-gray-500">ZAR (Rand)</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-all" />
                                            </button>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeSection === 'security' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <section>
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Account & Security</h3>
                                        <div className="space-y-4">
                                            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                            <Lock className="w-5 h-5 text-gray-900" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">Password</p>
                                                            <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-sm font-bold text-orange-600 hover:text-orange-700">Change</button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                            <Shield className="w-5 h-5 text-gray-900" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">Two-Factor Authentication</p>
                                                            <p className="text-xs text-gray-500">Add an extra layer of security</p>
                                                        </div>
                                                    </div>
                                                    <div className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Linked Accounts */}
                                            <div className="mt-10">
                                                <h4 className="text-sm font-bold text-gray-900 mb-4 px-2 uppercase tracking-wider">Connected Accounts</h4>
                                                <div className="space-y-3">
                                                    {[
                                                        { id: 'google.com', name: 'Google', icon: Globe },
                                                        { id: 'apple.com', name: 'Apple', icon: Smartphone }
                                                    ].map(provider => (
                                                        <div key={provider.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                                    <provider.icon className={`w-5 h-5 ${isProviderLinked(provider.id) ? 'text-green-500' : 'text-gray-400'}`} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-gray-900">{provider.name}</p>
                                                                    <p className="text-xs text-gray-500">{isProviderLinked(provider.id) ? 'Connected' : 'Not connected'}</p>
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
                                                                    className="text-xs font-bold text-gray-900 hover:text-orange-600"
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
                                                <h4 className="text-sm font-bold text-gray-900 mb-4 px-2 uppercase tracking-wider">Active Sessions</h4>
                                                <div className="space-y-3">
                                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-400">
                                                                <Monitor className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900">MacBook Pro (This device)</p>
                                                                <p className="text-xs text-gray-500">Cape Town, South Africa • Active now</p>
                                                            </div>
                                                        </div>
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">CURRENT</span>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-400">
                                                                <Smartphone className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900">iPhone 14 Pro</p>
                                                                <p className="text-xs text-gray-500">Johannesburg, South Africa • 2 days ago</p>
                                                            </div>
                                                        </div>
                                                        <button className="text-xs font-bold text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all">Revoke</button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Danger Zone */}
                                            <div className="mt-12 pt-10 border-t border-gray-100">
                                                <h4 className="text-sm font-bold text-red-600 mb-6 px-2 uppercase tracking-wider">Danger Zone</h4>
                                                <div className="p-8 rounded-[32px] bg-red-50 border border-red-100">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-red-500">
                                                            <Trash2 className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-red-900 text-lg">Deactivate Account</h4>
                                                            <p className="text-sm text-red-700 mt-1 leading-relaxed">
                                                                Temporarily disable your profile. You can reactivate it at any time by signing back in.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => toast.error('Account deactivation is currently being processed. (Mock)')}
                                                        className="w-full py-4 bg-white text-red-600 font-bold rounded-2xl border border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        Confirm Deactivation
                                                    </button>
                                                </div>

                                                <div className="p-8 rounded-[32px] bg-red-50 border border-red-100 mt-6">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-red-500">
                                                            <Trash2 className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-red-900 text-lg">Delete Account</h4>
                                                            <p className="text-sm text-red-700 mt-1 leading-relaxed">
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
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Notifications</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-2">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                                                    <Mail className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Email Notifications</p>
                                                    <p className="text-sm text-gray-500">Personalized trip ideas & product updates</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-2">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <Smartphone className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Push Notifications</p>
                                                    <p className="text-sm text-gray-500">Alerts for new events in your area</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'appearance' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-xl font-bold text-gray-900 mb-8">Appearance</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { id: 'light', label: 'Light', icon: Sun, color: 'bg-white border-gray-200' },
                                            { id: 'dark', label: 'Dark', icon: Moon, color: 'bg-gray-900 border-gray-800' },
                                            { id: 'system', label: 'System', icon: Monitor, color: 'bg-gradient-to-br from-white to-gray-900 border-gray-200' },
                                        ].map((theme) => (
                                            <button
                                                key={theme.id}
                                                className={`group relative flex flex-col items-center gap-4 p-4 rounded-3xl border-2 transition-all ${theme.id === 'light'
                                                    ? 'border-orange-500 bg-orange-50/50 shadow-md'
                                                    : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className={`w-full aspect-video rounded-2xl border-4 border-white shadow-sm ${theme.color}`}></div>
                                                <div className="flex items-center gap-2">
                                                    <theme.icon className={`w-4 h-4 ${theme.id === 'light' ? 'text-orange-500' : 'text-gray-400'}`} />
                                                    <span className={`text-sm font-bold ${theme.id === 'light' ? 'text-orange-900' : 'text-gray-600'}`}>
                                                        {theme.label}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'privacy' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Privacy & Data</h3>
                                    <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 text-center py-12">
                                        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-sm">Privacy settings are being optimized. Check back soon!</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sticky Footer for saving */}
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-4">
                            <button className="px-6 py-2.5 text-gray-600 font-bold text-sm hover:text-gray-900 transition-colors">
                                Discard
                            </button>
                            <button className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 active:scale-95 text-sm">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;
