import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { Camera, Save } from 'lucide-react';

const Profile: React.FC = () => {
    const { user, userData } = useAuth();
    const [displayName, setDisplayName] = useState(userData?.displayName || user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(userData?.photoURL || user?.photoURL || '');
    const [bio, setBio] = useState(userData?.bio || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (userData || user) {
            setDisplayName(userData?.displayName || user?.displayName || '');
            setPhotoURL(userData?.photoURL || user?.photoURL || '');
            setBio(userData?.bio || '');
        }
    }, [userData, user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        setMessage(null);

        try {
            // Update Auth profile
            await updateProfile(user, {
                displayName,
                photoURL
            });

            // Update Firestore
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/protected/update-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ displayName, bio, photoURL }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to update database profile');
            }

            setMessage({ type: 'success', text: 'Profile saved successfully!' });
        } catch (error: any) {
            console.error('Save error:', error);
            setMessage({ type: 'error', text: error.message || 'An error occurred while saving' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Preview local image immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoURL(reader.result as string);
        };
        reader.readAsDataURL(file);

        setIsUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/protected/upload-profile-image`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                if (response.ok) {
                    setPhotoURL(data.imageUrl);
                    setMessage({ type: 'success', text: 'Image uploaded successfully! Click "Save Profile" to commit changes.' });
                } else {
                    throw new Error(data.error || 'Upload failed');
                }
            } else {
                throw new Error(`Server returned unexpected response (${response.status})`);
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: 'Image upload failed: ' + error.message });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-8">
                    {message && (
                        <div className={`mb-6 p-4 rounded-2xl text-sm animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-6 pb-8 border-b border-gray-100 dark:border-gray-700">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-orange-50 dark:bg-gray-900/50 overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl transition-transform group-hover:scale-105 duration-300">
                                    {photoURL && !imageError ? (
                                        <img
                                            src={photoURL}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-orange-200 dark:text-gray-700">
                                            <Camera className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                                <label className={`absolute bottom-0 right-0 p-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full cursor-pointer shadow-lg transition-all hover:scale-110 active:scale-95 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <Camera className={`w-5 h-5 ${isUploading ? 'animate-pulse' : ''}`} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={isUploading || isSaving}
                                    />
                                </label>
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-gray-900 dark:text-white">{displayName || 'Anonymous'}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Full Name</label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your Name"
                                    className="w-full px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/10 focus:border-orange-500 outline-none transition-all text-gray-900 dark:text-white shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Profile Photo URL (Optional)</label>
                                <input
                                    type="url"
                                    value={photoURL.startsWith('data:') ? '' : photoURL}
                                    onChange={(e) => {
                                        setPhotoURL(e.target.value);
                                        setImageError(false);
                                    }}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="w-full px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/10 focus:border-orange-500 outline-none transition-all text-gray-900 dark:text-white shadow-sm"
                                />
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 px-1 uppercase tracking-wider font-bold">Or click the camera icon above to upload a file</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 px-1">Bio</label>
                                <textarea
                                    rows={4}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell the community a bit about yourself..."
                                    className="w-full px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/10 focus:border-orange-500 outline-none transition-all text-gray-900 dark:text-white resize-none shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving || isUploading}
                                className="flex items-center gap-2 bg-gray-900 dark:bg-orange-600 hover:bg-black dark:hover:bg-orange-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-gray-200 dark:shadow-none hover:-translate-y-1 active:translate-y-0"
                            >
                                <Save className="w-5 h-5" />
                                {isSaving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
