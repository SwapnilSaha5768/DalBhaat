import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Home, ShoppingBag, MapPin, Truck, CreditCard } from 'lucide-react';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderDetails = location.state?.orderDetails;

    useEffect(() => {
        if (!orderDetails) {
            console.warn('No order details found! Redirecting to home...');
            const timer = setTimeout(() => navigate('/'), 3000);
            return () => clearTimeout(timer);
        }
    }, [orderDetails, navigate]);

    if (!orderDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Redirecting to home...</p>
                </div>
            </div>
        );
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-2xl w-full space-y-8">

                {/* Success Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center text-white">
                        <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
                        <p className="text-emerald-100 text-lg">Thank you for your purchase.</p>
                        <p className="text-sm font-mono mt-4 bg-white/10 inline-block px-4 py-1 rounded-full border border-white/20">
                            Order ID: {orderId}
                        </p>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Customer Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Shipping Details
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 space-y-2">
                                    <p><span className="font-semibold text-gray-900">{name}</span></p>
                                    <p>{phone}</p>
                                    <p>{address}</p>
                                </div>
                            </div>

                            {/* Order Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Truck className="w-4 h-4" /> Delivery Info
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 space-y-2">
                                    <p className="flex justify-between">
                                        <span>Method:</span>
                                        <span className="font-medium text-gray-900 capitalize">{deliveryOption}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Payment:</span>
                                        <span className="font-medium text-gray-900 flex items-center gap-1">
                                            <CreditCard className="w-3 h-3" />
                                            {paymentMethod === 'bkash' ? 'bKash' : 'COD'}
                                        </span>
                                    </p>
                                    {paymentMethod === 'bkash' && (
                                        <p className="flex justify-between">
                                            <span>Trx ID:</span>
                                            <span className="font-mono text-xs bg-gray-200 px-1 rounded">{transactionId}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Table */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-gray-500" />
                                <h3 className="text-sm font-semibold text-gray-700">Order Summary</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {orderSummary.map((item, index) => (
                                    <div key={index} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.productName}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        {/* Price isn't in standard object, assume known or total */}
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="font-semibold text-gray-700">Total Amount</span>
                                <span className="text-xl font-bold text-indigo-600">BDT {totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleDownload}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Download className="w-4 h-4" />
                                Download Invoice
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Home className="w-4 h-4" />
                                Return Home
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Support Text */}
                <p className="text-center text-sm text-gray-400">
                    Need help with your order? <a href="/contact" className="text-indigo-500 hover:underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
};

export default OrderConfirmation;
