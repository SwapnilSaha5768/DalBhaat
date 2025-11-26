import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import CartPage from './pages/CartPage/CartPage';
import LoginPage from './pages/Login/LoginPage';
import OrderManagement from './components/OrderManagement/OrderManagement';
import RegistrationPage from './pages/Registration/RegistrationPage';
import AdminPanel from './components/AdminPanel/AdminPanel';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Checkout from './pages/CheckOut/Checkout';
import FAQ from './pages/faq/FAQ';
import Contact from './pages/Contact/Contact';
import OrderConfirmation from './pages/CheckOut/OrderConfirmation';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { clearCart } from './services/api';



function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsLoggedIn(!!token);
    setIsAdmin(adminStatus);
  }, []);

  // Function to update auth state after login
  const handleLogin = (adminStatus) => {
    setIsLoggedIn(true);
    setIsAdmin(adminStatus);
  };

  // Function to handle logout
  const handleLogout = async () => {
    // Clear cart before logging out
    await clearCart();

    setIsLoggedIn(false);
    setIsAdmin(false);
    setAdminSidebarOpen(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
  };

  return (
    <Router>
      <Header
        setSearchQuery={setSearchQuery}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        toggleAdminSidebar={() => setAdminSidebarOpen(!adminSidebarOpen)}
      />
      <main>
        <Routes>
          <Route
            path="/"
            element={<HomePage searchQuery={searchQuery} />}
          />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <RegistrationPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminPanel
                  isOpen={adminSidebarOpen}
                  setIsOpen={setAdminSidebarOpen}
                  onLogout={handleLogout}
                />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order-history" element={<OrderHistory />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
