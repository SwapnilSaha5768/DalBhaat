import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, getUserOrders } from '../../services/api';
// import { useNavigate } from 'react-router-dom';

const Profile = () => {
    // const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        addresses: [],
        bio: '',
        avatar: '',
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const [newAddress, setNewAddress] = useState({ street: '', city: '', zip: '', isDefault: false });
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressIndex, setEditingAddressIndex] = useState(null);

    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, ordersData] = await Promise.all([
                    getUserProfile(),
                    getUserOrders()
                ]);
                const userData = {
                    ...profileData,
                    addresses: profileData.addresses || []
                };
                setUser(userData);
                setOrders(ordersData);
            } catch (err) {
                console.error('Profile Error:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setError('');
        try {
            const updatedUser = await updateUserProfile(user);
            setUser({ ...updatedUser, addresses: updatedUser.addresses || [] });
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Profile Update Error:', err);
            setError('Failed to update profile');
        }
    };

    // Address Management Functions
    const handleSaveAddress = async () => {
        if (!newAddress.street) return;

        let updatedAddresses = [...user.addresses];

        if (newAddress.isDefault) {
            updatedAddresses.forEach(addr => addr.isDefault = false);
        }

        if (editingAddressIndex !== null) {
            // Update existing address
            updatedAddresses[editingAddressIndex] = newAddress;
        } else {
            // Add new address
            updatedAddresses.push(newAddress);
        }

        try {
            const updatedUser = await updateUserProfile({ ...user, addresses: updatedAddresses });
            setUser({ ...updatedUser, addresses: updatedUser.addresses || [] });
            setNewAddress({ street: '', city: '', zip: '', isDefault: false });
            setShowAddressForm(false);
            setEditingAddressIndex(null);
            setSuccessMessage(editingAddressIndex !== null ? 'Address updated successfully!' : 'Address added successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to save address');
        }
    };

    const handleEditAddress = (index) => {
        setNewAddress(user.addresses[index]);
        setEditingAddressIndex(index);
        setShowAddressForm(true);
    };

    const handleDeleteAddress = async (index) => {
        const updatedAddresses = user.addresses.filter((_, i) => i !== index);
        try {
            const updatedUser = await updateUserProfile({ ...user, addresses: updatedAddresses });
            setUser({ ...updatedUser, addresses: updatedUser.addresses || [] });
            setSuccessMessage('Address deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to delete address');
        }
    };

    const handleSetDefaultAddress = async (index) => {
        const updatedAddresses = user.addresses.map((addr, i) => ({
            ...addr,
            isDefault: i === index
        }));
        try {
            const updatedUser = await updateUserProfile({ ...user, addresses: updatedAddresses });
            setUser({ ...updatedUser, addresses: updatedUser.addresses || [] });
            setSuccessMessage('Default address updated!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to update default address');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff1e00]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                    <p className="text-gray-500 mt-1">Manage your profile, orders, and preferences.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4 lg:sticky lg:top-4 h-fit">
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="h-12 w-12 rounded-full bg-[#ff1e00]/10 flex items-center justify-center text-[#ff1e00] font-bold text-xl">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{user.name || 'User'}</h3>
                                    <p className="text-sm text-gray-500 truncate max-w-[150px]">{user.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'profile'
                                        ? 'bg-[#ff1e00] text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="font-medium">Profile</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'orders'
                                        ? 'bg-[#ff1e00] text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <span className="font-medium">My Orders</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('addresses')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'addresses'
                                        ? 'bg-[#ff1e00] text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="font-medium">Addresses</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'settings'
                                        ? 'bg-[#ff1e00] text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="font-medium">Settings</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full lg:w-3/4">
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                                    {error}
                                </div>
                            )}
                            {successMessage && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
                                    {successMessage}
                                </div>
                            )}

                            {activeTab === 'profile' && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={user.name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff1e00] focus:ring-4 focus:ring-[#ff1e00]/10 transition-all duration-200 outline-none"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={user.email}
                                                    disabled
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={user.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff1e00] focus:ring-4 focus:ring-[#ff1e00]/10 transition-all duration-200 outline-none"
                                                    placeholder="+1 234 567 890"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Language</label>
                                                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff1e00] focus:ring-4 focus:ring-[#ff1e00]/10 transition-all duration-200 outline-none bg-white">
                                                    <option>English</option>
                                                    <option>Spanish</option>
                                                    <option>French</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                                                <textarea
                                                    name="bio"
                                                    value={user.bio}
                                                    onChange={handleChange}
                                                    rows="3"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff1e00] focus:ring-4 focus:ring-[#ff1e00]/10 transition-all duration-200 outline-none resize-none"
                                                    placeholder="Tell us about yourself..."
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                className="px-8 py-3 bg-[#ff1e00] text-white font-bold rounded-lg hover:bg-[#e01b00] transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-[#ff1e00]/30"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
                                    {orders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-gray-400 mb-4">
                                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500">No orders found.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order._id} className="border border-gray-200 rounded-xl p-6 hover:border-[#ff1e00]/30 transition-colors duration-200">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                                        <div>
                                                            <span className="text-sm font-bold text-gray-900">Order #{order._id.slice(-6)}</span>
                                                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between items-center pt-2">
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                                            <span className="font-bold text-[#ff1e00] text-lg">BDT {order.totalAmount.toFixed(2)}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'addresses' && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">My Addresses</h2>

                                    {/* Address List */}
                                    <div className="space-y-4 mb-8">
                                        {user.addresses && user.addresses.map((addr, index) => (
                                            <div key={index} className={`p-4 border rounded-xl flex flex-col sm:flex-row justify-between items-start gap-4 ${addr.isDefault ? 'border-[#ff1e00] bg-[#ff1e00]/5' : 'border-gray-200'}`}>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-gray-900">{addr.street}</p>
                                                        {addr.isDefault && <span className="text-xs bg-[#ff1e00] text-white px-2 py-0.5 rounded-full">Default</span>}
                                                    </div>
                                                    <p className="text-gray-500 text-sm">{addr.city} {addr.zip}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditAddress(index)}
                                                        className="text-blue-500 hover:text-blue-700"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    {!addr.isDefault && (
                                                        <button
                                                            onClick={() => handleSetDefaultAddress(index)}
                                                            className="text-sm text-gray-500 hover:text-[#ff1e00]"
                                                        >
                                                            Set Default
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteAddress(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add New Address Form */}
                                    {!showAddressForm ? (
                                        <button
                                            onClick={() => {
                                                setNewAddress({ street: '', city: '', zip: '', isDefault: false });
                                                setEditingAddressIndex(null);
                                                setShowAddressForm(true);
                                            }}
                                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#ff1e00] hover:text-[#ff1e00] transition-colors duration-200 font-medium"
                                        >
                                            + Add New Address
                                        </button>
                                    ) : (
                                        <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                                            <h3 className="font-bold text-gray-900 mb-4">{editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                                                    <input
                                                        type="text"
                                                        value={newAddress.street}
                                                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff1e00] focus:ring-4 focus:ring-[#ff1e00]/10 outline-none bg-white"
                                                        placeholder="Street Address"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                                        <input
                                                            type="text"
                                                            value={newAddress.city}
                                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff1e00] focus:ring-4 focus:ring-[#ff1e00]/10 outline-none bg-white"
                                                            placeholder="City"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
                                                        <input
                                                            type="text"
                                                            value={newAddress.zip}
                                                            onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff1e00] focus:ring-4 focus:ring-[#ff1e00]/10 outline-none bg-white"
                                                            placeholder="ZIP Code"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="isDefault"
                                                        checked={newAddress.isDefault}
                                                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                                        className="w-4 h-4 text-[#ff1e00] border-gray-300 rounded focus:ring-[#ff1e00]"
                                                    />
                                                    <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default address</label>
                                                </div>
                                                <div className="flex gap-3 justify-end pt-2">
                                                    <button
                                                        onClick={() => {
                                                            setShowAddressForm(false);
                                                            setEditingAddressIndex(null);
                                                        }}
                                                        className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSaveAddress}
                                                        className="px-6 py-2 bg-[#ff1e00] text-white font-bold rounded-lg hover:bg-[#e01b00] transition-colors duration-200"
                                                    >
                                                        {editingAddressIndex !== null ? 'Update Address' : 'Save Address'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                                    <p className="text-gray-500">Settings configuration coming soon...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                                <p className="text-sm text-gray-500">#{selectedOrder._id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 max-h-[80vh] overflow-y-auto">
                            <div className="space-y-6">
                                {/* Order Status & Date */}
                                <div className="flex flex-wrap gap-4 justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order Date</p>
                                        <p className="font-medium text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            selectedOrder.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Payment Method</p>
                                        <p className="font-medium text-gray-900">{selectedOrder.paymentMethod}</p>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-4">Items Ordered</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.orderSummary.map((item, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                                                        {/* Placeholder for product image if available */}
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{item.productName}</p>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-bold text-gray-900">BDT {(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                                        <span>Total Amount</span>
                                        <span className="text-[#ff1e00]">BDT {selectedOrder.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
