import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import CartPage from './pages/CartPage/CartPage';
import LoginPage from './pages/Login/Login';
import OrderManagement from './components/AdminPanel/OrderManagement/OrderManagement';
import RegistrationPage from './pages/Registration/Registration';
import AdminPanel from './components/AdminPanel/AdminPanel';
import Header from './pages/Home/Header';
import Footer from './pages/Home/Footer/Footer';
import Checkout from './pages/CheckOut/Checkout';
import FAQ from './pages/Home/Footer/FAQ';
import Contact from './pages/Home/Contact';
import OrderConfirmation from './pages/CheckOut/OrderConfirmation';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import ProfilePage from './pages/Profile/Profile';
import ProtectedAdminRoute from './components/AdminPanel/ProtectedAdminRoute';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import { clearCart, getUserProfile, logoutUser } from './services/api';
import { ToastProvider } from './context/ToastContext';



import { useLocation } from 'react-router-dom';

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');


  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await getUserProfile();
        setIsLoggedIn(true);
        setIsAdmin(user.isAdmin);
      } catch (error) {
        setIsLoggedIn(false);
        setIsAdmin(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (adminStatus) => {
    setIsLoggedIn(true);
    setIsAdmin(adminStatus);
  };
  const handleLogout = async () => {
    try {
      await clearCart();
      await logoutUser();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setAdminSidebarOpen(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        setSearchQuery={setSearchQuery}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        toggleAdminSidebar={() => setAdminSidebarOpen(!adminSidebarOpen)}
        toggleSidebarCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <main className="flex-grow pt-[70px]">
        <Routes>
          <Route
            path="/"
            element={<HomePage searchQuery={searchQuery} />}
          />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <RegistrationPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute isLoggedIn={isLoggedIn} isAdmin={isAdmin}>
                <AdminPanel
                  isOpen={adminSidebarOpen}
                  setIsOpen={setAdminSidebarOpen}
                  isCollapsed={isSidebarCollapsed}
                  setIsCollapsed={setIsSidebarCollapsed}
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
          <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <div className={isAdminRoute ? `${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300` : "transition-all duration-300"}>
        <Footer />
      </div>
    </div>
  );
}




function App() {
  return (
    <Router>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </Router>
  );
}

export default App;
