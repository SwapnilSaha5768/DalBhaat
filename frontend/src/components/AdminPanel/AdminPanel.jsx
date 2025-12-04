import React, { useState, useEffect } from 'react';
import ProductForm from './Product Component/ProductForm';
import EditDeleteProduct from '../EditDeleteProduct';
import UserManagement from '../UserManagement';
import OrderManagement from '../OrderManagement/OrderManagement';
import WishlistDetails from './Product Component/WishlistDetails';
import CouponManagement from '../CouponManagement';
import { getProducts, getUsers, getOrders, getCoupons, getTotalIncome } from '../../services/api';

function AdminPanel({ isOpen, setIsOpen, isCollapsed, setIsCollapsed, onLogout }) {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [expandedMenus, setExpandedMenus] = useState({ products: true });
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        activeCoupons: 0,
        totalIncome: 0
    });
    const [loading, setLoading] = useState(true);

    // Fetch stats for dashboard
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [productsData, usersData, ordersData, couponsData, incomeData] = await Promise.all([
                    getProducts().catch((err) => { console.error('Products error:', err); return []; }),
                    getUsers().catch((err) => { console.error('Users error:', err); return { users: [] }; }),
                    getOrders().catch((err) => { console.error('Orders error:', err); return { orders: [] }; }),
                    getCoupons().catch((err) => { console.error('Coupons error:', err); return { coupons: [] }; }),
                    getTotalIncome().catch((err) => { console.error('Income error:', err); return { totalIncome: 0 }; })
                ]);

                const productsCount = Array.isArray(productsData)
                    ? productsData.length
                    : (productsData?.products?.length || 0);

                const usersCount = Array.isArray(usersData)
                    ? usersData.length
                    : (usersData?.users?.length || 0);

                const ordersCount = Array.isArray(ordersData)
                    ? ordersData.length
                    : (ordersData?.orders?.length || 0);

                const couponsCount = Array.isArray(couponsData)
                    ? couponsData.length
                    : (couponsData?.coupons?.length || 0);

                setStats({
                    totalProducts: productsCount,
                    totalUsers: usersCount,
                    totalOrders: ordersCount,
                    activeCoupons: couponsCount,
                    totalIncome: incomeData?.totalIncome || 0
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const toggleMenu = (menu) => {
        if (isCollapsed) {
            setIsCollapsed(false);
            setExpandedMenus(prev => ({ ...prev, [menu]: true }));
        } else {
            setExpandedMenus(prev => ({
                ...prev,
                [menu]: !prev[menu]
            }));
        }
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        // Close sidebar on mobile after selection
        if (window.innerWidth < 768 && setIsOpen) {
            setIsOpen(false);
        }
    };

    const renderDashboard = () => (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading statistics...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-200 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">📦</div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
                            <p className="text-sm font-medium text-gray-500">Total Products</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-200 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl">👥</div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-200 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">🛒</div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
                            <p className="text-sm font-medium text-gray-500">Total Orders</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-200 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center text-2xl">🎟️</div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.activeCoupons}</h3>
                            <p className="text-sm font-medium text-gray-500">Active Coupons</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-200 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-teal-50 flex items-center justify-center text-2xl">💰</div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">BDT {stats.totalIncome.toFixed(2)}</h3>
                            <p className="text-sm font-medium text-gray-500">Total Income</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard': return renderDashboard();
            case 'addProduct': return <ProductForm />;
            case 'manageProducts': return <EditDeleteProduct />;
            case 'wishlist': return <WishlistDetails />;
            case 'users': return <UserManagement />;
            case 'orders': return <OrderManagement />;
            case 'coupons': return <CouponManagement />;
            default: return renderDashboard();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:fixed top-[70px] left-0 bottom-0 bg-gradient-to-br from-[#1a1a1a] to-[#2c3e50] text-white z-50 transform transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
            >


                <nav className="p-4 space-y-2">
                    <button
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-lg transition-colors ${activeSection === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        onClick={() => handleSectionChange('dashboard')}
                        title={isCollapsed ? "Dashboard" : ""}
                    >
                        <span className="text-xl">📊</span>
                        {!isCollapsed && <span className="font-medium whitespace-nowrap">Dashboard</span>}
                    </button>

                    <div className="space-y-1">
                        <button
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4'} py-3 rounded-lg transition-colors ${expandedMenus.products ? 'bg-gray-800/50 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                            onClick={() => toggleMenu('products')}
                            title={isCollapsed ? "Products" : ""}
                        >
                            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                                <span className="text-xl">📦</span>
                                {!isCollapsed && <span className="font-medium whitespace-nowrap">Products</span>}
                            </div>
                            {!isCollapsed && (
                                <span className={`text-xs transition-transform duration-200 ${expandedMenus.products ? 'rotate-180' : ''}`}>▼</span>
                            )}
                        </button>

                        {expandedMenus.products && !isCollapsed && (
                            <div className="pl-4 space-y-1 mt-1">
                                <button
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${activeSection === 'addProduct' ? 'text-indigo-400 font-semibold bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                    onClick={() => handleSectionChange('addProduct')}
                                >
                                    Add Product
                                </button>
                                <button
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${activeSection === 'manageProducts' ? 'text-indigo-400 font-semibold bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                    onClick={() => handleSectionChange('manageProducts')}
                                >
                                    Manage Products
                                </button>
                                <button
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${activeSection === 'wishlist' ? 'text-indigo-400 font-semibold bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                    onClick={() => handleSectionChange('wishlist')}
                                >
                                    Wishlist
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-lg transition-colors ${activeSection === 'users' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        onClick={() => handleSectionChange('users')}
                        title={isCollapsed ? "Users" : ""}
                    >
                        <span className="text-xl">👥</span>
                        {!isCollapsed && <span className="font-medium whitespace-nowrap">Users</span>}
                    </button>

                    <button
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-lg transition-colors ${activeSection === 'orders' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        onClick={() => handleSectionChange('orders')}
                        title={isCollapsed ? "Orders" : ""}
                    >
                        <span className="text-xl">🛒</span>
                        {!isCollapsed && <span className="font-medium whitespace-nowrap">Orders</span>}
                    </button>

                    <button
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-lg transition-colors ${activeSection === 'coupons' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        onClick={() => handleSectionChange('coupons')}
                        title={isCollapsed ? "Coupons" : ""}
                    >
                        <span className="text-xl">🎟️</span>
                        {!isCollapsed && <span className="font-medium whitespace-nowrap">Coupons</span>}
                    </button>

                    <div className="pt-4 mt-4 border-t border-gray-800">
                        <button
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors`}
                            onClick={onLogout}
                            title={isCollapsed ? "Logout" : ""}
                        >
                            <span className="text-xl">🚪</span>
                            {!isCollapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 p-6 min-h-[calc(100vh-70px)] transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {renderContent()}
            </main>
        </div>
    );
}

export default AdminPanel;
