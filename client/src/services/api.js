import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// Attach JWT token to each request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// Restaurants
export const getRestaurants = () => api.get('/restaurants');
export const getRestaurantById = (id) => api.get(`/restaurants/${id}`);
export const createRestaurant = (data) => api.post('/restaurants', data);
export const updateRestaurant = (id, data) => api.put(`/restaurants/${id}`, data);
export const deleteRestaurant = (id) => api.delete(`/restaurants/${id}`);

// Foods
export const getFoodsByRestaurant = (restaurantId) => api.get(`/foods/${restaurantId}`);
export const getAllFoods = () => api.get('/foods');
export const createFoodItem = (restaurantId, data) => api.post(`/foods/${restaurantId}`, data);
export const updateFoodItem = (id, data) => api.put(`/foods/${id}`, data);
export const deleteFoodItem = (id) => api.delete(`/foods/${id}`);

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart/add', data);
export const removeFromCart = (foodId) => api.delete(`/cart/remove/${foodId}`);
export const clearCart = () => api.delete('/cart/clear');

// Orders
export const placeOrder = (data) => api.post('/orders', data);
export const getUserOrders = () => api.get('/orders/user');
export const getAllOrders = () => api.get('/orders/admin');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });

export default api;
