import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface EventCardProps {
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    category: string;
}

const EventCard: React.FC<EventCardProps> = ({
    title,
    date,
    time,
    location,
    image,
    category
}) => {
    return (
        <div className="flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 hover:shadow-md transition-shadow">
            <div className="w-24 h-24 rounded-xl flex-shrink-0 overflow-hidden bg-gray-100">
                <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className="text-xs font-semibold text-orange-600 mb-1 uppercase tracking-wide">
                    {category}
                </span>
                <h4 className="font-bold text-gray-900 mb-1 truncate">{title}</h4>
                <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1.5" />
                        {date}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1.5" />
                        {time}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1.5" />
                        {location}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
