import React, { useState, useEffect } from 'react';
import { getProducts, updateCartItem, updateWishlist } from '../../services/api'; // API services
import './HomePage.css';

function HomePage({ searchQuery = '' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('name-asc');
  const [quantities, setQuantities] = useState({});
  const productsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productsData = await getProducts();
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          console.warn('Products data is not an array:', productsData);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Pagination logic with defensive fallback
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = (products || []).slice(indexOfFirstProduct, indexOfLastProduct);

  // Filter and sort with safety checks
  const filteredProducts = (currentProducts || [])
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
      if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      return 0;
    });

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Wishlist handler
  const handleAddToWishlist = async (productName) => {
    if (!productName) {
      alert('Product name is missing.');
      return;
    }

    try {
      console.log(`Adding product to wishlist: ${productName}`);
      await updateWishlist(productName);
      alert(`${productName} added to wishlist!`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist.');
    }
  };

  // Add to cart handler
  const handleAddToCart = async (product, quantity = 1) => {
    try {
      console.log('Attempting to add product to cart:', {
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });

      const updatedCart = await updateCartItem(product.name, product.price, product.image, quantity);
      console.log('Cart updated successfully:', updatedCart);

      alert(`${product.name} (x${quantity}) added to cart!`);
      // Reset quantity to 1 after adding
      setQuantities({ ...quantities, [product.name]: 1 });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      if (error.response) {
        console.error('Server Response:', error.response.data);
      }
      alert('Failed to add product to cart.');
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="homepage">
      <h1>Our Products</h1>

      <div className="sort-container">
        <label htmlFor="sort">Sort by:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-dropdown"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.name}
              className="product-card"

            >
              <div
                className="product-image"
                style={{ backgroundImage: `url(${product.image})` }}
              ></div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="price">BDT {product.price}</div>
              {product.quantity === 0 ? (
                <div className="out-of-stock-container">
                  <div className="out-of-stock-badge">Out of Stock</div>
                  <button
                    className="wishlist-btn-visible"
                    onClick={() => handleAddToWishlist(product.name)}
                  >
                    Add to Wishlist
                  </button>
                </div>
              ) : (
                <div className="add-to-cart-container">
                  <div className="quantity-selector">
                    <button
                      className="qty-btn"
                      onClick={() => {
                        const currentQty = quantities[product.name] || 1;
                        if (currentQty > 1) {
                          setQuantities({ ...quantities, [product.name]: currentQty - 1 });
                        }
                      }}
                    >-</button>
                    <span className="qty-display">{quantities[product.name] || 1}</span>
                    <button
                      className="qty-btn"
                      onClick={() => {
                        const currentQty = quantities[product.name] || 1;
                        if (currentQty < product.quantity) {
                          setQuantities({ ...quantities, [product.name]: currentQty + 1 });
                        }
                      }}
                    >+</button>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product, quantities[product.name] || 1)}
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil((products?.length || 0) / productsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
