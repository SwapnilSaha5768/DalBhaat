import React, { useState } from 'react';
import './EditOrderModal.css';

function EditOrderModal({ order, onClose, onSave }) {
  const [updatedOrder, setUpdatedOrder] = useState({ ...order });
  const [totalAmount, setTotalAmount] = useState(order.totalAmount); // Track the total amount

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle delivery option change
    if (name === 'deliveryOption') {
      if (updatedOrder.deliveryOption === 'express' && value === 'standard') {
        setTotalAmount((prev) => prev - 40); // Reduce 40 Tk
      } else if (updatedOrder.deliveryOption === 'standard' && value === 'express') {
        setTotalAmount((prev) => prev + 40); // Add 40 Tk
      }
    }

    // Update the order state
    setUpdatedOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave({ ...updatedOrder, totalAmount }); // Include the updated total amount in the save
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Order</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Customer Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={updatedOrder.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={updatedOrder.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={updatedOrder.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="deliveryOption">Delivery Option</label>
            <select
              id="deliveryOption"
              name="deliveryOption"
              value={updatedOrder.deliveryOption}
              onChange={handleInputChange}
            >
              <option value="standard">Standard</option>
              <option value="express">Express</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={updatedOrder.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="cash">Cash on Delivery</option>
              <option value="bkash">bKash</option>
            </select>
          </div>
          <div className="form-group">
            <label>Total Amount: </label>
            <p><b>{totalAmount} Tk</b></p>
          </div>
        </form>
        <div className="modal-actions">
          <button onClick={onClose} className="modal-btn cancel">Cancel</button>
          <button onClick={handleSave} className="modal-btn save">Save</button>
        </div>
      </div>
    </div>
  );
}

export default EditOrderModal;
