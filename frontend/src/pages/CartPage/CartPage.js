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
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-table-container">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.name}>
                  <td data-label="Product">
                    <img src={item.image} alt={item.name} />
                  </td>
                  <td data-label="Name">{item.name}</td>
                  <td data-label="Price">BDT {item.price}</td>
                  <td data-label="Quantity">
                    <div className="quantity-control">
                      <button
                        onClick={() => handleQuantityChange(item.name, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.name, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQuantity}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td data-label="Actions">
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.name)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-total">
            <h3>Total: BDT {total.toFixed(2)}</h3>
          </div>
          <div className="checkout-btn-container">
            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout Now
            </button>
          </div>
        </div>
      )}
    </div>

  );
}

export default CartPage;
