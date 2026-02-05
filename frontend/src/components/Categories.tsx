import React from 'react';
import { Palette, Tent, Utensils, Music, Compass, Camera } from 'lucide-react';

const categories = [
    { name: 'Art & Crafts', icon: Palette, count: 12 },
    { name: 'Nature', icon: Tent, count: 42 },
    { name: 'Food & Drink', icon: Utensils, count: 35 },
    { name: 'Culture', icon: Music, count: 18 },
    { name: 'Adventure', icon: Compass, count: 26 },
    { name: 'Photography', icon: Camera, count: 9 },
];

const Categories: React.FC = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 -mt-10 relative z-20">
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 flex flex-wrap justify-between items-center gap-4 border border-gray-100">
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 transition-all group border border-transparent hover:border-orange-200"
                    >
                        <cat.icon className="w-5 h-5 text-orange-500 group-hover:text-orange-600" />
                        <span className="font-semibold text-sm tracking-wide">{cat.name}</span>
                        <span className="text-xs bg-gray-200 text-gray-500 py-0.5 px-2 rounded-md group-hover:bg-orange-200 group-hover:text-orange-800 font-medium">
                            {cat.count}
                        </span>
                    </button>
                ))}
               
            </div>
        </div>
    );
};

export default Categories;
