import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCartItems } from '../../services/api';

function Header({ setSearchQuery, isLoggedIn, isAdmin, onLogout, toggleAdminSidebar, toggleSidebarCollapse, isSidebarCollapsed }) {
    const [query, setQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    const updateCartCount = useCallback(async () => {
        if (isLoggedIn) {
            try {
                const items = await getCartItems();
                // Calculate total quantity
                const count = items.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(count);
            } catch (error) {
                console.error('Error fetching cart count:', error);
            }
        } else {
            setCartCount(0);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        updateCartCount();

        const handleCartUpdate = () => {
            updateCartCount();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [updateCartCount]);

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchQuery(query);
        setIsMenuOpen(false); // Close menu on search
    };

    const handleLogout = () => {
        onLogout();
        // alert('You have been logged out.');
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        if (location.pathname.startsWith('/admin')) {
            toggleAdminSidebar();
        } else {
            setIsMenuOpen(!isMenuOpen);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-gradient-to-br from-[#1a1a1a] to-[#2c3e50] text-white shadow-md z-50 h-[70px]">
            <div className={`${location.pathname.startsWith('/admin') ? 'w-full' : 'max-w-7xl mx-auto'} px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4`}>

                {/* Logo */}
                <div className="flex items-center gap-4">
                    {/* Desktop Admin Sidebar Toggle */}
                    {isAdmin && location.pathname.startsWith('/admin') && (
                        <button
                            onClick={toggleSidebarCollapse}
                            className="hidden md:flex p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    )}
                    <a href="/" className="text-2xl font-bold text-white tracking-tight hover:text-gray-200 transition-colors">
                        DalBhaat
                    </a>
                </div>

                {/* Desktop Navigation & Search */}
                <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
                    {location.pathname === '/' && (
                        <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full mx-4">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={query}
                                onChange={handleSearchChange}
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                🔍
                            </button>
                        </form>
                    )}

                    <nav className="flex items-center gap-6">
                        {isAdmin && (
                            <a href="/admin" className="text-gray-300 hover:text-white font-medium transition-colors">
                                Admin
                            </a>
                        )}

                        <a href="/cart" className="text-gray-300 hover:text-white font-medium transition-colors relative">
                            Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </a>

                        {isLoggedIn ? (
                            <>
                                <a href="/profile" className="text-gray-300 hover:text-white font-medium transition-colors">
                                    Profile
                                </a>
                                {!location.pathname.startsWith('/admin') && (
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-300 hover:text-red-400 font-medium transition-colors"
                                    >
                                        Logout
                                    </button>
                                )}
                            </>
                        ) : (
                            <a href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                Login
                            </a>
                        )}
                    </nav>
                </div>

                {/* Mobile Actions */}
                <div className="flex md:hidden items-center gap-4">
                    <a href="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
                        <span className="text-xl">🛒</span>
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-gray-900">
                                {cartCount}
                            </span>
                        )}
                    </a>

                    <button
                        onClick={toggleMenu}
                        className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                        aria-label="Toggle navigation"
                    >
                        <span className="text-2xl">☰</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && !location.pathname.startsWith('/admin') && (
                <div className="md:hidden absolute top-[70px] left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                    {location.pathname === '/' && (
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={query}
                                onChange={handleSearchChange}
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                🔍
                            </button>
                        </form>
                    )}

                    <nav className="flex flex-col gap-2">
                        {isAdmin && (
                            <a href="/admin" className="px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                                Admin Dashboard
                            </a>
                        )}

                        {isLoggedIn && (
                            <a href="/profile" className="px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                                My Profile
                            </a>
                        )}

                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-3 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        ) : (
                            <a href="/login" className="px-4 py-3 bg-indigo-600 text-white text-center rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                Login
                            </a>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header;
