import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : `http://${window.location.hostname}:5000/api`;

export const getProducts = async (name, price, quantity, description, image) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, { name, price, quantity, description, image });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

export const addProducts = async (name, price, quantity, description, image, category) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, { name, price, quantity, description, image, category });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};


export const updateProduct = async (id, updatedFields) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/products/${id}`, updatedFields);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error.response?.data || error.message);
    throw new Error('Failed to update product');
  }
};

export const getProductStock = async (productName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/stock`, {
      params: { name: productName },
    });

    return response.data.quantity; // Ensure quantity is returned
  } catch (error) {
    console.error('Error fetching product stock:', error);
    throw error;
  }
};

export const reduceStock = async (orderItems) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products/reduce-quantity`, { orderItems });
    return response.data;
  } catch (error) {
    console.error('Error reducing stock:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error in login API:', error.response?.data || error.message);
    throw error;
  }
};


export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error.response?.data || error.message);
    throw new Error('Failed to delete product');
  }
};


export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
  }
};


export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};


export const updateUser = async (id, updatedFields) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, updatedFields);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.response?.data || error.message);
    throw new Error('Failed to update user');
  }
};



export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error.response?.data || error.message);
    throw new Error('Failed to delete user');
  }
};


export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/all`);
    return response.data;
  } catch (err) {
    console.error('Error fetching orders:', err);
    throw err;
  }
};




export const updateCartItem = async (name, price, image, quantity) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not logged in');
    }
    const response = await axios.put(`${API_BASE_URL}/cart`, { userId, name, price, image, quantity });

    // Dispatch event to notify listeners (e.g., Header)
    window.dispatchEvent(new Event('cartUpdated'));

    return response.data.cart;
  } catch (error) {
    console.error('Error updating cart item:', error.response?.data || error.message);
    throw error;
  }
};

// Get all cart items
export const getCartItems = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return [];
    }
    const response = await axios.get(`${API_BASE_URL}/cart`, { params: { userId } });
    return response.data.items;
  } catch (err) {
    console.error('Error fetching cart items:', err);
    throw err;
  }
};

// Remove an item from the cart
export const removeCartItem = async (name) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not logged in');
    }
    await axios.delete(`${API_BASE_URL}/cart/${encodeURIComponent(name)}`, { data: { userId } });

    // Dispatch event to notify listeners
    window.dispatchEvent(new Event('cartUpdated'));

  } catch (err) {
    console.error('Error removing cart item:', err);
    throw err;
  }
};


export const updateWishlist = async (productName) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.warn("User not logged in, cannot update wishlist");
      return;
    }
    const response = await axios.post(`${API_BASE_URL}/wishlist`, {
      userId,
      name: productName,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating wishlist:', error);
    throw error;
  }
};

export const getWishlist = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) return [];

    const response = await axios.get(`${API_BASE_URL}/wishlist`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

export const deleteWishlistItem = async (productName) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not logged in');
    }
    // Axios delete accepts data in the 'data' property of the config object
    const response = await axios.delete(`${API_BASE_URL}/wishlist/${encodeURIComponent(productName)}`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    throw error;
  }
};

export const getAdminUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/admins`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
};


// Place an order
export const placeOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders/create`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

// Clear cart (this depends on how your cart is stored; for now, we'll clear localStorage)
export const clearCart = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (userId) {
      await axios.delete(`${API_BASE_URL}/cart`, { data: { userId } });
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

// Get all orders
export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');


    const response = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error('getUserOrders - Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error;
  }
};


export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};


export const updateOrderDetails = async (orderId, updatedOrder) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/edit`, updatedOrder);
    return response.data;
  } catch (error) {
    console.error('Error updating order details:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders/cancel/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

export const completeOrder = async (orderId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders/complete/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error completing order:', error);
    throw error;
  }
};

export const getTotalIncome = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/income/total`);
    return response.data;
  } catch (error) {
    console.error('Error fetching total income:', error);
    throw error;
  }
};


export const validateCoupon = async (code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/coupons/validate`, { code });
    return response.data; // { discount: <amount> }
  } catch (error) {
    console.error('Error validating coupon:', error.response?.data || error.message);
    throw error;
  }
};

export const getCoupons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coupons`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

export const createCoupon = async (couponData) => {
  const response = await axios.post(`${API_BASE_URL}/coupons/create`, couponData);
  return response.data;
};

export const updateCoupon = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/coupons/${id}`, updatedData);
    return response.data; // Return the updated coupon
  } catch (error) {
    console.error('Error updating coupon:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteCoupon = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/coupons/${id}`);
  return response.data;
};

export const reduceCouponUsage = async (couponCode) => {
  try {
    const response = await axios.post('/api/coupons/reduce-usage', { couponCode });
    return response.data;
  } catch (error) {
    console.error('Error reducing coupon usage:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const response = await axios.put(`${API_BASE_URL}/users/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
