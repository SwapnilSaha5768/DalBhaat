import React, { useState } from 'react';
import { addProducts } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

function ProductForm() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('Others');
    const { showToast } = useToast();

    const categories = ['Vegetables', 'Fruits', 'Spices', 'Rice', 'Others'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addProducts(name, price, quantity, description, image, category);
            showToast('Product added successfully', 'success');
            // Reset form
            setName('');
            setPrice('');
            setQuantity('');
            setDescription('');
            setImage('');
            setCategory('Others');
        } catch (error) {
            console.error('Error adding product', error);
            showToast('Failed to add product. Please try again.', 'error');
        }
    };

    return (
        <div className="max-w-5xl mx-auto font-sans">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-2xl font-bold text-gray-900">Add New Product</h3>
                    <p className="text-gray-500 text-sm mt-1">Create a new product listing for your store</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Premium Basmati Rice"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="price" className="block mb-2 text-sm font-semibold text-gray-700">Price (BDT)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">৳</span>
                                        <input
                                            type="number"
                                            id="price"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="0.00"
                                            required
                                            className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="quantity" className="block mb-2 text-sm font-semibold text-gray-700">Stock Quantity</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="Available stock"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the product features and benefits..."
                                    rows="5"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-gray-50 focus:bg-white resize-none"
                                ></textarea>
                            </div>
                        </div>

                        {/* Right Column - Category & Image */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <label htmlFor="category" className="block mb-2 text-sm font-semibold text-gray-700">Category</label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-white cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <label htmlFor="image" className="block mb-2 text-sm font-semibold text-gray-700">Product Image</label>
                                <input
                                    type="text"
                                    id="image"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="Image URL"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-white mb-4"
                                />

                                <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-white overflow-hidden relative group">
                                    {image ? (
                                        <>
                                            <img
                                                src={image}
                                                alt="Preview"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.classList.add('bg-gray-50');
                                                }}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                                                Preview
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-4">
                                            <div className="text-4xl mb-2">🖼️</div>
                                            <p className="text-xs text-gray-500">Image preview will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
                        >
                            Create Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductForm;
