import React from 'react';
import { Compass, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp: React.FC = () => {
    const { signInWithGoogle, signInWithApple, signUpWithEmail, user, loading, error: authError } = useAuth();
    const navigate = useNavigate();
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [localError, setLocalError] = React.useState<string | null>(null);
    const [isSigningUp, setIsSigningUp] = React.useState(false);

    React.useEffect(() => {
        if (user && !loading) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleGoogleSignIn = async () => {
        await signInWithGoogle();
    };

    const handleAppleSignIn = async () => {
        await signInWithApple();
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        setIsSigningUp(true);

        if (!fullName || !email || !password) {
            setLocalError("Please fill in all fields.");
            setIsSigningUp(false);
            return;
        }

        try {
            await signUpWithEmail(email, password);
        } catch (err: any) {
            setLocalError(err.message || 'Failed to sign up');
        } finally {
            setIsSigningUp(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white font-sans text-gray-900">
            {/* Left Side - Image & Testimonial */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                <img
                    src="/images/LoginImg.png"
                    alt="Tsitsikamma National Park, Eastern Cape"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                <div className="absolute bottom-0 left-0 p-16 text-white z-10">
                    <div className="flex items-center gap-2 mb-6">
                        <Compass className="w-8 h-8 text-orange-500" />
                        <span className="font-serif text-2xl font-bold tracking-tight">LocalFind</span>
                    </div>
                    <blockquote className="font-serif text-3xl leading-snug mb-6">
                        "I never knew my own city had so much to offer until I joined. Now I host weekend tours and meet amazing people."
                    </blockquote>
                    <p className="font-medium text-orange-200">– Thabo M., Experience Owner</p>
                </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
                <Link to="/" className="absolute top-8 left-8 text-gray-500 hover:text-orange-600 flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="font-serif text-4xl font-bold mb-3 text-gray-900">Create an account</h1>
                        <p className="text-gray-500">Join our community of explorers and locals.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSignUp}>
                        {/* Error Message */}
                        {(localError || authError) && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                                {localError || authError}
                            </div>
                        )}

                        {/* Full Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fullName">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-gray-50 text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-gray-50 text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            disabled={isSigningUp}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSigningUp ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Social Login Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={handleAppleSignIn}
                            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
                        >
                            <img src="https://www.svgrepo.com/show/448234/apple.svg" alt="Apple" className="w-5 h-5" />
                            Apple
                        </button>
                    </div>

                    {/* Sign In Link */}
                    <div className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?
                        <Link to="/signin" className="font-bold text-orange-600 hover:text-orange-700 ml-1 hover:underline">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
