import React, { useState, useEffect } from 'react';
import ProductForm from '../ProductForm';
import EditDeleteProduct from '../EditDeleteProduct';
import UserManagement from '../UserManagement';
import OrderManagement from '../OrderManagement';
import WishlistDetails from '../WishlistDetails';
import CouponManagement from '../CouponManagement';
import { getProducts, getUsers, getOrders, getCoupons, getTotalIncome } from '../../services/api';
import './AdminPanel.css';

function AdminPanel({ isOpen, setIsOpen, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Removed local state
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

        console.log('Products data:', productsData);
        console.log('Users data:', usersData);
        console.log('Orders data:', ordersData);
        console.log('Coupons data:', couponsData);

        // Handle different response formats
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
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768 && setIsOpen) {
      setIsOpen(false);
    }
  };

  const renderDashboard = () => (
    <div className="dashboard">
      <h2 className="section-title">Dashboard Overview</h2>
      {loading ? (
        <div className="loading-stats">Loading statistics...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon products-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon users-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orders-icon">🛒</div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon coupons-icon">🎟️</div>
            <div className="stat-info">
              <h3>{stats.activeCoupons}</h3>
              <p>Active Coupons</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon income-icon">💰</div>
            <div className="stat-info">
              <h3>BDT {stats.totalIncome.toFixed(2)}</h3>
              <p>Total Income</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'addProduct':
        return <ProductForm />;
      case 'manageProducts':
        return <EditDeleteProduct />;
      case 'wishlist':
        return <WishlistDetails />;
      case 'users':
        return <UserManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'coupons':
        return <CouponManagement />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="admin-panel">
      {/* Mobile Header Removed - Using Main Header Hamburger */}

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleSectionChange('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>

          <div className="nav-group">
            <button
              className={`nav-item ${expandedMenus.products ? 'expanded' : ''}`}
              onClick={() => toggleMenu('products')}
            >
              <span className="nav-icon">📦</span>
              <span className="nav-text">Products</span>
              <span className="expand-icon">{expandedMenus.products ? '▼' : '▶'}</span>
            </button>
            {expandedMenus.products && (
              <div className="sub-menu">
                <button
                  className={`sub-nav-item ${activeSection === 'addProduct' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('addProduct')}
                >
                  <span className="sub-nav-text">Add Product</span>
                </button>
                <button
                  className={`sub-nav-item ${activeSection === 'manageProducts' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('manageProducts')}
                >
                  <span className="sub-nav-text">Manage Products</span>
                </button>
                <button
                  className={`sub-nav-item ${activeSection === 'wishlist' ? 'active' : ''}`}
                  onClick={() => handleSectionChange('wishlist')}
                >
                  <span className="sub-nav-text">Wishlist</span>
                </button>
              </div>
            )}
          </div>

          <button
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => handleSectionChange('users')}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Users</span>
          </button>

          <button
            className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => handleSectionChange('orders')}
          >
            <span className="nav-icon">🛒</span>
            <span className="nav-text">Orders</span>
          </button>

          <button
            className={`nav-item ${activeSection === 'coupons' ? 'active' : ''}`}
            onClick={() => handleSectionChange('coupons')}
          >
            <span className="nav-icon">🎟️</span>
            <span className="nav-text">Coupons</span>
          </button>

          <div className="sidebar-spacer"></div>

          <button
            className="nav-item logout-btn"
            onClick={onLogout}
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminPanel;
