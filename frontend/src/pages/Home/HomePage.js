import React, { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import SkeletonProductCard from "../../components/SkeletonProductCard";
import { getProducts, updateCartItem, updateWishlist } from "../../services/api"; // Use centralized API
import "./HomePage.css";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState(""); // price-asc, price-desc, name-asc

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const categories = ["All", "Vegetables", "Fruits", "Spices", "Rice", "Others"];

  // Fetch data from backend
  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // Apply Category + Sorting Filtering
  useEffect(() => {
    let updated = [...products];

    // Category filter
    if (selectedCategory !== "All") {
      updated = updated.filter((item) => item.category === selectedCategory);
    }

    // Sorting options
    if (sortOption === "price-asc") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      updated.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name-asc") {
      updated.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(updated);
    setCurrentPage(1);
  }, [selectedCategory, sortOption, products]);

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handlers (restored from previous version)
  const handleAddToCart = async (product, quantity = 1) => {
    try {
      await updateCartItem(product.name, product.price, product.image, quantity);
      alert(`${product.name} (x${quantity}) added to cart!`);
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart.');
    }
  };

  const handleAddToWishlist = async (productName) => {
    try {
      await updateWishlist(productName);
      alert(`${productName} added to wishlist!`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist.');
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

      {/* FILTER BAR */}
      <div className="filter-bar">

        {/* CATEGORY FILTER (DROPDOWN) */}
        <div className="category-dropdown-container">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="category-dropdown"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* SORT BUTTON */}
        <div className="sort-container">
          <button
            className={`sort-btn ${sortOption.startsWith("price") ? "active" : ""}`}
            onClick={() => {
              if (sortOption === "price-asc") setSortOption("price-desc");
              else if (sortOption === "price-desc") setSortOption("name-asc");
              else setSortOption("price-asc");
            }}
          >
            Price
            <span className="sort-icon">
              {sortOption === "price-asc" ? "▲" :
                sortOption === "price-desc" ? "▼" :
                  "⇅"}
            </span>
          </button>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="product-list">
        {currentItems.length === 0 ? (
          <p>No products found.</p>
        ) : (
          currentItems.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
