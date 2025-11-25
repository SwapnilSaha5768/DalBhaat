import React, { useEffect, useState } from 'react';
import { getWishlist, deleteWishlistItem } from '../services/api';
import './WishlistDetails.css';

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
      alert(`Wishlist item '${productName}' deleted successfully.`);
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      alert('Failed to delete the wishlist item.');
    }
  };

  if (loading) return <p>Loading wishlist...</p>;

  if (wishlist.length === 0) return <p>No items in the wishlist.</p>;

  return (
    <div className="wishlist-details">
      <h3>Wishlist Details</h3>
      <table className="wishlist-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Click Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {wishlist.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>{item.clickCount}</td>
              <td>
                <button className="view-btn" onClick={() => handleDelete(item.name)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WishlistDetails;
