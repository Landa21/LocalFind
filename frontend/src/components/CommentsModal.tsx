import React, { useState } from 'react';
import { X, Send, User } from 'lucide-react';

interface Comment {
    id: number | string;
    user: string;
    text: string;
    timestamp?: string;
}

interface CommentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    comments: Comment[];
    onAddComment: (text: string) => void;
    locationName: string;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ isOpen, onClose, comments, onAddComment, locationName }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="bg-white rounded-[2.5rem] w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-gray-900">Comments</h2>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">{locationName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <X size={20} className="text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scrollbar-hide">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                    <User size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-baseline justify-between gap-2 mb-1">
                                        <span className="font-bold text-sm text-gray-900">{comment.user}</span>
                                        <span className="text-[10px] text-gray-400 font-medium">Just now</span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {comment.text}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <Send className="w-6 h-6 text-gray-300" />
                            </div>
                            <p className="text-gray-500 text-sm italic">Be the first to comment!</p>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-5 pr-14 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-orange-100 focus:border-orange-200 focus:outline-none transition-all shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CommentsModal;
