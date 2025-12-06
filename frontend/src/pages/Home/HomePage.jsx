import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import SkeletonProductCard from "./SkeletonProductCard";
import { getProducts, updateCartItem, updateWishlist, getCartItems } from "../../services/api";

function HomePage({ searchQuery }) {
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

    // Apply Category + Sorting + Search Filtering
    useEffect(() => {
        let updated = [...products];

        // Search filter
        if (searchQuery) {
            updated = updated.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

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
    }, [selectedCategory, sortOption, products, searchQuery]);

    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Handlers
    const handleAddToCart = async (product, quantity = 1) => {
        try {
            const cartItems = await getCartItems();
            const existingItem = cartItems.find(item => item.name === product.name);

            let newQuantity = quantity;
            if (existingItem) {
                newQuantity = existingItem.quantity + quantity;
            }

            await updateCartItem(product.name, product.price, product.image, newQuantity);
            // Optional: Add toast notification here
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
            <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Products</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <SkeletonProductCard key={index} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-4 pb-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Products</h1>

                {/* FILTER BAR */}
                <div className="flex flex-row items-center justify-between gap-4 p-4 mb-8 bg-white/80 backdrop-blur-md rounded-xl shadow-sm sticky top-20 z-40 border border-gray-100 transition-all duration-300">

                    {/* CATEGORY FILTER */}
                    <div className="relative flex-1 sm:flex-none sm:w-64">
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer font-medium"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>

                    {/* SORT BUTTON */}
                    <button
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${sortOption.startsWith("price")
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                            }`}
                        onClick={() => {
                            if (sortOption === "price-asc") setSortOption("price-desc");
                            else if (sortOption === "price-desc") setSortOption("name-asc");
                            else setSortOption("price-asc");
                        }}
                    >
                        <span>Price</span>
                        <span className="text-xs">
                            {sortOption === "price-asc" ? "▲" : sortOption === "price-desc" ? "▼" : "⇅"}
                        </span>
                    </button>
                </div>

                {/* PRODUCT GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentItems.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-xl text-gray-500">No products found.</p>
                        </div>
                    ) : (
                        currentItems.map((product) => (
                            <div key={product._id} className="transform transition-all duration-300 hover:-translate-y-1">
                                <ProductCard
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                    onAddToWishlist={handleAddToWishlist}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${currentPage === i + 1
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                    }`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;
