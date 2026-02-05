import React from 'react';
import { Compass, Users, Heart } from 'lucide-react';

const steps = [
    {
        id: 1,
        title: 'Join the Community',
        description: 'Sign up to gain access to our curated list of hidden gems, complete with reviews, prices, and exact locations.',
        icon: Users,
    },
    {
        id: 2,
        title: 'Unlock Hidden Details',
        description: 'Get full access to exclusive local spots, insider tips, and location of the local experience',
        icon: Compass,
    },
    {
        id: 3,
        title: 'Plan Your Adventure',
        description: 'Connect with authentic experiences and create your perfect itinerary with all the information you need.',
        icon: Heart,
    },
];

const HowItWorks: React.FC = () => {
    return (
        <section className="w-full bg-white py-24 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-orange-600 font-semibold tracking-wider text-sm uppercase mb-2 block">Simple Process</span>
                    <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6">
                        Your Journey Begins Here
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We've made it easy to find and book authentic local experiences in just three simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop only) */}
                    <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-orange-100 -z-10"></div>

                    {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-8 relative border border-orange-100 group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-md">
                                <step.icon className="w-10 h-10 text-orange-600" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-white">
                                    {index + 1}
                                </div>
                            </div>
                            <h3 className="font-serif text-2xl text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed px-4">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
