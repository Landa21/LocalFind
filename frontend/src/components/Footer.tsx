import React from 'react';
import { Compass, Facebook, Instagram, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#1c1917] text-gray-300 py-16 px-4 border-t border-orange-900/20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand Column */}
                <div className="md:col-span-1">
                    <div className="flex items-center gap-2 mb-6 text-white">
                        <Compass className="w-8 h-8 text-orange-500" />
                        <span className="font-serif text-2xl font-bold tracking-tight">LocalFind</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-6 text-gray-400">
                        Discover hidden gems and authentic local experiences. Connecting curious travelers with passionate local guides.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-orange-500 transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-orange-500 transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-orange-500 transition-colors"><Facebook className="w-5 h-5" /></a>
                    </div>
                </div>

                {/* Explore Column (Tourists) */}
                <div>
                    <h4 className="text-white font-bold mb-6">Explore</h4>
                    <ul className="space-y-4 text-sm">
                        <li><a href="#" className="hover:text-orange-500 transition-colors">Featured Experiences</a></li>
                        <li><a href="#" className="hover:text-orange-500 transition-colors">Categories</a></li>
                        <li><a href="#" className="hover:text-orange-500 transition-colors">Latest Reviews</a></li>
                        <li><a href="#" className="hover:text-orange-500 transition-colors">Local Guides</a></li>
                    </ul>
                </div>

                {/* Hosting Column (Experience Owners) */}
                <div>
                    <h4 className="text-white font-bold mb-6">Hosting</h4>
                    <ul className="space-y-4 text-sm">
                        <li><a href="#" className="hover:text-orange-500 transition-colors">Become a Local Guide</a></li>
                        <li><a href="#" className="hover:text-orange-500 transition-colors">Owner Dashboard</a></li>
                        <li><a href="#" className="hover:text-orange-500 transition-colors">Success Stories</a></li>
                        <li><a href="#" className="hover:text-orange-500 transition-colors">Community Guidelines</a></li>
                    </ul>
                </div>

                {/* Support Column */}
                <div>
                    <h4 className="text-white font-bold mb-6">Support</h4>
                    <ul className="space-y-4 text-sm">
                        <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-orange-500 transition-colors">Safety & Security</a></li>
                        <li><a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} LocalFind. All rights reserved.</p>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <Mail className="w-4 h-4" />
                    <span>hello@localfind.co.za</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
