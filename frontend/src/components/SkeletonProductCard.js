import React from 'react';
import './SkeletonProductCard.css';

const SkeletonProductCard = () => {
    return (
        <div className="product-card skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-price"></div>
            <div className="skeleton-actions">
                <div className="skeleton-button"></div>
                <div className="skeleton-button"></div>
            </div>
        </div>
    );
};

export default SkeletonProductCard;
