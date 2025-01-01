import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getProducts = async (name, price, quantity, description, image) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, { name, price, quantity, description, image });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

export const addProducts = async (name, price, quantity, description, image) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, { name, price, quantity, description, image });
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
    console.log('Stock fetched:', response.data.quantity); // Debugging line
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
    const response = await axios.post('http://localhost:5000/api/users/login', {
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
    const response = await axios.get(`${API_BASE_URL}/orders`);
    return response.data;
  } catch (err) {
    console.error('Error fetching orders:', err);
    throw err;
  }
};




export const updateCartItem = async (name, price, image, quantity) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/cart`, { name, price, image, quantity });
    return response.data.cart;
  } catch (error) {
    console.error('Error updating cart item:', error.response?.data || error.message);
    throw error;
  }
};


// Get all cart items
export const getCartItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart`);
    return response.data.items;
  } catch (err) {
    console.error('Error fetching cart items:', err);
    throw err;
  }
};

// Remove an item from the cart
export const removeCartItem = async (name) => {
  try {
    await axios.delete(`${API_BASE_URL}/cart/${encodeURIComponent(name)}`);
  } catch (err) {
    console.error('Error removing cart item:', err);
    throw err;
  }
};


export const updateWishlist = async (productName) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/wishlist`, {
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
    const response = await axios.get(`${API_BASE_URL}/wishlist`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

export const deleteWishlistItem = async (productName) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/wishlist/${productName}`);
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
export const clearCart = () => {
  localStorage.removeItem('cart'); // Adjust if you're using a different storage method
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
  const response = await axios.get(`${API_BASE_URL}/coupons`);
  return response.data;
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

