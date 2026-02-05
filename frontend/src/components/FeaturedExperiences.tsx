import React from 'react';
import { MapPin, Star, User, ArrowRight, Camera, Coffee, Music, Utensils, Tent } from 'lucide-react';

const FeaturedExperiences: React.FC = () => {
    return (
        <section className="w-full bg-warm-gray py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <div className="text-orange-600 font-semibold tracking-wider text-sm mb-2 uppercase">DISCOVER</div>
                        <h2 className="font-serif text-4xl md:text-5xl text-gray-900">
                            Featured Local Experiences
                        </h2>
                    </div>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-[300px_300px] gap-6">

                    {/* 1. Large Featured Card (Left) - Spans 2 cols, 2 rows */}
                    <div className="md:col-span-2 md:row-span-2 group relative rounded-3xl overflow-hidden cursor-pointer">
                        <img
                            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop"
                            alt="Street Food"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div className="absolute top-6 left-6 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-white" /> Featured
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                            <h3 className="font-serif text-4xl mb-3 leading-tight">Street Food Walking Tour</h3>
                            <p className="text-gray-200 mb-6 text-lg max-w-md">Explore hidden culinary gems with a local foodie guide through the historic district.</p>
                            <div className="flex items-center gap-6 text-sm font-medium text-gray-300 mb-8">
                                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> 3h</span>
                                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Old Town</span>
                                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> 5+ stops</span>
                            </div>
                            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-xl transition-all font-semibold group-hover:pl-10">
                                Unlock Details <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* 2. Medium Horizontal Card (Top Middle) */}
                    <div className="relative group rounded-3xl overflow-hidden cursor-pointer bg-black">
                        <img
                            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop"
                            alt="Music"
                            className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <Music className="w-6 h-6 mb-2 text-orange-400" />
                            <h3 className="font-bold text-xl mb-1">Music & Dance</h3>
                            <p className="text-gray-300 text-xs mb-3">Traditional performances</p>
                            <button className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm hover:bg-orange-50 transition-colors">Explore</button>
                        </div>
                    </div>

                    {/* 3. Small Square Card (Top Right) */}
                    <div className="relative group rounded-3xl overflow-hidden cursor-pointer bg-black">
                        <img
                            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
                            alt="Photo"
                            className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                        <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                            <Camera className="w-6 h-6 mb-2 mx-auto text-orange-400" />
                            <h3 className="font-bold text-lg mb-1">Photo Tour</h3>
                            <p className="text-gray-300 text-[10px] mb-3">Hidden gems & viewpoints</p>
                            <button className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm hover:bg-orange-50 transition-colors">Explore</button>
                        </div>
                    </div>

                    {/* 4. Stat Card (Middle Right/Center) */}
                    <div className="bg-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:bg-white hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-orange-100">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <User className="w-8 h-8 text-gray-800" />
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mb-1">12K+</div>
                        <p className="text-gray-500 text-sm font-medium">Happy Travelers</p>
                    </div>

                    {/* 5. Coffee Culture (Middle Right) */}
                    <div className="relative group rounded-3xl overflow-hidden cursor-pointer bg-black">
                        <img
                            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop"
                            alt="Coffee"
                            className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                        <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                            <Coffee className="w-6 h-6 mb-2 mx-auto text-orange-400" />
                            <h3 className="font-bold text-lg mb-1">Coffee Culture</h3>
                            <p className="text-gray-300 text-[10px] mb-3">Artisan cafés & roasters</p>
                            <button className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm hover:bg-orange-50 transition-colors">Explore</button>
                        </div>
                    </div>


                    {/* 6. Testimonial (Bottom Row) */}
                    <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <p className="font-serif text-xl text-gray-800 leading-relaxed mb-6">
                            "Absolutely amazing experiences! The local guides made everything so authentic and memorable. We saw sides of the city we never would have found on our own."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">SM</div>
                            <div>
                                <div className="font-bold text-gray-900 text-sm">Sarah M.</div>
                                <div className="text-gray-500 text-xs">Verified Traveler</div>
                            </div>
                        </div>
                    </div>

                    {/* 7. Local Markets (Bottom Right) */}
                    <div className="relative group rounded-3xl overflow-hidden cursor-pointer bg-black">
                        <img
                            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop"
                            alt="Markets"
                            className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                        <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                            <Utensils className="w-6 h-6 mb-2 mx-auto text-orange-400" />
                            <h3 className="font-bold text-lg mb-1">Local Markets</h3>
                            <p className="text-gray-300 text-[10px] mb-3">Fresh produce & crafts</p>
                            <button className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm hover:bg-orange-50 transition-colors">Explore</button>
                        </div>
                    </div>

                    {/* 8. View All (Bottom Right Corner) */}
                    <div className="bg-black rounded-3xl p-6 flex flex-col items-center justify-center text-center text-white cursor-pointer group hover:bg-gray-900 transition-colors">
                        <div className="mb-4">
                            <Star className="w-8 h-8 text-white group-hover:animate-spin-slow" />
                        </div>
                        <h3 className="font-bold text-xl mb-1">View All</h3>
                        <p className="text-gray-400 text-xs mb-6">50+ experiences</p>
                        <button className="w-full bg-white text-black font-bold py-3 rounded-xl text-sm hover:bg-gray-200 transition-colors">
                            Browse All
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FeaturedExperiences;
