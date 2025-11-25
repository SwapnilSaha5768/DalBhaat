import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('authToken');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!isLoggedIn) {
        // Not logged in, redirect to login
        alert('Please login to access the admin panel');
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        // Logged in but not admin, redirect to home
        alert('Access denied. Admin privileges required.');
        return <Navigate to="/" replace />;
    }

    // Logged in and is admin, render the admin panel
    return children;
};

export default ProtectedAdminRoute;
