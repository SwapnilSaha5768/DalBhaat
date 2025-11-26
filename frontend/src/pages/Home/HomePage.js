import React, { useState, useEffect } from 'react';
import { getProducts, updateCartItem, updateWishlist } from '../../services/api'; // API services
import ProductCard from '../../components/ProductCard';
import SkeletonProductCard from '../../components/SkeletonProductCard';
import './HomePage.css';

function HomePage({ searchQuery = '' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('name-asc');
  // const [quantities, setQuantities] = useState({}); // Moved to ProductCard
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

  // Filter and sort with safety checks
  const filteredProducts = (products || [])
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

  // Pagination logic with defensive fallback
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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
      alert(`${product.name} (x${quantity}) added to cart!`);
      // setQuantities({ ...quantities, [product.name]: 1 }); // Handled locally in ProductCard
    } catch (error) {
      console.error('Error adding product to cart:', error);
      if (error.response) {
        console.error('Server Response:', error.response.data);
      }
      alert('Failed to add product to cart.');
    }
  };

  if (loading) {
    return (
      <div className="homepage">
        <h1>Our Products</h1>
        <div className="product-list">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </div>
      </div>
    );
  }

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
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil((filteredProducts?.length || 0) / productsPerPage) }, (_, index) => (
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
