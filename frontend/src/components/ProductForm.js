import React, { useState } from 'react';
import { addProducts } from '../services/api';
import './ProductForm.css';




function ProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Others');

  const categories = ['Vegetables', 'Fruits', 'Spices', 'Rice', 'Others'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProducts(name, price, quantity, description, image, category);
      alert('Product added successfully');
      // Reset form
      setName('');
      setPrice('');
      setQuantity('');
      setDescription('');
      setImage('');
      setCategory('Others');
    } catch (error) {
      console.error('Error adding product', error);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-header">
          <h3>Add New Product</h3>
          <p>Enter the details to create a new product listing</p>
        </div>

        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Premium Basmati Rice"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price (BDT)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Available stock"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the product..."
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        {image && (
          <div className="image-preview">
            <p>Preview:</p>
            <img src={image} alt="Preview" onError={(e) => (e.target.style.display = 'none')} />
          </div>
        )}

        <button type="submit" className="submit-btn">
          Add Product
        </button>
      </form>
    
  );
}

export default ProductForm;