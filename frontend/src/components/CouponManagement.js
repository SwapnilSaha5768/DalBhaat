import React, { useState, useEffect } from 'react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../services/api';

function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 0,
    expiresAt: '',
    usageLimit: null,
  });
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [activeView, setActiveView] = useState('create');

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

      await updateCoupon(editingCoupon._id, updatedData);
      alert('Coupon updated successfully!');
      fetchCoupons();
      setEditingCoupon(null);
    } catch (error) {
      console.error('Failed to update coupon:', error);
      alert('Failed to update coupon. Please try again.');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Coupon Management</h3>

        <div className="flex p-1 bg-gray-100 rounded-lg w-fit">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeView === 'create'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveView('create')}
          >
            Create New Coupon
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeView === 'existing'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveView('existing')}
          >
            Existing Coupons
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeView === 'create' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900">Create New Coupon</h3>
                <p className="text-gray-500 text-sm mt-1">Generate a discount code for your customers</p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Code</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-gray-50 focus:bg-white uppercase tracking-wider font-medium"
                      placeholder="e.g., SUMMER2024"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">৳</span>
                      <input
                        type="number"
                        className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-gray-50 focus:bg-white"
                        placeholder="0.00"
                        value={newCoupon.discount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Usage Limit</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-gray-50 focus:bg-white"
                      placeholder="Unlimited if empty"
                      value={newCoupon.usageLimit || ''}
                      onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value || null })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Expiration Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-gray-50 focus:bg-white"
                    value={newCoupon.expiresAt}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleCreateCoupon}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
                  >
                    Create Coupon
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'existing' && (
          <>
            <div className="grid grid-cols-1 gap-4 md:hidden p-4">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  {editingCoupon && editingCoupon._id === coupon._id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Code</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-200 rounded text-sm uppercase"
                          value={editingCoupon.code}
                          onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Discount</label>
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-200 rounded text-sm"
                            value={editingCoupon.discount}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, discount: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Limit</label>
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-200 rounded text-sm"
                            value={editingCoupon.usageLimit || ''}
                            onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimit: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Expiry</label>
                        <input
                          type="date"
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                          value={new Date(editingCoupon.expiresAt).toISOString().split('T')[0]}
                          onChange={(e) => setEditingCoupon({ ...editingCoupon, expiresAt: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          onClick={handleUpdateCoupon}
                          className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md text-xs font-medium hover:bg-green-100 transition-colors flex-1"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCoupon(null)}
                          className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-mono font-medium text-gray-900 text-lg">{coupon.code}</div>
                        <div className="text-sm font-bold text-gray-900">BDT {coupon.discount}</div>
                      </div>

                      <div className="space-y-1 mb-4 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Expires:</span>
                          <span className="font-medium">{new Date(coupon.expiresAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Usage Limit:</span>
                          <span className="font-medium">{coupon.usageLimit || '∞'}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end border-t border-gray-100 pt-3">
                        <button
                          onClick={() => setEditingCoupon(coupon)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium hover:bg-indigo-100 transition-colors flex-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 transition-colors flex-1"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {coupons.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  No coupons found.
                </div>
              )}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Discount</th>
                    <th className="px-6 py-4">Expiry</th>
                    <th className="px-6 py-4">Limit</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                      {editingCoupon && editingCoupon._id === coupon._id ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-200 rounded text-sm uppercase"
                              value={editingCoupon.code}
                              onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              className="w-24 p-2 border border-gray-200 rounded text-sm"
                              value={editingCoupon.discount}
                              onChange={(e) => setEditingCoupon({ ...editingCoupon, discount: e.target.value })}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              value={new Date(editingCoupon.expiresAt).toISOString().split('T')[0]}
                              onChange={(e) => setEditingCoupon({ ...editingCoupon, expiresAt: e.target.value })}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              className="w-20 p-2 border border-gray-200 rounded text-sm"
                              value={editingCoupon.usageLimit || ''}
                              onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimit: e.target.value })}
                            />
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={handleUpdateCoupon}
                              className="text-green-600 hover:text-green-800 font-medium text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCoupon(null)}
                              className="text-gray-500 hover:text-gray-700 font-medium text-sm"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 font-mono font-medium text-gray-900">{coupon.code}</td>
                          <td className="px-6 py-4 text-gray-600">BDT {coupon.discount}</td>
                          <td className="px-6 py-4 text-gray-600">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-gray-600">{coupon.usageLimit || '∞'}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingCoupon(coupon)}
                              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(coupon._id)}
                              className="text-red-600 hover:text-red-800 font-medium text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">
                        No coupons found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CouponManagement;
