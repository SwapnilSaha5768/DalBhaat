import React, { useEffect, useState } from 'react';
import { getProducts, updateProduct, deleteProduct } from '../../../services/api';

function EditDeleteProduct() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
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
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      alert('Product deleted successfully');

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold text-gray-800">Manage Products</h3>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden p-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="font-medium text-gray-900">{product.name}</div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {product.category || 'Others'}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={product.category || 'Others'}
                  onChange={(e) =>
                    handleInputChange(product._id, 'category', e.target.value)
                  }
                  className="block w-full py-1.5 px-3 border border-gray-200 bg-white rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {['Vegetables', 'Fruits', 'Spices', 'Rice', 'Others'].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price (BDT)</label>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      handleInputChange(product._id, 'price', e.target.value)
                    }
                    className="block w-full py-1.5 px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      handleInputChange(product._id, 'quantity', e.target.value)
                    }
                    className="block w-full py-1.5 px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end border-t border-gray-100 pt-3">
              <button
                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium hover:bg-indigo-100 transition-colors flex-1"
                onClick={() =>
                  handleUpdate(product._id, {
                    price: product.price,
                    quantity: product.quantity,
                    category: product.category,
                  })
                }
              >
                Update
              </button>
              <button
                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 transition-colors flex-1"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-8">
            No products found matching your search.
          </div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price (BDT)</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4">
                  <select
                    value={product.category || 'Others'}
                    onChange={(e) =>
                      handleInputChange(product._id, 'category', e.target.value)
                    }
                    className="block w-full py-1.5 px-3 border border-gray-200 bg-white rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {['Vegetables', 'Fruits', 'Spices', 'Rice', 'Others'].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      handleInputChange(product._id, 'price', e.target.value)
                    }
                    className="block w-24 py-1.5 px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      handleInputChange(product._id, 'quantity', e.target.value)
                    }
                    className="block w-24 py-1.5 px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium hover:bg-indigo-100 transition-colors"
                    onClick={() =>
                      handleUpdate(product._id, {
                        price: product.price,
                        quantity: product.quantity,
                        category: product.category,
                      })
                    }
                  >
                    Update
                  </button>
                  <button
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 transition-colors"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">
                  No products found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EditDeleteProduct;
