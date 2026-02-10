import React, { useEffect, useState } from 'react';
import { Star, User, ArrowRight, Camera, Coffee, Music, Utensils, MapPin } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Experience {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    duration?: string;
    location: string;
    stops?: string;
    rating?: number;
    reviews?: number;
    featured?: boolean;
}

interface FeaturedExperiencesProps {
    searchQuery: string;
}

const FeaturedExperiences: React.FC<FeaturedExperiencesProps> = ({ searchQuery }) => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'experiences'));
                const items: Experience[] = [];
                querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data() } as Experience);
                });
                setExperiences(items);
            } catch (error) {
                console.error("Error fetching experiences: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    // Filter experiences based on search query
    const filteredExperiences = experiences.filter(exp =>
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="py-20 text-center text-gray-500">Loading experiences...</div>;
    }

    // Render Search Results (Grid Layout)
    if (searchQuery) {
        return (
            <section id="featured-experiences" className="w-full bg-warm-gray py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl text-gray-900">
                            Search Results for "{searchQuery}"
                        </h2>
                        <p className="text-gray-600 mt-2">{filteredExperiences.length} experiences found</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {filteredExperiences.map((exp) => (
                            <div key={exp.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                <div className="h-64 overflow-hidden relative">
                                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-gray-800">
                                        {exp.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-serif text-xl font-bold mb-2 text-gray-900">{exp.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exp.description}</p>
                                    <div className="flex items-center text-xs text-gray-500 font-medium gap-4">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-500" /> {exp.location}</span>
                                        {exp.duration && <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> {exp.duration}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Default Bento Grid Layout (using fetched data where possible, falling back to placeholders if needed)
    // We Map strict indices to the bento grid slots for this demo
    // Slot 1: Large (Index 0)
    // Slot 2: Medium Top (Index 1)
    // Slot 3: Small Top (Index 2)
    // Slot 4: Stat (Static)
    // Slot 5: Coffee (Index 3)
    // Slot 6: Testimonial (Static)
    // Slot 7: Local Markets (Index 4)

    // Fallback data if fetch failed or empty (omitted for brevity, assuming seed worked or just rendering what we have)
    const getExp = (index: number) => experiences[index] || {};

    return (
        <section id="featured-experiences" className="w-full bg-warm-gray py-20 px-4">
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

                    {/* 1. Large Featured Card (Left) */}
                    <div className="md:col-span-2 md:row-span-2 group relative rounded-3xl overflow-hidden cursor-pointer">
                        <img
                            src={getExp(0).image || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop"}
                            alt={getExp(0).title || "Experience"}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div className="absolute top-6 left-6 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-white" /> Featured
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                            <h3 className="font-serif text-4xl mb-3 leading-tight">{getExp(0).title || "Street Food Walking Tour"}</h3>
                            <p className="text-gray-200 mb-6 text-lg max-w-md">{getExp(0).description || "Explore hidden culinary gems..."}</p>
                            <div className="flex items-center gap-6 text-sm font-medium text-gray-300 mb-8">
                                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> {getExp(0).duration || "3h"}</span>
                                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> {getExp(0).location || "Old Town"}</span>
                                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> {getExp(0).stops || "5+ stops"}</span>
                            </div>
                            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-xl transition-all font-semibold group-hover:pl-10">
                                Book Now <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* 2. Medium Horizontal Card (Top Middle) */}
                    <div className="relative group rounded-3xl overflow-hidden cursor-pointer bg-black">
                        <img
                            src={getExp(1).image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop"}
                            alt={getExp(1).title}
                            className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <Music className="w-6 h-6 mb-2 text-orange-400" />
                            <h3 className="font-bold text-xl mb-1">{getExp(1).title || "Music & Dance"}</h3>
                            <p className="text-gray-300 text-xs mb-3">{getExp(1).category || "Traditional performances"}</p>
                            <button className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm hover:bg-orange-50 transition-colors">Explore</button>
                        </div>
                    </div>

                    {/* 3. Small Square Card (Top Right) */}
                    <div className="relative group rounded-3xl overflow-hidden cursor-pointer bg-black">
                        <img
                            src={getExp(2).image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"}
                            alt={getExp(2).title}
                            className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                        <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                            <Camera className="w-6 h-6 mb-2 mx-auto text-orange-400" />
                            <h3 className="font-bold text-lg mb-1">{getExp(2).title || "Photo Tour"}</h3>
                            <p className="text-gray-300 text-[10px] mb-3">{getExp(2).description?.substring(0, 25) || "Hidden gems"}...</p>
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
                            src={getExp(3).image || "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop"}
                            alt={getExp(3).title}
                            className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                        <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                            <Coffee className="w-6 h-6 mb-2 mx-auto text-orange-400" />
                            <h3 className="font-bold text-lg mb-1">{getExp(3).title || "Coffee Culture"}</h3>
                            <p className="text-gray-300 text-[10px] mb-3">{getExp(3).category || "Artisan cafés"}</p>
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
                            "Absolutely amazing experiences! The experience owners made everything so authentic and memorable. We saw sides of the city we never would have found on our own."
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
                            src={getExp(4).image || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop"}
                            alt={getExp(4).title}
                            className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                        <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                            <Utensils className="w-6 h-6 mb-2 mx-auto text-orange-400" />
                            <h3 className="font-bold text-lg mb-1">{getExp(4).title || "Local Markets"}</h3>
                            <p className="text-gray-300 text-[10px] mb-3">{getExp(4).category || "Fresh produce"}</p>
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
