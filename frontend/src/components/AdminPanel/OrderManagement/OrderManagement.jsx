import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderDetails, cancelOrder, completeOrder, updateOrderStatus } from '../../../services/api';
import EditOrderModal from './EditOrderModal';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOrder] = useState(null);
  const [estimatedDate, setEstimatedDate] = useState('');

  const handleCopyToClipboard = () => {
    const emailContent = document.getElementById('emailContent').innerText;
    navigator.clipboard.writeText(emailContent).then(() => {
      alert('Email content copied to clipboard!');
    }).catch(err => {
      console.error('Error copying text: ', err);
      alert('Failed to copy email content. Please try again.');
    });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getAllOrders();
        const activeOrders = fetchedOrders.filter(order => order.status !== 'Completed' && order.status !== 'Cancelled');
        setOrders(activeOrders);
        setFilteredOrders(activeOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleAction = async (orderId, action) => {
    try {
      switch (action) {
        case 'cancel':
          if (window.confirm('Are you sure you want to cancel this order? Stock will be restored.')) {
            await cancelOrder(orderId);
            alert('Order cancelled and stock restored successfully.');
          }
          break;
        case 'edit':
          const orderToEdit = orders.find((order) => order._id === orderId);
          setEditingOrder(orderToEdit);
          break;
        case 'confirm':
          await updateOrderStatus(orderId, 'Confirmed');
          alert('Order confirmed.');
          break;
        case 'place':
          if (window.confirm('Mark this order as completed? It will be removed from the list and added to income.')) {
            await completeOrder(orderId);
            alert('Order completed successfully.');
          }
          break;
        default:
          alert('Invalid action.');
      }
      const refreshedOrders = await getAllOrders();
      const activeOrders = refreshedOrders.filter(order => order.status !== 'Completed' && order.status !== 'Cancelled');
      setOrders(activeOrders);
      setFilteredOrders(activeOrders);
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      alert(`Failed to ${action} order. Please try again.`);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter(
          (order) =>
            order._id.toLowerCase().includes(query) ||
            order.name.toLowerCase().includes(query)
        )
      );
    }
  };

  const handleDateChange = (e) => {
    setEstimatedDate(e.target.value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold text-gray-800">Order Management</h3>
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Search by Order ID or Customer Name"
            value={searchQuery}
            onChange={handleSearch}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center text-gray-500">No active orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                <th className="px-6 py-4">Order Info</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Payment & Delivery</th>
                <th className="px-6 py-4 w-64">Order Summary</th>
                <th className="px-6 py-4">Total & Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const isConfirmed = order.status === 'Confirmed';
                return (
                  <tr key={order._id} className={`hover:bg-gray-50/50 transition-colors ${isConfirmed ? 'bg-green-50/30' : ''}`}>
                    {/* Order Info */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-mono font-medium text-gray-500">#{order._id.slice(-6).toUpperCase()}</span>
                        <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>

                    {/* Customer Details */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-900">{order.name}</span>
                        <a href={`tel:${order.phone}`} className="text-xs text-indigo-600 hover:underline">{order.phone}</a>
                        <div className="text-xs text-gray-500 mt-1 max-w-[150px] leading-relaxed" title={order.address}>
                          {order.address}
                        </div>
                      </div>
                    </td>

                    {/* Payment & Delivery */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {order.paymentMethod}
                          </span>
                          {order.transactionId && (
                            <span className="text-xs font-mono text-gray-500" title="Transaction ID">
                              {order.transactionId}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span className="text-lg">🚚</span>
                          <span>{order.deliveryOption}</span>
                        </div>
                      </div>
                    </td>

                    {/* Order Summary */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-1">
                        {order.orderSummary.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs border-b border-gray-50 last:border-0 pb-1 last:pb-0">
                            <span className="text-gray-700 line-clamp-1 mr-2" title={item.productName}>
                              {item.productName}
                            </span>
                            <span className="font-medium text-gray-900 whitespace-nowrap">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total & Status */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-gray-900">BDT {order.totalAmount.toFixed(2)}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${isConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex flex-col gap-2 items-end">
                        <div className="flex gap-2">
                          <button
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors w-20 ${isConfirmed
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                              }`}
                            onClick={() => handleAction(order._id, 'confirm')}
                            disabled={isConfirmed}
                          >
                            Confirm
                          </button>
                          <button
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors w-20 ${!isConfirmed
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
                              }`}
                            onClick={() => handleAction(order._id, 'place')}
                            disabled={!isConfirmed}
                          >
                            Complete
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors w-20 ${isConfirmed
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                              }`}
                            onClick={() => handleAction(order._id, 'edit')}
                            disabled={isConfirmed}
                          >
                            Edit
                          </button>
                          <button
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors w-20 ${isConfirmed
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                              }`}
                            onClick={() => handleAction(order._id, 'cancel')}
                            disabled={isConfirmed}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={async (updatedOrder) => {
            await updateOrderDetails(updatedOrder._id, updatedOrder);
            alert('Order updated successfully!');
            setEditingOrder(null);
            const refreshedOrders = await getAllOrders();
            setOrders(refreshedOrders);
            setFilteredOrders(refreshedOrders);
          }}
        />
      )}

      {/* Place Order Modal (Email Preview) */}
      {isModalOpen && modalOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Order Confirmation Email</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 overflow-auto max-h-[60vh]">
              <pre id="emailContent" className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                Dear Customer,{"\n\n"}
                Your order #{modalOrder._id} has been confirmed. The details are as follows:
                {"\n\n"}
                Order ID: {modalOrder._id}{"\n"}
                Customer Name: {modalOrder.name}{"\n"}
                Phone: {modalOrder.phone}{"\n"}
                Address: {modalOrder.address}{"\n"}
                Delivery Option: {modalOrder.deliveryOption}{"\n"}
                Payment Method: {modalOrder.paymentMethod}{"\n"}
                Total Amount: BDT {modalOrder.totalAmount.toFixed(2)}{"\n"}
                Order Summary: {modalOrder.orderSummary.map(item => `${item.productName} (x${item.quantity})`).join(", ")}{"\n\n"}
                Estimated Delivery Date:{" "}
                <input
                  type="date"
                  value={estimatedDate}
                  onChange={handleDateChange}
                  required
                  className="ml-2 p-1 border border-gray-300 rounded text-sm"
                />{"\n\n"}
                Thank you for shopping with us!{"\n\n"}
                Best regards,{"\n\n"}
                DalBhaat.com
              </pre>
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                onClick={() => handleCopyToClipboard()}
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
