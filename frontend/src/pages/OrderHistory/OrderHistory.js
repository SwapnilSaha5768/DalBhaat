//not in use

import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../../services/api';
import './OrderHistory.css';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const userId = localStorage.getItem('userId');
            
            if (!userId) {
                setError('Please logout and login again.');
                setLoading(false);
                return;
            }
            try {
                const data = await getUserOrders(userId);
                setOrders(data);
            } catch (error) {
                console.error('Error fetching order history:', error);
                setError('Failed to load order history.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="loading-compact">Loading...</div>;

    if (error) {
        return (
            <div className="order-history-container">
                <div className="error-compact">{error}</div>
            </div>
        );
    }

    return (
        <div className="order-history-container">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p className="no-orders">No orders found.</p>
            ) : (
                <div className="order-list-wrapper">
                    {/* Header Row */}
                    <div className="order-row header">
                        <div className="col-id">Order ID</div>
                        <div className="col-date">Date</div>
                        <div className="col-items">Items</div>
                        <div className="col-total">Total</div>
                        <div className="col-status">Status</div>
                    </div>

                    {/* Data Rows */}
                    {orders.map((order) => (
                        <div key={order._id} className="order-row">
                            <div className="col-id" title={order._id}>
                                #{order._id.slice(-6)}
                            </div>
                            <div className="col-date">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="col-items">
                                {/* Create a comma separated string of items for compact view */}
                                <span title={order.orderSummary.map(i => `${i.productName} (x${i.quantity})`).join(', ')}>
                                    {order.orderSummary.map(i => `${i.productName} (${i.quantity})`).join(', ')}
                                </span>
                            </div>
                            <div className="col-total">
                                ৳{order.totalAmount.toFixed(0)}
                            </div>
                            <div className="col-status">
                                <span className={`status-badge ${order.status || 'Pending'}`}>
                                    {order.status || 'Pending'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistory;