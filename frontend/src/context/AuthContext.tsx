import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
    type User,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    sendEmailVerification
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../config/firebase';

const BACKEND_URL = 'http://localhost:3001';

interface AuthContextType {
    user: User | null;
    userData: any | null;
    role: 'user' | 'experience_owner' | 'admin' | null;
    loading: boolean;
    profileLoading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [role, setRole] = useState<'user' | 'experience_owner' | 'admin' | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log("Auth state changed:", currentUser ? "User logged in" : "No user");
            setUser(currentUser);

            if (currentUser) {
                setProfileLoading(true);
                try {
                    const idToken = await currentUser.getIdToken();
                    
                    // Look for a name override in sessionStorage (set during sign-up)
                    const nameOverride = sessionStorage.getItem('pendingDisplayName');

                    // Sync session
                    await fetch(`${BACKEND_URL}/api/sessionLogin`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            idToken,
                            displayName: nameOverride || currentUser.displayName
                        }),
                        credentials: 'include',
                    });

                    if (nameOverride) sessionStorage.removeItem('pendingDisplayName');

                    // Fetch profile/role
                    const response = await fetch(`${BACKEND_URL}/api/sessionStatus`, {
                        credentials: 'include',
                    });
                    const data = await response.json();
                    if (data.status === 'authenticated' && data.user) {
                        setRole(data.user.role || 'user');
                        setUserData(data.user);
                    }
                } catch (err) {
                    console.error("Failed to sync session or fetch profile:", err);
                } finally {
                    setProfileLoading(false);
                }
            } else {
                setRole(null);
                setUserData(null);
            }

            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const timeoutRef = useRef<any>(null);
    const INACTIVITY_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours

    const resetTimer = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (user) {
            timeoutRef.current = setTimeout(() => {
                console.log("Inactivity detected, logging out...");
                logout();
            }, INACTIVITY_TIMEOUT);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

            const handleEvent = () => resetTimer();

            events.forEach(event => {
                window.addEventListener(event, handleEvent);
            });

            // Initialize timer
            resetTimer();

            return () => {
                events.forEach(event => {
                    window.removeEventListener(event, handleEvent);
                });
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            };
        } else {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [user, resetTimer]);

    const signInWithGoogle = async () => {
        setError(null);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err: any) {
            setError(mapAuthError(err.code));
        }
    };

    const signInWithApple = async () => {
        setError(null);
        try {
            await signInWithPopup(auth, appleProvider);
        } catch (err: any) {
            setError(mapAuthError(err.code));
        }
    };

    const logout = async () => {
        setError(null);
        try {
            await signOut(auth);
            await fetch(`${BACKEND_URL}/api/sessionLogout`, {
                method: 'POST',
                credentials: 'include',
            });
            sessionStorage.removeItem('welcomeShown');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const signUpWithEmail = async (email: string, password: string) => {
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);
        } catch (err: any) {
            setError(mapAuthError(err.code));
            throw err;
        }
    };

    const mapAuthError = (errorCode: string) => {
        switch (errorCode) {
            case 'auth/operation-not-allowed':
                return 'Sign-in provider is disabled. Please enable it in the Firebase Console.';
            case 'auth/popup-closed-by-user':
                return 'Sign-in popup was closed before completion.';
            case 'auth/configuration-not-found':
                return 'Firebase configuration is missing or invalid.';
            default:
                return errorCode;
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            userData,
            role,
            loading,
            profileLoading,
            signInWithGoogle,
            signInWithApple,
            signUpWithEmail,
            logout,
            error
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
