import React, { useState } from 'react';
import { 
    Compass, 
    MapPin, 
    Image as ImageIcon, 
    Clock, 
    Type, 
    Tag, 
    ArrowRight, 
    ArrowLeft,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AddListing: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        category: 'Outdoor',
        hours: '',
        price: '',
        image: ''
    });

    const categories = ['Outdoor', 'Culture', 'Food', 'Adventure', 'Relaxation', 'Workshops'];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
            return;
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'experiences'), {
                ...formData,
                ownerId: user?.uid,
                ownerName: user?.displayName || 'Anonymous Host',
                status: 'pending',
                rating: 5.0,
                reviews: 0,
                createdAt: serverTimestamp()
            });
            toast.success('Experience submitted for review!');
            navigate('/owner/dashboard');
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Failed to submit experience');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-12 text-center">
                <h1 className="font-serif text-5xl font-bold text-gray-900 dark:text-white mb-4">Share Your Experience</h1>
                <p className="text-gray-500 font-medium">Create a compelling listing to attract explorers from around the world.</p>
                
                {/* Progress Bar */}
                <div className="flex items-center justify-center gap-4 mt-10">
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500
                                ${step >= s ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-gray-100 text-gray-400'}
                            `}>
                                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                            </div>
                            {s < 3 && <div className={`w-20 h-1 bg-gray-100 rounded-full overflow-hidden ${step > s ? 'bg-orange-100' : ''}`}>
                                <div className={`h-full bg-orange-600 transition-all duration-700 ${step > s ? 'w-full' : 'w-0'}`} />
                            </div>}
                        </React.Fragment>
                    ))}
                </div>
            </header>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-12 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700">
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                    <Type className="w-4 h-4 text-orange-500" />
                                    Experience Title
                                </label>
                                <input 
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Traditional Pottery Workshop"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-none focus:ring-2 focus:ring-orange-100 outline-none font-medium" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                    <Tag className="w-4 h-4 text-orange-500" />
                                    Category
                                </label>
                                <select 
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-none focus:ring-2 focus:ring-orange-100 outline-none font-medium appearance-none"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea 
                                name="description"
                                required
                                rows={6}
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="What makes this experience special? Tell a story..."
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-none focus:ring-2 focus:ring-orange-100 outline-none font-medium resize-none"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    Location
                                </label>
                                <input 
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Downtown, Cape Town"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-none focus:ring-2 focus:ring-orange-100 outline-none font-medium" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    Available Hours
                                </label>
                                <input 
                                    name="hours"
                                    required
                                    value={formData.hours}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Wed - Sun, 10:00 - 18:00"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-none focus:ring-2 focus:ring-orange-100 outline-none font-medium" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                <ImageIcon className="w-4 h-4 text-orange-500" />
                                Image URL
                            </label>
                            <input 
                                name="image"
                                required
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder="Paste a high-quality photo URL (Unsplash or direct)"
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-none focus:ring-2 focus:ring-orange-100 outline-none font-medium" 
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 py-12">
                        <div className="w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Compass className="w-12 h-12 text-orange-600" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Final Review</h2>
                        <p className="text-gray-500 max-w-md mx-auto">By submitting, you agree to our host terms and community guidelines. Our team will review your submission within 24 hours.</p>
                        
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-8 rounded-3xl text-left mt-8 border border-orange-100 dark:border-orange-800">
                            <h4 className="font-bold text-orange-600 mb-2">Selected Category</h4>
                            <p className="text-xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-tight">{formData.category}</p>
                            
                            <h4 className="font-bold text-orange-600 mb-2">Listing Title</h4>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{formData.title}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4 mt-12">
                    {step > 1 && (
                        <button 
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="px-8 py-5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-[2rem] font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </button>
                    )}
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-8 py-5 bg-gray-900 text-white rounded-[2rem] font-bold hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                {step === 3 ? 'Publish Experience' : 'Continue'}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddListing;
