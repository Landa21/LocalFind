import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPopupProps {
    isOpen: boolean;
    onClose: () => void;
    locationName: string;
    coordinates?: [number, number]; // Optional, default to Joburg center if not provided
}

const MapPopup: React.FC<MapPopupProps> = ({ isOpen, onClose, locationName, coordinates }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (isOpen) setIsMounted(true);
        else setTimeout(() => setIsMounted(false), 300); // Animation delay
    }, [isOpen]);

    if (!isMounted && !isOpen) return null;

    // Default to Johannesburg coordinates if none provided
    const position: [number, number] = coordinates || [-26.2041, 28.0473];

    return (
        <div className={`fixed inset-0 z-[1000] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className={`bg-white rounded-3xl overflow-hidden w-full max-w-3xl shadow-2xl relative transform transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[1001] p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="h-[400px] w-full relative">
                    <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="h-full w-full">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                <div className="font-bold text-sm">{locationName}</div>
                            </Popup>
                        </Marker>
                    </MapContainer>

                    <div className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 pointer-events-auto">
                            <h3 className="font-bold text-lg text-gray-900">{locationName}</h3>
                            <p className="text-sm text-gray-500">Johannesburg, South Africa</p>
                            <button className="mt-3 w-full py-2 bg-orange-600 text-white font-bold rounded-lg text-sm hover:bg-orange-700 transition-colors">
                                Get Directions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPopup;
