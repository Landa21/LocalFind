import React, { useState, useEffect } from 'react';
import { 
    Check, 
    X, 
    Trash2, 
    MapPin, 
    Clock, 
    Calendar
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

const ExperienceModeration: React.FC = () => {
    const [experiences, setExperiences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    useEffect(() => {
        const q = query(collection(db, 'experiences'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setExperiences(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await updateDoc(doc(db, 'experiences', id), { status: 'approved' });
            toast.success('Experience approved!');
        } catch (error) {
            toast.error('Failed to approve');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await updateDoc(doc(db, 'experiences', id), { status: 'rejected' });
            toast.success('Experience rejected');
        } catch (error) {
            toast.error('Failed to reject');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this listing permanently?')) return;
        try {
            await deleteDoc(doc(db, 'experiences', id));
            toast.success('Experience deleted');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const filteredExperiences = experiences.filter(exp => 
        filter === 'all' || exp.status === filter
    );

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">Content Moderation</h1>
                    <p className="text-gray-500 mt-2 font-medium">Review and verify new local experiences before they go live.</p>
                </div>
                
                <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    {['pending', 'approved', 'rejected', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all
                                ${filter === f 
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 dark:shadow-none' 
                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}
                            `}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
                </div>
            ) : filteredExperiences.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-20 text-center border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Queue is clear!</h3>
                    <p className="text-gray-500">There are no experiences waiting for review in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {filteredExperiences.map((exp) => (
                        <div key={exp.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col md:flex-row">
                            <div className="w-full md:w-64 h-64 md:h-auto relative">
                                <img 
                                    src={exp.image || exp.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'} 
                                    alt={exp.title} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold uppercase tracking-tight text-gray-900">
                                    {exp.category}
                                </div>
                            </div>
                            
                            <div className="flex-1 p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white leading-tight">
                                            {exp.title}
                                        </h3>
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                                            ${exp.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' : 
                                              exp.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                                              'bg-orange-50 text-orange-600 border-orange-100'}
                                        `}>
                                            {exp.status || 'pending'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-medium mb-6">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                            {exp.location}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {exp.hours || 'Flexible Hours'}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {exp.createdAt?.seconds ? new Date(exp.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6">
                                        {exp.description}
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {exp.status === 'pending' && (
                                        <>
                                            <button 
                                                onClick={() => handleApprove(exp.id)}
                                                className="flex-1 py-3 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-gray-200 dark:shadow-none"
                                            >
                                                <Check className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleReject(exp.id)}
                                                className="px-4 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all"
                                                title="Reject"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(exp.id)}
                                        className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-red-500 rounded-2xl font-bold transition-all"
                                        title="Delete Permanently"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExperienceModeration;
