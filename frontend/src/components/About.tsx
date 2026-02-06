import React from 'react';

const About: React.FC = () => {
    return (
        <section id="about" className="py-24 bg-warm-gray px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="relative">
                    <img
                        src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=2072&auto=format&fit=crop"
                        alt="Local Guide showing travelers around"
                        className="rounded-2xl shadow-xl w-full h-[500px] object-cover"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg max-w-xs hidden md:block">
                        <p className="font-serif text-lg italic text-gray-800">"LocalFind changed the way I travel. I felt like a local, not a tourist."</p>
                        <p className="text-orange-600 font-bold mt-2 text-sm">- Sarah, Traveler</p>
                    </div>
                </div>
                <div>
                    <span className="text-orange-600 font-semibold tracking-wider text-sm uppercase mb-2 block">Our Story</span>
                    <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
                        Connecting Curious Travelers with <span className="text-orange-600">Local Soul</span>
                    </h2>
                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        Founded in South Africa, LocalFind was born from a simple belief: the best travel experiences aren't found in guidebooks, but in the stories shared by the people who call a place home.
                    </p>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        We empower local entrepreneurs to showcase their culture, food, and hidden gems directly to you. By skipping the middleman, we ensure that your money goes directly into the local community, fostering sustainable tourism and authentic connections.
                    </p>

                    <div className="grid grid-cols-2 gap-8 mb-8 border-t border-gray-200 pt-8">
                        <div>
                            <h4 className="font-bold text-3xl text-gray-900 mb-1">500+</h4>
                            <p className="text-gray-500 text-sm">Local Guides</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-3xl text-gray-900 mb-1">50+</h4>
                            <p className="text-gray-500 text-sm">Communities</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
