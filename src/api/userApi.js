import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL 

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const userApi = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get('/user')
    return response
  },

  // Toggle user ban status (admin only)
  toggleBanUser: async (userId, isBanned) => {
    const endpoint = isBanned ? 
      `/users/status/ban/${userId}` : 
      `/users/status/unban/${userId}`
    const response = await api.put(endpoint)
    return response
  },

  // Get user by ID (admin only)
  getUserById: async (userId) => {
    const response = await api.get(`/user/${userId}`)
    return response
  },

  // Update user (admin only)
  updateUser: async (userId, userData) => {
    const response = await api.put(`/user/${userId}`, userData)
    return response
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/user/${userId}`)
    return response
  }
} 