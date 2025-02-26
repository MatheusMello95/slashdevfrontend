import axios from 'axios'

// Types
export interface User {
  id: number
  name: string
  email: string
  widget_ids: number[]
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export interface Widget {
  id: number
  name: string
  slug: string
  api_source: 'disease' | 'crypto' | 'worldbank'
  endpoint?: string
  description?: string
  default_settings?: any
  is_active: boolean
}

export interface UserWidget extends Widget {
  settings: any
  position: number
  is_visible: boolean
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Check if we're in the browser and if there's a token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration or authentication errors
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear token and user data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// Auth API calls
export const loginUser = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>('/login', { email, password })
  return response.data
}

export const registerUser = async (
  name: string, 
  email: string, 
  password: string,
  password_confirmation: string
) => {
  const response = await api.post<AuthResponse>('/register', { 
    name, 
    email, 
    password,
    password_confirmation
  })
  return response.data
}

export const logoutUser = async () => {
  const response = await api.post('/logout')
  return response.data
}

export const getUserProfile = async () => {
  const response = await api.get('/profile')
  return response.data
}

// Widget API calls
export const getAvailableWidgets = async () => {
  const response = await api.get('/widgets')
  return response.data
}

export const getUserWidgets = async () => {
  const response = await api.get('/user/widgets')
  return response.data
}

export const addWidgetToUser = async (widgetId: number, settings?: any, position?: number) => {
  const response = await api.post(`/user/widgets/${widgetId}`, { settings, position })
  return response.data
}

export const updateUserWidget = async (widgetId: number, data: { settings?: any, position?: number, is_visible?: boolean }) => {
  const response = await api.put(`/user/widgets/${widgetId}`, data)
  return response.data
}

export const removeUserWidget = async (widgetId: number) => {
  const response = await api.delete(`/user/widgets/${widgetId}`)
  return response.data
}

export const updateWidgetPositions = async (positions: { widget_id: number, position: number }[]) => {
  const response = await api.post('/user/widgets/positions', { positions })
  return response.data
}

export const getWidgetData = async (widgetId: number) => {
  const response = await api.get(`/widget-data/${widgetId}`)
  return response.data
}

export default api