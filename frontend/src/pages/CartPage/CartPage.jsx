import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartItems, updateCartItem, removeCartItem, getProductStock } from '../../services/api';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const items = await getCartItems();
                for (let item of items) {
                    const stock = await getProductStock(item.name);
                    item.maxQuantity = stock;
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
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-10 font-sans text-gray-800 min-h-[80vh]">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                    <p className="text-xl text-gray-500 mb-6">Your cart is currently empty.</p>
                    <button
                        className="bg-blue-600 text-white border-none py-3 px-8 text-base font-semibold rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                        onClick={() => navigate('/')}
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
                    <div className="flex flex-col gap-5">
                        {cartItems.map((item) => (
                            <div key={item.name} className="flex flex-col sm:flex-row items-start sm:items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                                <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center mr-5 flex-shrink-0 mb-4 sm:mb-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <span className="text-2xl">📦</span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-1 text-gray-900">{item.name}</h3>
                                    <p className="text-gray-500 font-medium">BDT {item.price}</p>
                                </div>

                                <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => handleQuantityChange(item.name, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="w-8 h-8 border-none bg-white rounded-md cursor-pointer font-bold text-gray-800 flex items-center justify-center shadow-sm transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            -
                                        </button>
                                        <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.name, item.quantity + 1)}
                                            disabled={item.quantity >= item.maxQuantity}
                                            className="w-8 h-8 border-none bg-white rounded-md cursor-pointer font-bold text-gray-800 flex items-center justify-center shadow-sm transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="font-bold text-gray-900 min-w-[80px] text-right">
                                        BDT {(item.price * item.quantity).toFixed(0)}
                                    </div>
                                    <button
                                        className="bg-red-100 text-red-500 border-none w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-red-200 hover:text-red-600"
                                        onClick={() => handleRemoveItem(item.name)}
                                        aria-label="Remove item"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="text-xl font-bold mb-5 pb-4 border-b border-gray-100 text-gray-900">Order Summary</h3>
                        <div className="flex justify-between mb-4 text-gray-600 text-base">
                            <span>Subtotal</span>
                            <span>BDT {total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mt-5 pt-4 border-t-2 border-gray-100 font-bold text-gray-900 text-lg">
                            <span>Total</span>
                            <span>BDT {total.toFixed(2)}</span>
                        </div>
                        <button
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-none py-4 text-base font-semibold rounded-xl cursor-pointer mt-5 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 hover:shadow-emerald-500/30"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </button>
                        <button
                            className="w-full bg-transparent border-none text-gray-500 mt-4 cursor-pointer text-sm underline hover:text-gray-800"
                            onClick={() => navigate('/')}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;
