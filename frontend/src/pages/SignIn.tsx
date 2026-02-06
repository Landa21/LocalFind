import React from 'react';
import { Compass, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignIn: React.FC = () => {
    return (
        <div className="min-h-screen flex bg-white font-sans text-gray-900">
            {/* Left Side - Image & Testimonial */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                <img
                    src="/images/loginImg2.jpg"
                    alt="Travel destination"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                <div className="absolute bottom-0 left-0 p-16 text-white z-10">
                    <div className="flex items-center gap-2 mb-6">
                        <Compass className="w-8 h-8 text-orange-500" />
                        <span className="font-serif text-2xl font-bold tracking-tight">LocalFind</span>
                    </div>
                    <blockquote className="font-serif text-3xl leading-snug mb-6">
                        "The authentic experiences I found through LocalFind completely changed my perspective on travel. It's not just visiting; it's belonging."
                    </blockquote>
                    <p className="font-medium text-orange-200">– Elena R., World Traveler</p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
                <Link to="/" className="absolute top-8 left-8 text-gray-500 hover:text-orange-600 flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="font-serif text-4xl font-bold mb-3 text-gray-900">Welcome back</h1>
                        <p className="text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    <form className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-gray-50 text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-gray-50 text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Remember & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-600 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-2" />
                                Keep me signed in
                            </label>
                            <a href="#" className="font-medium text-orange-600 hover:text-orange-700 hover:underline">Forgot password?</a>
                        </div>

                        {/* Submit Button */}
                        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
                            Sign In
                        </button>
                    </form>

                    {/* Social Login Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or sign in with</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex gap-4">
                        <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Google
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700">
                            <img src="https://www.svgrepo.com/show/448234/apple.svg" alt="Apple" className="w-5 h-5" />
                            Apple
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?
                        <a href="#" className="font-bold text-orange-600 hover:text-orange-700 ml-1 hover:underline">Sign up for free</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
