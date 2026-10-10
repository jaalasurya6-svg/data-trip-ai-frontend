import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token if present in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('daytrip_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified response handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';

    if (error.response?.data?.data && typeof error.response.data.data === 'object') {
      const fieldDetails = Object.entries(error.response.data.data)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join('; ');
      if (fieldDetails) {
        errorMsg += `: ${fieldDetails}`;
      }
    }
    return Promise.reject(new Error(errorMsg));
  }
);

export const checkHealth = async () => {
  return await apiClient.get('/health');
};

export const checkDbStatus = async () => {
  return await apiClient.get('/health/db-status');
};

// Destination Discovery APIs
export const getDestinations = async (params = {}) => {
  return await apiClient.get('/destinations', { params });
};

export const getDestinationById = async (id) => {
  return await apiClient.get(`/destinations/${id}`);
};

export const getPopularDestinations = async (limit = 6) => {
  return await apiClient.get('/destinations/popular', { params: { limit } });
};

export const getCities = async () => {
  return await apiClient.get('/destinations/cities');
};

export const getCategories = async () => {
  return await apiClient.get('/destinations/categories');
};

export const createDestination = async (payload) => {
  return await apiClient.post('/destinations', payload);
};

export const updateDestination = async (id, payload) => {
  return await apiClient.put(`/destinations/${id}`, payload);
};

export const deleteDestination = async (id) => {
  return await apiClient.delete(`/destinations/${id}`);
};

// Trip Planning APIs
export const getTrips = async (params = {}) => {
  return await apiClient.get('/trips', { params });
};

export const getUserTrips = getTrips;

export const getTripById = async (id) => {
  return await apiClient.get(`/trips/${id}`);
};

export const createTrip = async (payload) => {
  return await apiClient.post('/trips', payload);
};

export const updateTrip = async (id, payload) => {
  return await apiClient.put(`/trips/${id}`, payload);
};

export const updateTripStatus = async (id, status) => {
  return await apiClient.patch(`/trips/${id}/status`, { status });
};

export const deleteTrip = async (id) => {
  return await apiClient.delete(`/trips/${id}`);
};

export const getTripSummary = async (id) => {
  return await apiClient.get(`/trips/${id}/summary`);
};

// Itinerary APIs
export const getItinerary = async (tripId) => {
  return await apiClient.get(`/trips/${tripId}/itinerary`);
};

export const generateItinerary = async (tripId) => {
  return await apiClient.post(`/trips/${tripId}/itinerary/generate`);
};

export const addItineraryItem = async (tripId, payload) => {
  return await apiClient.post(`/trips/${tripId}/itinerary/items`, payload);
};

export const reorderItineraryItems = async (tripId, orderedItemIds) => {
  return await apiClient.put(`/trips/${tripId}/itinerary/reorder`, { orderedItemIds });
};

export const deleteItineraryItem = async (tripId, itemId) => {
  return await apiClient.delete(`/trips/${tripId}/itinerary/items/${itemId}`);
};

// Expense Tracker APIs
export const getTripExpenses = async (tripId) => {
  return await apiClient.get(`/trips/${tripId}/expenses`);
};

export const createTripExpense = async (tripId, payload) => {
  return await apiClient.post(`/trips/${tripId}/expenses`, payload);
};

export const updateTripExpense = async (tripId, expenseId, payload) => {
  return await apiClient.put(`/trips/${tripId}/expenses/${expenseId}`, payload);
};

export const deleteTripExpense = async (tripId, expenseId) => {
  return await apiClient.delete(`/trips/${tripId}/expenses/${expenseId}`);
};

export const getTripExpenseAnalytics = async (tripId) => {
  return await apiClient.get(`/trips/${tripId}/expenses/analytics`);
};

// User Favorites APIs
export const getFavorites = async () => {
  return await apiClient.get('/favorites');
};

export const getUserFavorites = getFavorites;

export const addFavorite = async (destinationId) => {
  return await apiClient.post(`/favorites/${destinationId}`);
};

export const removeFavorite = async (destinationId) => {
  return await apiClient.delete(`/favorites/${destinationId}`);
};

export const checkFavoriteStatus = async (destinationId) => {
  return await apiClient.get(`/favorites/${destinationId}/status`);
};

export const toggleFavorite = async (destinationId) => {
  try {
    const statusRes = await checkFavoriteStatus(destinationId);
    const isFav = statusRes.data?.isFavorite;
    if (isFav) {
      await removeFavorite(destinationId);
      return { data: { isFavorite: false } };
    } else {
      await addFavorite(destinationId);
      return { data: { isFavorite: true } };
    }
  } catch (err) {
    // If status check fails, fallback to addFavorite
    await addFavorite(destinationId);
    return { data: { isFavorite: true } };
  }
};

// Reviews & Ratings APIs
export const getDestinationReviews = async (destinationId, params = {}) => {
  return await apiClient.get(`/destinations/${destinationId}/reviews`, { params });
};

export const createDestinationReview = async (destinationId, payload) => {
  return await apiClient.post(`/destinations/${destinationId}/reviews`, payload);
};

export const deleteReview = async (reviewId) => {
  return await apiClient.delete(`/reviews/${reviewId}`);
};

// Authentication & Profile APIs
export const loginUser = async (credentials) => {
  return await apiClient.post('/auth/login', credentials);
};

export const registerUser = async (userData) => {
  return await apiClient.post('/auth/register', userData);
};

export const getCurrentUserProfile = async () => {
  return await apiClient.get('/auth/me');
};

export const refreshAccessToken = async (refreshToken) => {
  return await apiClient.post('/auth/refresh', { refreshToken });
};

export const logoutUser = async (refreshToken) => {
  return await apiClient.post('/auth/logout', { refreshToken });
};

export const updateUserProfile = async (payload) => {
  return await apiClient.put('/auth/profile', payload);
};

// Weather & Climate APIs
export const getWeatherForecast = async (params = {}) => {
  return await apiClient.get('/weather/forecast', { params });
};

export const getWeatherForDestination = async (destinationId) => {
  return await apiClient.get(`/weather/destinations/${destinationId}`);
};

// Maps & Routing APIs
export const getRouteEstimate = async (params = {}) => {
  return await apiClient.get('/maps/route', { params });
};

export const getDistanceEstimate = async (params = {}) => {
  return await apiClient.get('/maps/distance', { params });
};

// AI Provider APIs
export const generateAiItinerary = async (tripId, payload = {}) => {
  return await apiClient.post(`/trips/${tripId}/itinerary/ai-generate`, payload);
};

export const getAiStatus = async () => {
  return await apiClient.get('/ai/status');
};

export default apiClient;
