import React, { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface WelcomePopupProps {
    userName: string;
    onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ userName, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        // Only show once per session ideally (using local storage), but for demo we can showing it every time or handle in parent
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full relative transform scale-100 transition-transform shadow-2xl">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-8 h-8 text-orange-600" />
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
                        Welcome back, {userName}!
                    </h2>

                    <p className="text-gray-500 mb-8">
                        Ready to discover some new hidden gems today? Check out what's new in your area.
                    </p>

                    <button
                        onClick={handleClose}
                        className="w-full py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                    >
                        Let's Explore
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomePopup;
