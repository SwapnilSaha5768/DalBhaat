import React, { useEffect, useState } from 'react';
import { getProducts, updateProduct, deleteProduct } from '../services/api';
import './EditDeleteProduct.css';

function EditDeleteProduct() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data); // Initialize filteredProducts with all products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleUpdate = async (id, updatedFields) => {
    try {
      await updateProduct(id, updatedFields);
      alert('Product updated successfully');

      // Update the state for both products and filteredProducts
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? { ...product, ...updatedFields } : product
        )
      );

      setFilteredProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? { ...product, ...updatedFields } : product
        )
      );
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      alert('Product deleted successfully');

      // Remove the product from both states
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
      setFilteredProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleInputChange = (id, field, value) => {
    // Update state for both products and filteredProducts
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === id ? { ...product, [field]: value } : product
      )
    );

    setFilteredProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const searchResults = products.filter((product) =>
      product.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProducts(searchResults);
  };

  return (
    <div className="edit-delete-product">
      <div className="header-container">
        <h3 className="product-management-title">Edit or Delete Product</h3>
        <input
          type="text"
          className="search-input"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price (BDT)</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td data-label="Name">{product.name}</td>
              <td data-label="Price (BDT)">
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) =>
                    handleInputChange(product._id, 'price', e.target.value)
                  }
                />
              </td>
              <td data-label="Quantity">
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    handleInputChange(product._id, 'quantity', e.target.value)
                  }
                />
              </td>
              <td data-label="Actions">
                <button
                  className="update-btn"
                  onClick={() =>
                    handleUpdate(product._id, {
                      price: product.price,
                      quantity: product.quantity,
                    })
                  }
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product._id)}
                >
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

export default EditDeleteProduct;
