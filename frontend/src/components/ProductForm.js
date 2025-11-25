import React, { useState } from 'react';
import { addProducts } from '../services/api';
import './ProductForm.css';




function ProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    await addProducts(name, price, quantity, description, image);
      alert('Product added successfully');
    } catch (error) {
      console.error('Error adding product', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h3>Add Product</h3>
      <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" required />
      <input type="number" name="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
      <input type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" required />
      <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
      <input type="text" name="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" required />
      <button type="submit">Add Product</button>
      </form>
  );
}

export default ProductForm;