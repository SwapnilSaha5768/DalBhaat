import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { placeOrder, reduceStock, validateCoupon, clearCart, getUsers } from '../../services/api';
import './CheckoutPage.css';

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [transactionId, setTransactionId] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [deliveryCharge, setDeliveryCharge] = useState(60);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  useEffect(() => {
    if (location.state && location.state.cartItems) {
      setCartItems(location.state.cartItems);
      calculateTotal(location.state.cartItems, 60, 0);
    } else {
      console.error('No cart items found! Redirecting to cart...');
      navigate('/cart');
    }

    // Fetch user name
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          // Try to get name from localStorage first if available (optional optimization)
          // Or fetch from API
          const users = await getUsers(); // Assuming getUsers returns all users or we have a specific endpoint
          // If getUsers returns { users: [] } or []
          const userList = Array.isArray(users) ? users : users.users || [];
          const currentUser = userList.find(u => u._id === userId || u.id === userId);

          if (currentUser) {
            setBillingInfo(prev => ({ ...prev, name: currentUser.name }));
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserName();

  }, [location, navigate]);

  const calculateTotal = (items, deliveryCharge, discount) => {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + deliveryCharge - discount;
    setFinalTotal(totalAmount);
  };

  const handleDeliveryChange = (option) => {
    const charge = option === 'express' ? 100 : 60;
    setDeliveryOption(option);
    setDeliveryCharge(charge);
    calculateTotal(cartItems, charge, discount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      alert('Please enter a valid coupon code');
      return;
    }

    try {
      const response = await validateCoupon(couponCode);
      setDiscount(response.discount);
      calculateTotal(cartItems, deliveryCharge, response.discount);
      alert(`Coupon applied! Discount: BDT ${response.discount}`);
    } catch (error) {
      console.error('Error validating coupon:', error);
      alert('Invalid coupon code');
    }
  };

  const handlePlaceOrder = async () => {
    if (!billingInfo.name || !billingInfo.phone || !billingInfo.address) {
      alert('Please fill out all billing details');
      return;
    }
    if (paymentMethod === 'bkash' && !transactionId.trim()) {
      alert('Please enter the bKash Transaction ID');
      return;
    }

    const orderData = {
      name: billingInfo.name,
      phone: billingInfo.phone,
      address: billingInfo.address,
      deliveryOption,
      paymentMethod,
      transactionId: paymentMethod === 'bkash' ? transactionId : null,
      orderSummary: cartItems.map((item) => ({
        productName: item.name,
        quantity: item.quantity,
      })),
      totalAmount: finalTotal,
      userId: localStorage.getItem('userId'), // Include userId
    };

    console.log('Placing order with data:', orderData); // Debug log

    try {
      // Place the order
      const response = await placeOrder(orderData);

      // Reduce the stock in the database
      await reduceStock(orderData.orderSummary);

      // Clear the cart
      await clearCart();

      alert(response.message);

      // Redirect to confirmation page
      navigate('/order-confirmation', {
        state: {
          orderDetails: {
            ...orderData,
            orderId: response.orderId, // Include the order ID from the backend response
          },
        },
      });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place the order. Please try again.');
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-right">
        <h2>Order Summary</h2>
        <div className="order-summary-scroll">
          {cartItems.map((item) => (
            <div key={item.name} className="order-item">
              <img src={item.image} alt={item.name} className="order-item-image" />
              <div className="order-item-details">
                <h4>{item.name}</h4>
                <p>Price: BDT {item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Subtotal: BDT {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="coupon-container">
          <input
            type="text"
            placeholder="Enter Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button onClick={handleApplyCoupon}>Apply Coupon</button>
        </div>
        <p><strong>Discount:</strong> BDT {discount}</p>
        <p><strong>Total Amount:</strong> BDT {finalTotal.toFixed(2)}</p>
      </div>
      <div className="checkout-left">
        <h2>Billing Information</h2>
        <form>
          <div className="form-group">
            <label>Name</label>
            <div className="read-only-field">{billingInfo.name || 'Loading...'}</div>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={billingInfo.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Billing Address</label>
            <textarea
              id="address"
              name="address"
              value={billingInfo.address}
              onChange={handleInputChange}
              required
            />
          </div>
        </form>
        <h2>Delivery Options</h2>
        <div className="delivery-options">
          <button
            className={`delivery-option-btn ${deliveryOption === 'standard' ? 'active' : ''}`}
            onClick={() => handleDeliveryChange('standard')}
          >
            Standard Delivery (+60 BDT)
          </button>
          <button
            className={`delivery-option-btn ${deliveryOption === 'express' ? 'active' : ''}`}
            onClick={() => handleDeliveryChange('express')}
          >
            Express Delivery (+100 BDT)
          </button>
        </div>
        <h2>Payment Method</h2>
        <div className="payment-options">
          <button
            className={`payment-option-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('cash')}
          >
            Cash on Delivery
          </button>
          <button
            className={`payment-option-btn ${paymentMethod === 'bkash' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('bkash')}
          >
            bKash
          </button>
        </div>
        {paymentMethod === 'bkash' && (
          <div className="form-group">
            <label htmlFor="transactionId">Bkash Transaction ID</label>
            <input
              type="text"
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter Transaction ID"
              required
            />
          </div>
        )}
        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
