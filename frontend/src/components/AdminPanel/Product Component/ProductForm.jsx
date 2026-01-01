import React from 'react';
import { addProducts } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be a positive number")),
    quantity: z.preprocess((val) => Number(val), z.number().int().min(0, "Quantity must be a non-negative integer")),
    description: z.string().optional(),
    image: z.string().url("Invalid image URL"),
    category: z.string().min(1, "Category is required")
});

function ProductForm() {
    const { showToast } = useToast();
    const categories = ['Vegetables', 'Fruits', 'Spices', 'Rice', 'Others'];

    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            price: '',
            quantity: '',
            description: '',
            image: '',
            category: 'Others'
        }
    });

    const watchedImage = watch('image');

    const onSubmit = async (data) => {
        try {
            await addProducts(data.name, data.price, data.quantity, data.description, data.image, data.category);
            showToast('Product added successfully', 'success');
            reset();
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

                <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="e.g., Premium Basmati Rice"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-gray-50 focus:bg-white`}
                                    {...register('name')}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="price" className="block mb-2 text-sm font-semibold text-gray-700">Price (BDT)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">৳</span>
                                        <input
                                            type="number"
                                            id="price"
                                            placeholder="0.00"
                                            className={`w-full pl-8 pr-4 py-3 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-gray-50 focus:bg-white`}
                                            {...register('price')}
                                        />
                                    </div>
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="quantity" className="block mb-2 text-sm font-semibold text-gray-700">Stock Quantity</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        placeholder="Available stock"
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.quantity ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-gray-50 focus:bg-white`}
                                        {...register('quantity')}
                                    />
                                    {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    placeholder="Describe the product features and benefits..."
                                    rows="5"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-gray-50 focus:bg-white resize-none`}
                                    {...register('description')}
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                            </div>
                        </div>

                        {/* Right Column - Category & Image */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <label htmlFor="category" className="block mb-2 text-sm font-semibold text-gray-700">Category</label>
                                <select
                                    id="category"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-white cursor-pointer"
                                    {...register('category')}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <label htmlFor="image" className="block mb-2 text-sm font-semibold text-gray-700">Product Image</label>
                                <input
                                    type="text"
                                    id="image"
                                    placeholder="Image URL"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.image ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none bg-white mb-4`}
                                    {...register('image')}
                                />
                                {errors.image && <p className="text-red-500 text-xs mt-1 mb-2">{errors.image.message}</p>}

                                <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-white overflow-hidden relative group">
                                    {watchedImage ? (
                                        <>
                                            <img
                                                src={watchedImage}
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
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductForm;
