import React, { useState } from 'react';

function ProductCard({ product, onAddToCart, onAddToWishlist }) {
    const [showDescription, setShowDescription] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.quantity) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div className="group relative flex flex-col justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
            <div className="relative w-full mb-2">
                <div
                    className="w-full pb-[75%] bg-cover bg-center rounded-lg bg-gray-100"
                    style={{ backgroundImage: `url(${product.image})` }}
                ></div>

                <h3 className="text-sm font-semibold text-center mt-2 mb-1 text-gray-800 line-clamp-2 min-h-[40px]">
                    {product.name}
                </h3>

                <button
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm border-none rounded-full flex justify-center items-center shadow-sm text-gray-700 hover:bg-white hover:text-blue-600 hover:scale-110 transition-all duration-200 z-10"
                    onClick={toggleDescription}
                    aria-label="Show Info"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </button>

                {showDescription && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm p-5 rounded-lg flex flex-col justify-center items-center text-center z-20 animate-in fade-in duration-200">
                        <p className="text-sm text-gray-700 leading-relaxed overflow-y-auto max-h-full scrollbar-hide">
                            {product.description}
                        </p>
                        <button
                            className="absolute top-1 right-1 p-1 text-gray-500 hover:text-gray-900 transition-colors"
                            onClick={toggleDescription}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            <div className="text-sm font-bold text-center text-gray-900 mb-3">
                BDT {product.price}
            </div>

            {product.quantity === 0 ? (
                <div className="flex justify-between items-center gap-2 mt-auto w-full">
                    <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-semibold flex-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                        </svg>
                        <span>No Stock</span>
                    </div>
                    <button
                        className="w-9 h-9 flex justify-center items-center bg-white text-pink-500 border border-pink-500 rounded-full hover:bg-pink-500 hover:text-white hover:scale-105 hover:shadow-md transition-all duration-200 shrink-0"
                        onClick={() => onAddToWishlist(product.name)}
                        aria-label="Add to Wishlist"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-center gap-2 mt-auto w-full">
                    <div className="flex justify-between items-center bg-gray-100 p-1 rounded-full flex-1">
                        <button
                            className="w-6 h-6 flex justify-center items-center bg-white border border-gray-200 rounded-full text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                        >-</button>
                        <span className="font-semibold text-sm w-6 text-center">{quantity}</span>
                        <button
                            className="w-6 h-6 flex justify-center items-center bg-white border border-gray-200 rounded-full text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= product.quantity}
                        >+</button>
                    </div>
                    <button
                        className="w-9 h-9 flex justify-center items-center bg-cyan-400 text-white border-none rounded-full hover:bg-cyan-500 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shrink-0"
                        onClick={() => onAddToCart(product, quantity)}
                        aria-label="Add to Cart"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProductCard;
