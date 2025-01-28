import React, { useState, useEffect } from 'react';
import { getProducts, updateCartItem, updateWishlist } from '../../services/api'; // API services
import './HomePage.css';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

function HomePage({ searchQuery = '' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [sortOption, setSortOption] = useState('name-asc');
  const productsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const filteredProducts = currentProducts
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

  //wishlist
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

  // Add to cart or increase quantity
  const handleAddToCart = async (product) => {
    try {
      console.log('Attempting to add product to cart:', {
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });

      const updatedCart = await updateCartItem(product.name, product.price, product.image, 1);
      console.log('Cart updated successfully:', updatedCart);

      setCart(updatedCart.items);
      //alert(${product.name} added to cart!);
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
              onMouseEnter={() => setHoveredProduct(product.name)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div
                className="product-image"
                style={{ backgroundImage: `url(${product.image})` }}
              ></div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="price">BDT {product.price}</div>
              {product.quantity === 0 ? (
                <div className="out-of-stock">
                  {hoveredProduct === product.name ? (
                    <button
                      className="wishlist-btn"
                      onClick={() => handleAddToWishlist(product.name)}
                    >
                      Add to Wishlist
                    </button>
                  ) : (
                    'Out of Stock'
                  )}
                </div>
              ) : (
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
