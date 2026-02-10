import React from 'react';
import { Compass, Mail, Lock, User, ArrowLeft, Building2, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StartTrial: React.FC = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && !loading) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    return (
        <div className="min-h-screen flex bg-white font-sans text-gray-900">
            {/* Left Side - Image & Testimonial */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                <video
                    src="/videos/Pottery.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                <div className="absolute bottom-0 left-0 p-16 text-white z-10">
                    <div className="flex items-center gap-2 mb-6">
                        <Compass className="w-8 h-8 text-orange-500" />
                        <span className="font-serif text-2xl font-bold tracking-tight">LocalFind</span>
                    </div>
                    <blockquote className="font-serif text-3xl leading-snug mb-6">
                        "Since listing my pottery workshop, I've had visitors from 15 different countries. It's transformed my small business."
                    </blockquote>
                    <p className="font-medium text-orange-200">– Sarah J., Artisan Potter</p>
                </div>
            </div>

            {/* Right Side - Start Trial Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
                <Link to="/" className="absolute top-8 left-8 text-gray-500 hover:text-orange-600 flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <span className="text-orange-600 font-bold uppercase tracking-wider text-xs mb-2 block">For Experience Owners</span>
                        <h1 className="font-serif text-4xl font-bold mb-3 text-gray-900">Start your 30-day free trial</h1>
                        <p className="text-gray-500">Join the community of hidden gems and reach more travelers.</p>
                    </div>

                    <form className="space-y-5">
                        {/* Business Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="businessName">Business / Experience Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="businessName"
                                    name="businessName"
                                    type="text"
                                    placeholder="e.g. Sarah's Pottery Studio"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-gray-50 text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Location Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="location">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    placeholder="e.g. Cape Town, Western Cape"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-gray-50 text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Full Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="ownerName">Owner's Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="ownerName"
                                    name="ownerName"
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-gray-50 text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-gray-50 text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Create Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-gray-50 text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] mt-4">
                            Start Free Trial
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            No credit card required for 30 days. By signing up, you agree to our <a href="#" className="underline hover:text-orange-600">Terms</a>.
                        </p>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
                        Already have an owner account?
                        <Link to="/signin" className="font-bold text-orange-600 hover:text-orange-700 ml-1 hover:underline">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartTrial;
