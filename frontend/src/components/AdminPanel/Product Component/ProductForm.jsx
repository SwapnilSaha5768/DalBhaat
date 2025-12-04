import React, { useState } from 'react';
import { addProducts } from '../../../services/api';

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
        <div className="max-w-3xl mx-auto my-10 px-5 font-sans">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h3>
                    <p className="text-gray-500 text-sm">Enter the details to create a new product listing</p>
                </div>

                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 font-semibold text-gray-700 text-sm">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Premium Basmati Rice"
                        required
                        className="w-full p-3 border border-gray-200 rounded-lg text-base text-gray-800 bg-gray-50 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                        <label htmlFor="price" className="block mb-2 font-semibold text-gray-700 text-sm">Price (BDT)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg text-base text-gray-800 bg-gray-50 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                        />
                    </div>

                    <div>
                        <label htmlFor="quantity" className="block mb-2 font-semibold text-gray-700 text-sm">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Available stock"
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg text-base text-gray-800 bg-gray-50 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                        />
                    </div>
                </div>

                <div className="mb-5">
                    <label htmlFor="category" className="block mb-2 font-semibold text-gray-700 text-sm">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg text-base text-gray-800 bg-gray-50 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-5">
                    <label htmlFor="description" className="block mb-2 font-semibold text-gray-700 text-sm">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the product..."
                        rows="4"
                        className="w-full p-3 border border-gray-200 rounded-lg text-base text-gray-800 bg-gray-50 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 resize-y min-h-[100px]"
                    ></textarea>
                </div>

                <div className="mb-5">
                    <label htmlFor="image" className="block mb-2 font-semibold text-gray-700 text-sm">Image URL</label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        required
                        className="w-full p-3 border border-gray-200 rounded-lg text-base text-gray-800 bg-gray-50 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                    />
                </div>

                {image && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center border border-dashed border-gray-200">
                        <p className="mb-2 text-gray-500 text-sm">Preview:</p>
                        <img
                            src={image}
                            alt="Preview"
                            onError={(e) => (e.target.style.display = 'none')}
                            className="max-w-full max-h-[200px] rounded-lg shadow-sm inline-block"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full p-3.5 mt-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/30 active:translate-y-0"
                >
                    Add Product
                </button>
            </form>
        </div>
    );
}

export default ProductForm;
