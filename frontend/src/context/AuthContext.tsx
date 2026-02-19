import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    type User,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    sendEmailVerification
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../config/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth state changed:", currentUser ? "User logged in" : "No user");
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

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
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithApple, signUpWithEmail, logout, error }}>
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
