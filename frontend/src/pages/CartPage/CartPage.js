import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartItems, updateCartItem, removeCartItem, getProductStock } from '../../services/api';
import './CartPage.css';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartItems();
        for (let item of items) {
          const stock = await getProductStock(item.name); // Fetch stock for each product
          item.maxQuantity = stock; // Add maxQuantity to each item
        }
        setCartItems(items);
        calculateTotal(items);
      } catch (err) {
        console.error('Error fetching cart items:', err);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = (items) => {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(totalAmount);
  };

  const handleQuantityChange = async (name, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(name);
      return;
    }

    try {
      const item = cartItems.find((item) => item.name === name);

      if (newQuantity > item.maxQuantity) {
        alert(`Only ${item.maxQuantity} items available in stock.`);
        return;
      }

      const updatedCart = await updateCartItem(name, item.price, item.image, newQuantity);
      for (let updatedItem of updatedCart.items) {
        const stock = await getProductStock(updatedItem.name);
        updatedItem.maxQuantity = stock;
      }
      setCartItems(updatedCart.items);
      calculateTotal(updatedCart.items);
    } catch (err) {
      console.error('Error updating cart item quantity:', err);
    }
  };

  const handleRemoveItem = async (name) => {
    try {
      await removeCartItem(name);
      const updatedItems = cartItems.filter((item) => item.name !== name);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      console.error('Error removing item from cart:', err);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems } });
  };

  return (
    <div className="cart-page-container">
      <h2 className="cart-title">Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is currently empty.</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-container">
            {cartItems.map((item) => (
              <div key={item.name} className="cart-item-card">
                <div className="cart-item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">BDT {item.price}</p>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button
                      onClick={() => handleQuantityChange(item.name, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.name, item.quantity + 1)}
                      disabled={item.quantity >= item.maxQuantity}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    BDT {(item.price * item.quantity).toFixed(0)}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.name)}
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>BDT {total.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>BDT {total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className="continue-shopping-link" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>

  );
}

export default CartPage;
