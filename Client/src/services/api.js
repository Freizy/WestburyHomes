import axios from "axios";

/* ================================
   BASE URL CONFIG (supports Vite & CRA)
   ================================ */
const baseURL =
  import.meta?.env?.VITE_API_URL || // Vite
  "http://localhost:5000/api"; // Fallback

/* ================================
   AXIOS INSTANCE
   ================================ */
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================================
   REQUEST INTERCEPTOR
   Adds token to Authorization header
   ================================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   RESPONSE INTERCEPTOR
   Handles global API errors
   ================================ */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear storage on unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Hard redirect (can swap with React Router navigate)
      window.location.href = "/login";
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

/* ================================
   API ENDPOINTS
   ================================ */

// --- Properties ---
export const getProperties = (params = {}) =>
  api.get("/properties", { params });

export const getPropertyById = (id) => api.get(`/properties/${id}`);

export const getFeaturedProperties = () => api.get("/properties/featured/list");

export const searchProperties = (params) =>
  api.get("/properties/search/query", { params });

export const getPropertiesByLocation = (location) =>
  api.get(`/properties/location/${location}`);

// --- Contact ---
export const submitContactForm = (data) => api.post("/contact", data);

export const getContactInquiries = () => api.get("/contact");

export const updateContactStatus = (id, status) =>
  api.patch(`/contact/${id}`, { status });

export const getContactStats = () => api.get("/contact/stats/overview");

// --- Bookings ---
export const createBooking = (data) => api.post("/bookings", data);

export const getBookings = (params = {}) => api.get("/bookings", { params });

export const getBookingById = (id) => api.get(`/bookings/${id}`);

export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, { status });

export const getBookingStats = () => api.get("/bookings/stats/overview");

export const checkAvailability = (propertyId, checkIn, checkOut) =>
  api.get(`/bookings/availability/${propertyId}`, {
    params: { check_in_date: checkIn, check_out_date: checkOut },
  });

// --- Auth ---
export const login = (credentials) => api.post("/auth/login", credentials);

export const register = (userData) => api.post("/auth/register", userData);

export const getProfile = () => api.get("/auth/profile");

export const updateProfile = (data) => api.put("/auth/profile", data);

export const changePassword = (data) => api.put("/auth/change-password", data);

export const logout = () => api.post("/auth/logout");

// --- Health Check ---
export const healthCheck = () => api.get("/health");

export default api;
