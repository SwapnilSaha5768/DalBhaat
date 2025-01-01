import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    console.error('No order details found! Redirecting to home...');
    navigate('/');
    return null;
  }

  const {
    name,
    phone,
    address,
    deliveryOption,
    paymentMethod,
    transactionId,
    orderSummary,
    totalAmount,
    orderId,
  } = orderDetails;

  const handleDownload = () => {
    const element = document.createElement('a');
    const fileContent = `Order Confirmation\n\n` +
      `Order ID: ${orderId}\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Address: ${address}\n` +
      `Delivery Option: ${deliveryOption === 'express' ? 'Express Delivery' : 'Standard Delivery'}\n` +
      `Payment Method: ${paymentMethod === 'bkash' ? 'bKash' : 'Cash on Delivery'}\n` +
      `${paymentMethod === 'bkash' ? `Transaction ID: ${transactionId}\n` : ''}` +
      `\nItems Ordered:\n` +
      orderSummary.map(item => `- ${item.productName}, Quantity: ${item.quantity}`).join('\n') +
      `\n\nTotal Amount: BDT ${totalAmount.toFixed(2)}\n\n` +
      `Thank you for your order! Your items will be delivered soon.`;
    
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Order_Confirmation_${orderId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="order-confirmation-container">
      <h2>Order Confirmation</h2>
      <div className="order-summary">
        <h3>Order ID: {orderId}</h3>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Address:</strong> {address}</p>
        <p><strong>Delivery Option:</strong> {deliveryOption === 'express' ? 'Express Delivery' : 'Standard Delivery'}</p>
        <p><strong>Payment Method:</strong> {paymentMethod === 'bkash' ? 'bKash' : 'Cash on Delivery'}</p>
        {paymentMethod === 'bkash' && (
          <p><strong>Transaction ID:</strong> {transactionId}</p>
        )}
        <h3>Items Ordered:</h3>
        <div className="items-list">
          {orderSummary.map((item, index) => (
            <div key={index} className="order-item">
              <p><strong>Product:</strong> {item.productName}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
            </div>
          ))}
        </div>
        <h3>Total Amount: BDT {totalAmount.toFixed(2)}</h3>
        <p>Thank you for your order! Your items will be delivered soon.</p>
      </div>
      <button className="back-home-btn" onClick={() => navigate('/')}>Back to Home</button>
      <br />
      <button className="back-home-btn" onClick={handleDownload}>Download Order Summary</button>
    </div>
  );
}

export default OrderConfirmation;
