import axios from "axios"
import { toast } from "sonner"

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor - add auth token and logging
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("auth_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    // Log requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }

    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  }
)

// Response interceptor - handle common errors and logging
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }

    return response
  },
  (error) => {
    // Log errors
    console.error("API Error:", error)

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("auth_token")
            sessionStorage.removeItem("user_data")
            toast.error("Session expired", {
              description: "Please log in again"
            })
            // Only redirect if not already on login page
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login"
            }
          }
          break
        case 403:
          toast.error("Access denied", {
            description: "You don't have permission to perform this action"
          })
          break
        case 404:
          toast.error("Not found", {
            description: "The requested resource was not found"
          })
          break
        case 422:
          // Validation errors
          if (data?.message) {
            toast.error("Validation error", {
              description: data.message
            })
          }
          break
        case 500:
          toast.error("Server error", {
            description: "An internal server error occurred"
          })
          break
        default:
          toast.error("Request failed", {
            description: data?.message || `Error ${status}: ${error.message}`
          })
      }
    } else if (error.request) {
      // Network error
      toast.error("Network error", {
        description: "Please check your internet connection"
      })
    } else {
      // Other error
      toast.error("Error", {
        description: error.message || "An unexpected error occurred"
      })
    }

    return Promise.reject(error)
  }
)

export default apiClient

// Helper function to handle API errors consistently
export const handleApiError = (error: unknown) => {
  // Error is already handled by interceptor, just re-throw
  throw error
}

// Helper function for success messages
export const handleApiSuccess = (message: string, description?: string) => {
  toast.success(message, { description })
}