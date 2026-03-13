import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ 
    children: React.ReactNode;
    adminOnly?: boolean;
    ownerOnly?: boolean;
}> = ({ children, adminOnly, ownerOnly }) => {
    const { user, role, loading, profileLoading } = useAuth();
    const location = useLocation();

    if (loading || (user && profileLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    if (adminOnly && role !== 'admin') {
        return <Navigate to="/user/dashboard" replace />;
    }

    if (ownerOnly && role !== 'experience_owner' && role !== 'admin') {
        return <Navigate to="/user/dashboard" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
