import React from 'react';
import { Search, MapPin } from 'lucide-react';

interface HeroProps {
    onSearch: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
    const [inputValue, setInputValue] = React.useState('');

    const handleSearch = () => {
        onSearch(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleCityClick = (city: string) => {
        setInputValue(city);
        onSearch(city);
    };

    return (
        <div className="relative h-screen min-h-[700px] w-full overflow-hidden bg-black">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/videos/hero-img.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 pt-20">
                <div className="mb-6 inline-block px-5 py-2 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-xs font-semibold tracking-widest uppercase text-orange-100">
                    Discover South Africa
                </div>

                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight drop-shadow-lg leading-tight">
                    Uncover Hidden Gems <br />
                    <span className="text-orange-200">Local Stories Await</span>
                </h1>

                <p className="font-sans text-lg md:text-xl text-gray-100 max-w-3xl mb-14 drop-shadow-md leading-relaxed opacity-90">
                    From family-owned art studios to secret hiking trails — connect with
                    authentic experiences curated by local entrepreneurs.
                </p>

                {/* Search Bar */}
                <div className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-2xl p-2.5 flex items-center shadow-2xl transform transition-transform hover:scale-[1.01]">
                    <div className="flex-1 flex items-center px-6">
                        <MapPin className="text-orange-500 w-5 h-5 mr-4" />
                        <input
                            id="search-input"
                            name="search"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Where do you want to explore?"
                            className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 text-lg font-medium"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-xl font-semibold transition-colors text-lg shadow-md flex items-center gap-2"
                    >
                        <Search className="w-5 h-5" />
                        Explore
                    </button>
                </div>

                {/* Quick Tags */}
                <div className="mt-12 flex gap-6 text-sm text-white/90 font-semibold tracking-wide border-t border-white/10 pt-8">
                    {['Cape Town', 'Johannesburg', 'Durban'].map((city) => (
                        <span
                            key={city}
                            onClick={() => handleCityClick(city)}
                            className="cursor-pointer hover:text-orange-300 transition-colors uppercase text-xs"
                        >
                            {city}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;