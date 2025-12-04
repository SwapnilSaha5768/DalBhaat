import React from 'react';

const SkeletonProductCard = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse flex flex-col h-full">
            {/* Image Skeleton */}
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>

            {/* Title Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>

            {/* Price Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>

            {/* Actions Skeleton */}
            <div className="flex justify-between items-center mt-auto pt-2">
                <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    );
};

export default SkeletonProductCard;
