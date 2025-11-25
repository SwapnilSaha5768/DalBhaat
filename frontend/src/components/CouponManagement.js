import React, { useState, useEffect } from 'react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../services/api';
import './CouponManagement.css';

function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 0,
    expiresAt: '',
    usageLimit: null,
  });
  const [editingCoupon, setEditingCoupon] = useState(null); // Holds the coupon currently being edited
  const [activeView, setActiveView] = useState('create'); // Toggle between "create" and "existing"

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await getCoupons();
      setCoupons(response);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleCreateCoupon = async () => {
    try {
      await createCoupon(newCoupon);
      alert('Coupon created successfully!');
      fetchCoupons();
      setNewCoupon({ code: '', discount: 0, expiresAt: '', usageLimit: null });
      setActiveView('existing');
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Failed to create coupon');
    }
  };

  const handleUpdateCoupon = async () => {
    try {
      const updatedData = {
        code: editingCoupon.code,
        discount: editingCoupon.discount,
        expiresAt: editingCoupon.expiresAt,
        usageLimit: editingCoupon.usageLimit,
      };
  
      await updateCoupon(editingCoupon._id, updatedData); // Call API
      alert('Coupon updated successfully!');
      fetchCoupons(); // Refresh the coupon list
      setEditingCoupon(null); // Exit editing mode
    } catch (error) {
      console.error('Failed to update coupon:', error);
      alert('Failed to update coupon. Please try again.');
    }
  };
  

  const handleDeleteCoupon = async (id) => {
    try {
      await deleteCoupon(id);
      alert('Coupon deleted successfully!');
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  return (
    <div className="coupon-management">
      <h2>Coupon Management</h2>
      <div className="toggle-buttons">
        <button
          className={`toggle-btn ${activeView === 'create' ? 'active' : ''}`}
          onClick={() => setActiveView('create')}
        >
          Create New Coupon
        </button>
        <button
          className={`toggle-btn ${activeView === 'existing' ? 'active' : ''}`}
          onClick={() => setActiveView('existing')}
        >
          Existing Coupons
        </button>
      </div>

      {activeView === 'create' && (
        <div className="coupon-form">
          <h3>Create New Coupon</h3>
          <input
            type="text"
            placeholder="Coupon Code"
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
          />
          <input
            type="number"
            placeholder="Discount Amount"
            value={newCoupon.discount}
            onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
          />
          <input
            type="date"
            placeholder="Expiry Date"
            value={newCoupon.expiresAt}
            onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
          />
          <input
            type="number"
            placeholder="Usage Limit (optional)"
            value={newCoupon.usageLimit || ''}
            onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value || null })}
          />
          <button onClick={handleCreateCoupon}>Create Coupon</button>
        </div>
      )}

      {activeView === 'existing' && (
        <div className="coupon-list">
          <h3>Existing Coupons</h3>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount (BDT)</th>
                <th>Expiry Date</th>
                <th>Usage Limit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  {editingCoupon && editingCoupon._id === coupon._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={editingCoupon.code}
                          onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editingCoupon.discount}
                          onChange={(e) => setEditingCoupon({ ...editingCoupon, discount: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={new Date(editingCoupon.expiresAt).toISOString().split('T')[0]}
                          onChange={(e) => setEditingCoupon({ ...editingCoupon, expiresAt: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editingCoupon.usageLimit || ''}
                          onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimit: e.target.value })}
                        />
                      </td>
                      <td>
                        <button onClick={handleUpdateCoupon}>Save</button>
                        <button onClick={() => setEditingCoupon(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{coupon.code}</td>
                      <td>{coupon.discount}</td>
                      <td>{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                      <td>{coupon.usageLimit || 'Unlimited'}</td>
                      <td>
                        <button onClick={() => setEditingCoupon(coupon)}>Edit</button>
                        <button onClick={() => handleDeleteCoupon(coupon._id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CouponManagement;
