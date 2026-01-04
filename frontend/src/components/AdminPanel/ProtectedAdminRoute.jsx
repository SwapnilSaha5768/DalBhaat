import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children, isLoggedIn, isAdmin }) => {
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return (
            <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center text-center p-5">
                <div className="mb-6 rounded-full bg-red-100 p-6">
                    <svg className="h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-8 text-lg max-w-md">
                    You do not have permission to view this page. This area is restricted to administrators only.
                </p>
                <a href="/" className="px-8 py-3 bg-[#ff6b6b] text-white font-semibold rounded-lg hover:bg-[#ff5252] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Back to Home
                </a>
            </div>
        );
    }
    return children;
};

export default ProtectedAdminRoute;
