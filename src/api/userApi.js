import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api'

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
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login' // Redirect to login page
      }
      // Handle 403 Forbidden (not admin)
      if (error.response.status === 403) {
        throw new Error('Access denied. Admin privileges required.')
      }
    }
    return Promise.reject(error)
  }
)

export const userApi = {
  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const response = await api.get('/users')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Toggle user ban status (admin only)
  toggleBanUser: async (userId, banned) => {
    try {
      const response = await api.patch(`/users/${userId}/toggle-ban`, {
        banned
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get user by ID (admin only)
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update user (admin only)
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    try {
      await api.delete(`/users/${userId}`)
    } catch (error) {
      throw error
    }
  }
} 