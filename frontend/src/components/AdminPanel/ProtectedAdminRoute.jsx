import React from 'react';
import { Navigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const ProtectedAdminRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('authToken');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const { showToast } = useToast();

    if (!isLoggedIn) {
        showToast('Please login to access the admin panel', 'error');
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        showToast('Access denied. Admin privileges required.', 'error');
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedAdminRoute;
