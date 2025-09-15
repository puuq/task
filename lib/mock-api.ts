import { AuthUser } from "./schemas"

// Mock delay function to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export interface User {
  id: number
  email: string
  username: string
  password: string
  name: {
    firstname: string
    lastname: string
  }
  address: {
    city: string
    street: string
    number: number
    zipcode: string
    geolocation: {
      lat: string
      long: string
    }
  }
  phone: string
}

// Products API
export const productsApi = {
  async getAll(): Promise<Product[]> {
    try {
      await delay(1000)
      const response = await fetch("https://fakestoreapi.com/products")
      if (!response.ok) throw new Error("Failed to fetch products")
      return response.json()
    } catch {
      throw new Error("Failed to fetch products")
    }
  },

  async getById(id: number): Promise<Product> {
    try {
      await delay(500)
      const response = await fetch(`https://fakestoreapi.com/products/${id}`)
      if (!response.ok) throw new Error("Product not found")
      return response.json()
    } catch {
      throw new Error("Failed to fetch product")
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      await delay(300)
      const response = await fetch("https://fakestoreapi.com/products/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      return response.json()
    } catch {
      throw new Error("Failed to fetch categories")
    }
  },

  async create(product: Omit<Product, "id" | "rating">): Promise<Product> {
    try {
      await delay(1500)
      
      // Mock API response with new ID
      const newProduct: Product = {
        ...product,
        id: Math.floor(Math.random() * 1000) + 100,
        rating: {
          rate: 0,
          count: 0
        }
      }

      // Simulate potential API error
      if (Math.random() < 0.1) {
        throw new Error("Server error occurred")
      }

      return newProduct
    } catch (error) {
      throw error instanceof Error ? error : new Error("Failed to create product")
    }
  },

  async update(id: number, product: Partial<Product>): Promise<Product> {
    try {
      await delay(1000)
      
      // Fetch current product first
      const currentProduct = await this.getById(id)
      const updatedProduct = { ...currentProduct, ...product }

      // Simulate potential API error
      if (Math.random() < 0.05) {
        throw new Error("Update failed")
      }

      return updatedProduct
    } catch (error) {
      throw error instanceof Error ? error : new Error("Failed to update product")
    }
  },

  async delete(): Promise<void> {
    try {
      await delay(800)
      
      // Simulate potential API error
      if (Math.random() < 0.05) {
        throw new Error("Delete failed")
      }

      // Mock successful deletion
      return
    } catch (error) {
      throw error instanceof Error ? error : new Error("Failed to delete product")
    }
  }
}

// Users API
export const usersApi = {
  async getAll(): Promise<User[]> {
    try {
      await delay(800)
      const response = await fetch("https://fakestoreapi.com/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      return response.json()
    } catch {
      throw new Error("Failed to fetch users")
    }
  },

  async getById(id: number): Promise<User> {
    try {
      await delay(400)
      const response = await fetch(`https://fakestoreapi.com/users/${id}`)
      if (!response.ok) throw new Error("User not found")
      return response.json()
    } catch {
      throw new Error("Failed to fetch user")
    }
  },

  async create(user: Omit<User, "id">): Promise<User> {
    try {
      await delay(1200)
      
      const newUser: User = {
        ...user,
        id: Math.floor(Math.random() * 1000) + 100,
      }

      // Simulate potential API error
      if (Math.random() < 0.1) {
        throw new Error("Email already exists")
      }

      return newUser
    } catch (error) {
      throw error instanceof Error ? error : new Error("Failed to create user")
    }
  },

  async update(id: number, user: Partial<User>): Promise<User> {
    try {
      await delay(900)
      
      const currentUser = await this.getById(id)
      const updatedUser = { ...currentUser, ...user }

      return updatedUser
    } catch {
      throw new Error("Failed to update user")
    }
  },

  async delete(): Promise<void> {
    try {
      await delay(600)
      
      // Mock successful deletion
      return
    } catch (error) {
      throw error instanceof Error ? error : new Error("Failed to delete user")
    }
  }
}

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    try {
      await delay(1500)
      
      // Mock validation
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      if (password.length < 6) {
        throw new Error("Invalid credentials")
      }

      // Simulate login failure occasionally
      if (Math.random() < 0.1) {
        throw new Error("Invalid email or password")
      }

      const token = `mock-token-${Date.now()}`
      const user = {
        email,
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        firstName: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        lastName: "User"
      }

      return { token, user }
    } catch (error) {
      throw error instanceof Error ? error : new Error("Login failed")
    }
  },

  async signup(data: { email: string; password: string; firstName: string; lastName: string }): Promise<{ token: string; user: AuthUser }> {
    try {
      await delay(2000)
      
      // Mock validation
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        throw new Error("All fields are required")
      }

      // Simulate email already exists error
      if (Math.random() < 0.15) {
        throw new Error("Email already exists")
      }

      const token = `mock-token-${Date.now()}`
      const user = {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName
      }

      return { token, user }
    } catch (error) {
      throw error instanceof Error ? error : new Error("Signup failed")
    }
  },

  async logout(): Promise<void> {
    await delay(300)
    // Mock logout always succeeds
    return
  }
}

