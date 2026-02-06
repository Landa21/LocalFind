import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const ExperienceOwners: React.FC = () => {
    return (
        <section id="become-local-guide" className="w-full py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="bg-sand/30 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-lg">
                    {/* Image Section (Left) */}
                    <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                        <img
                            src="https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2083&auto=format&fit=crop"
                            alt="Local guide sharing stories"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    {/* Content Section (Right) */}
                    <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                        <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-6 leading-tight">
                            Do you own a <br /> <span className="text-orange-600">Hidden Gem?</span>
                        </h2>
                        <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                            Partner with LocalFind to showcase your unique establishment or experience. We connect you directly with travelers looking for authentic, off-the-beaten-path adventures.
                        </p>

                        <div className="flex flex-col gap-3 mb-10">
                            {[
                                'Showcase your Hidden Gem to a curated audience',
                                'Connect directly with travelers seeking authenticity',
                                'Simple tools to manage your unique experience'
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-orange-600" />
                                    <span className="text-gray-800 font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <Link to="/start-trial" className="self-start bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 group">
                            Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExperienceOwners;
