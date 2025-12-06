import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('authToken');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!isLoggedIn) {
        alert('Please login to access the admin panel');
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        alert('Access denied. Admin privileges required.');
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedAdminRoute;
