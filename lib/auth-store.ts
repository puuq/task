import { create } from "zustand"
import { toast } from "sonner"
import { authApi } from "./mock-api"

interface User {
  email: string
  name: string
  firstName: string
  lastName: string
}

interface AuthState {
  token: string | null
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>
  googleLogin: () => Promise<void>
  logout: () => void
  checkToken: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? sessionStorage.getItem("auth_token") : null,
  user: typeof window !== 'undefined' ? 
    (() => {
      const userData = sessionStorage.getItem("user_data")
      return userData ? JSON.parse(userData) : null
    })() : null,
  loading: false,
  error: null,
  
  login: async (email, password) => {
    set({ loading: true, error: null })
    
    try {
      const { token, user } = await authApi.login(email, password)
      
      sessionStorage.setItem("auth_token", token)
      sessionStorage.setItem("user_data", JSON.stringify(user))
      set({ token, user, loading: false })
      
      toast.success("Login successful!", {
        description: `Welcome back, ${user.name}!`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      set({ error: errorMessage, loading: false })
      toast.error("Login failed", {
        description: errorMessage
      })
      throw error
    }
  },
  
  signup: async (data) => {
    set({ loading: true, error: null })
    
    try {
      const { token, user } = await authApi.signup(data)
      
      sessionStorage.setItem("auth_token", token)
      sessionStorage.setItem("user_data", JSON.stringify(user))
      set({ token, user, loading: false })
      
      toast.success("Account created successfully!", {
        description: `Welcome, ${user.name}!`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Signup failed"
      set({ error: errorMessage, loading: false })
      toast.error("Signup failed", {
        description: errorMessage
      })
      throw error
    }
  },
  
  googleLogin: async () => {
    set({ loading: true, error: null })
    
    try {
      // Simulate 2-second delay for Google OAuth
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Demo user data
      const demoUser = {
        email: "demo-email@gmail.com",
        name: "Demo User",
        firstName: "Demo",
        lastName: "User"
      }
      
      // Generate a demo token
      const token = "demo-google-token-" + Date.now()
      
      sessionStorage.setItem("auth_token", token)
      sessionStorage.setItem("user_data", JSON.stringify(demoUser))
      set({ token, user: demoUser, loading: false })
      
      toast.success("Google login successful!", {
        description: `Welcome, ${demoUser.name}!`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Google login failed"
      set({ error: errorMessage, loading: false })
      toast.error("Google login failed", {
        description: errorMessage
      })
      throw error
    }
  },
  
  logout: () => {
    sessionStorage.removeItem("auth_token")
    sessionStorage.removeItem("user_data")
    set({ token: null, user: null, error: null })
    toast.success("Logged out successfully")
  },
  
  checkToken: () => {
    try {
      const token = sessionStorage.getItem("auth_token")
      const userData = sessionStorage.getItem("user_data")
      const user = userData ? JSON.parse(userData) : null
      set({ token, user })
    } catch (error) {
      console.error("Error checking token:", error)
      set({ token: null, user: null })
    }
  },
  
  clearError: () => {
    set({ error: null })
  },
}))
