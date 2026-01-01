import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { placeOrder, reduceStock, validateCoupon, clearCart, getUserProfile } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import './CheckoutPage.css';

const checkoutSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Delivery address is required"),
  paymentMethod: z.enum(['cash', 'bkash']),
  transactionId: z.string().optional(),
  deliveryOption: z.enum(['standard', 'express'])
}).superRefine((data, ctx) => {
  if (data.paymentMethod === 'bkash' && (!data.transactionId || data.transactionId.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Transaction ID is required for bKash",
      path: ["transactionId"]
    });
  }
});

function CheckoutPage() {
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // UI State
  const [cartItems, setCartItems] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(60);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState('new');
  const [userName, setUserName] = useState(''); // Name is read-only

  // Coupon State
  const [couponCode, setCouponCode] = useState('');

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      phone: '',
      address: '',
      paymentMethod: 'cash',
      transactionId: '',
      deliveryOption: 'standard'
    }
  });

  const watchedPaymentMethod = watch('paymentMethod');
  const watchedDeliveryOption = watch('deliveryOption');

  const calculateTotal = React.useCallback((items, charge, disc) => {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + charge - disc;
    setFinalTotal(totalAmount);
  }, []);

  // Watch delivery option changes to update total
  useEffect(() => {
    const charge = watchedDeliveryOption === 'express' ? 100 : 60;
    setDeliveryCharge(charge);
    if (cartItems.length > 0) {
      calculateTotal(cartItems, charge, discount);
    }
  }, [watchedDeliveryOption, cartItems, discount, calculateTotal]);

  useEffect(() => {
    if (location.state && location.state.cartItems) {
      setCartItems(location.state.cartItems);
      // Initial calculation
      calculateTotal(location.state.cartItems, 60, 0);
    } else {
      console.error('No cart items found! Redirecting to cart...');
      navigate('/cart');
    }

    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userProfile = await getUserProfile();
          setUserName(userProfile.name || '');
          setValue('phone', userProfile.phone || '');

          if (userProfile.addresses && userProfile.addresses.length > 0) {
            setSavedAddresses(userProfile.addresses);
            const defaultIndex = userProfile.addresses.findIndex(addr => addr.isDefault);
            if (defaultIndex !== -1) {
              handleAddressSelect(defaultIndex, userProfile.addresses);
            } else {
              handleAddressSelect(0, userProfile.addresses);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, navigate, setValue]); // calculateTotal is stable (useCallback) but handleAddressSelect is defined below

  const handleAddressSelect = (index, addresses = savedAddresses) => {
    setSelectedAddressIndex(index);
    if (index === 'new') {
      setValue('address', '');
    } else {
      const addr = addresses[index];
      const formattedAddress = `${addr.street}, ${addr.city}, ${addr.zip}`;
      setValue('address', formattedAddress);
    }
  };

  // Wrapper for select onChange because of the "new" vs index logic
  const onAddressSelectChange = (e) => {
    const val = e.target.value;
    handleAddressSelect(val === 'new' ? 'new' : parseInt(val));
  };


  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showToast('Please enter a valid coupon code', 'error');
      return;
    }

    try {
      const response = await validateCoupon(couponCode);
      setDiscount(response.discount);
      calculateTotal(cartItems, deliveryCharge, response.discount);
      showToast(`Coupon applied! Discount: BDT ${response.discount}`, 'success');
    } catch (error) {
      console.error('Error validating coupon:', error);
      showToast('Invalid coupon code', 'error');
    }
  };

  const onSubmit = async (data) => {
    if (!userName) {
      showToast('User information missing', 'error');
      return;
    }

    const orderData = {
      name: userName,
      phone: data.phone,
      address: data.address,
      deliveryOption: data.deliveryOption,
      paymentMethod: data.paymentMethod,
      transactionId: data.paymentMethod === 'bkash' ? data.transactionId : null,
      orderSummary: cartItems.map((item) => ({
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: finalTotal,
      userId: localStorage.getItem('userId'),
    };

    try {
      const response = await placeOrder(orderData);
      await reduceStock(orderData.orderSummary);
      await clearCart();
      showToast(response.message, 'success');
      navigate('/order-confirmation', {
        state: {
          orderDetails: {
            ...orderData,
            orderId: response.orderId,
          },
        },
      });
    } catch (error) {
      console.error('Error placing order:', error);
      showToast('Failed to place the order. Please try again.', 'error');
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-right">
        <h2>Order Summary</h2>
        <div className="order-summary-scroll">
          {cartItems.map((item) => (
            <div key={item.name} className="order-item">
              <img src={item.image} alt={item.name} className="order-item-image" />
              <div className="order-item-details">
                <h4>{item.name}</h4>
                <p>Price: BDT {item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Subtotal: BDT {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="coupon-container">
          <input
            type="text"
            placeholder="Enter Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button onClick={handleApplyCoupon}>Apply Coupon</button>
        </div>
        <p><strong>Discount:</strong> BDT {discount}</p>
        <p><strong>Total Amount:</strong> BDT {finalTotal.toFixed(2)}</p>
      </div>

      <div className="checkout-left">
        <h2>Billing Information</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Name</label>
            <div className="read-only-field">{userName || 'Loading...'}</div>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              placeholder="Enter your phone number"
              {...register('phone')}
            />
            {errors.phone && <p className="error-text">{errors.phone.message}</p>}
          </div>

          {savedAddresses.length > 0 && (
            <div className="form-group">
              <label>Select Address</label>
              <select
                value={selectedAddressIndex}
                onChange={onAddressSelectChange}
                className="address-select"
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                {savedAddresses.map((addr, index) => (
                  <option key={index} value={index}>
                    {addr.street}, {addr.city} {addr.isDefault ? '(Default)' : ''}
                  </option>
                ))}
                <option value="new">+ Use a new address</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="address">Billing Address</label>
            <textarea
              id="address"
              placeholder="Enter your delivery address"
              rows="3"
              {...register('address')}
            />
            {errors.address && <p className="error-text">{errors.address.message}</p>}
          </div>

          <h2>Delivery Options</h2>
          <div className="delivery-options">
            <Controller
              name="deliveryOption"
              control={control}
              render={({ field }) => (
                <>
                  <button
                    type="button"
                    className={`delivery-option-btn ${field.value === 'standard' ? 'active' : ''}`}
                    onClick={() => field.onChange('standard')}
                  >
                    Standard Delivery (+60 BDT)
                  </button>
                  <button
                    type="button"
                    className={`delivery-option-btn ${field.value === 'express' ? 'active' : ''}`}
                    onClick={() => field.onChange('express')}
                  >
                    Express Delivery (+100 BDT)
                  </button>
                </>
              )}
            />
          </div>

          <h2>Payment Method</h2>
          <div className="payment-options">
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <>
                  <button
                    type="button"
                    className={`payment-option-btn ${field.value === 'cash' ? 'active' : ''}`}
                    onClick={() => field.onChange('cash')}
                  >
                    Cash on Delivery
                  </button>
                  <button
                    type="button"
                    className={`payment-option-btn ${field.value === 'bkash' ? 'active' : ''}`}
                    onClick={() => field.onChange('bkash')}
                  >
                    bKash
                  </button>
                </>
              )}
            />
          </div>

          {watchedPaymentMethod === 'bkash' && (
            <div className="form-group">
              <label htmlFor="transactionId">Bkash Transaction ID</label>
              <input
                type="text"
                id="transactionId"
                placeholder="Enter Transaction ID"
                {...register('transactionId')}
              />
              {errors.transactionId && <p className="error-text">{errors.transactionId.message}</p>}
            </div>
          )}

          <button className="place-order-btn" type="submit">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
