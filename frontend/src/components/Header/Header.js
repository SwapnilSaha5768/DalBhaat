import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCartItems } from '../../services/api';
import './Header.css';

function Header({ setSearchQuery, isLoggedIn, isAdmin, onLogout, toggleAdminSidebar }) {
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

    // Also listen for storage events in case of cross-tab updates (optional but good)
    // window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      // window.removeEventListener('storage', handleCartUpdate);
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
    alert('You have been logged out.');
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
    <header className="header">
      <div className="header-top">
        <div className="header-logo">
          <a href="/">DalBhaat</a>
        </div>
        <div className="mobile-actions">
          <a href="/cart" className="mobile-cart-btn" aria-label="Cart">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </a>
          <button
            className="hamburger-menu"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>
      </div>

      <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
        {isAdmin && <a href="/admin" onClick={() => setIsMenuOpen(false)}>Admin</a>}
        <a href="/cart" className="desktop-only" onClick={() => setIsMenuOpen(false)}>
          Cart {cartCount > 0 && <span className="cart-badge-desktop">({cartCount})</span>}
        </a>
        {isLoggedIn && <a href="/order-history" onClick={() => setIsMenuOpen(false)}>Order History</a>}
        {!isLoggedIn ? (
          <a href="/login" onClick={() => setIsMenuOpen(false)}>Login</a>
        ) : (
          !location.pathname.startsWith('/admin') && (
            <a href="/login" onClick={handleLogout}>
              Logout
            </a>
          )
        )}
      </nav>

      {location.pathname === '/' && (
        <form className={`header-search ${isMenuOpen ? 'open' : ''}`} onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      )}
    </header>
  );
}

export default Header;
