import React from 'react';
<<<<<<< HEAD
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
=======
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
>>>>>>> f2bf24b (feat: Integrat Firebase Auth, User Dashboard, and Search functionality- Integrate Firebase Authentication (Google, Email/Password) and Firestore.- Implement User Dashboard (Layout, Profile management, Protected Routes).- Add Search feature for experiences (by location/text).- Delete legacy SQL backend files and improved form accessibility.)
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) {
<<<<<<< HEAD
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
=======
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return <>{children}</>;
>>>>>>> f2bf24b (feat: Integrat Firebase Auth, User Dashboard, and Search functionality- Integrate Firebase Authentication (Google, Email/Password) and Firestore.- Implement User Dashboard (Layout, Profile management, Protected Routes).- Add Search feature for experiences (by location/text).- Delete legacy SQL backend files and improved form accessibility.)
};

export default ProtectedRoute;
