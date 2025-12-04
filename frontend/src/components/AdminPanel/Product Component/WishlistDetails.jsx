import React, { useEffect, useState } from 'react';
import { getWishlist, deleteWishlistItem } from '../../../services/api';

function WishlistDetails() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const wishlistData = await getWishlist();
                setWishlist(wishlistData);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleDelete = async (productName) => {
        if (!window.confirm(`Are you sure you want to delete '${productName}' from the wishlist?`)) {
            return;
        }

        try {
            await deleteWishlistItem(productName);
            setWishlist((prevWishlist) => prevWishlist.filter((item) => item.name !== productName));
            // Optional: Use a toast notification instead of alert
            // alert(`Wishlist item '${productName}' deleted successfully.`);
        } catch (error) {
            console.error('Error deleting wishlist item:', error);
            alert('Failed to delete the wishlist item.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No items in the wishlist.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Wishlist Details</h3>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th className="p-3 text-left font-semibold rounded-tl-lg">Product Name</th>
                            <th className="p-3 text-left font-semibold">Click Count</th>
                            <th className="p-3 text-left font-semibold rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {wishlist.map((item, index) => (
                            <tr
                                key={item.name}
                                className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                            >
                                <td className="p-3 text-gray-700 border-x border-gray-100">{item.name}</td>
                                <td className="p-3 text-gray-700 border-x border-gray-100">{item.clickCount}</td>
                                <td className="p-3 border-x border-gray-100">
                                    <button
                                        className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors shadow-sm"
                                        onClick={() => handleDelete(item.name)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WishlistDetails;
