import React, { useState } from 'react';
import './ProductCard.css';

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
        <div className="product-card">
            <div className="product-image-container">
                <div
                    className="product-image"
                    style={{ backgroundImage: `url(${product.image})` }}
                ></div>
                <h3>{product.name}</h3>
                <button className="info-btn" onClick={toggleDescription} aria-label="Show Info">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </button>
                {showDescription && (
                    <div className="product-description-overlay">
                        <p>{product.description}</p>
                        <button className="close-desc-btn" onClick={toggleDescription}>×</button>
                    </div>
                )}
            </div>
            <div className="price">BDT {product.price}</div>

            {product.quantity === 0 ? (
                <div className="out-of-stock-container">
                    <div className="out-of-stock-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                        </svg>
                        <span>No Stock</span>
                    </div>
                    <button
                        className="wishlist-btn-icon"
                        onClick={() => onAddToWishlist(product.name)}
                        aria-label="Add to Wishlist"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="add-to-cart-container">
                    <div className="quantity-selector">
                        <button
                            className="qty-btn"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                        >-</button>
                        <span className="qty-display">{quantity}</span>
                        <button
                            className="qty-btn"
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= product.quantity}
                        >+</button>
                    </div>
                    <button
                        className="add-to-cart-icon-btn"
                        onClick={() => onAddToCart(product, quantity)}
                        aria-label="Add to Cart"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
