import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const editOrderSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  deliveryOption: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['cash', 'bkash'])
});

function EditOrderModal({ order, onClose, onSave }) {
  // Calculate base amount (excluding delivery charge) to safely recalculate total
  // Standard: 60, Express: 100
  const initialDeliveryCharge = order.deliveryOption === 'express' ? 100 : 60;
  const baseAmount = order.totalAmount - initialDeliveryCharge;

  const [currentTotal, setCurrentTotal] = useState(order.totalAmount);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      name: order.name || '',
      phone: order.phone || '',
      address: order.address || '',
      deliveryOption: order.deliveryOption || 'standard',
      paymentMethod: order.paymentMethod || 'cash'
    }
  });

  const watchedDeliveryOption = watch('deliveryOption');

  useEffect(() => {
    const newDeliveryCharge = watchedDeliveryOption === 'express' ? 100 : 60;
    setCurrentTotal(baseAmount + newDeliveryCharge);
  }, [watchedDeliveryOption, baseAmount]);

  const onSubmit = (data) => {
    onSave({
      ...order,
      ...data,
      totalAmount: currentTotal
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Order</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              type="text"
              id="name"
              className={`w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
              {...register('name')}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              id="phone"
              className={`w-full px-3 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
              {...register('phone')}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              id="address"
              rows="3"
              className={`w-full px-3 py-2 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none`}
              {...register('address')}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="deliveryOption" className="block text-sm font-medium text-gray-700 mb-1">Delivery Option</label>
              <select
                id="deliveryOption"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                {...register('deliveryOption')}
              >
                <option value="standard">Standard</option>
                <option value="express">Express</option>
              </select>
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                id="paymentMethod"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                {...register('paymentMethod')}
              >
                <option value="cash">Cash on Delivery</option>
                <option value="bkash">bKash</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-200">
            <span className="text-gray-600 font-medium">Total Amount:</span>
            <span className="text-lg font-bold text-indigo-600">BDT {currentTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditOrderModal;