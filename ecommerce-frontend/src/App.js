import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import CartPage from './pages/CartPage/CartPage';
import LoginPage from './pages/Login/LoginPage';
import OrderManagement from './components/OrderManagement';
import RegistrationPage from './pages/Registration/RegistrationPage';
import AdminPanel from './components/AdminPanel/AdminPanel';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Checkout from './pages/CheckOut/Checkout';
import FAQ from './pages/faq/FAQ';
import Contact from './pages/Contact/Contact';
import PlaceOrder from './components/PlaceOrder';
import OrderConfirmation from './pages/CheckOut/OrderConfirmation';



function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <Header setSearchQuery={setSearchQuery} /> {/* Pass setSearchQuery to Header */}
      <main>
        <Routes>
          <Route 
            path="/" 
            element={<HomePage searchQuery={searchQuery} />}
          />
          
          <Route path="/cart" element={<CartPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
