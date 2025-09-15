import { create } from "zustand"
import { toast } from "sonner"
import { usersApi } from "./mock-api"

interface User {
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

interface UserFilters {
  search: string
  status: "all" | "active" | "inactive"
}

interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

interface UsersState {
  // Data
  users: User[]
  originalUsers: User[]
  filteredUsers: User[]
  loading: boolean
  error: string | null
  
  // Filters
  filters: UserFilters
  
  // Pagination
  pagination: PaginationState
  
  // Actions
  fetchUsers: () => Promise<void>
  setSearch: (search: string) => void
  setStatus: (status: "all" | "active" | "inactive") => void
  setPage: (page: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
  resetFilters: () => void
  applyFilters: () => void
  clearError: () => void
}

const initialFilters: UserFilters = {
  search: "",
  status: "all",
}

const initialPagination: PaginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
}

export const useUsersStore = create<UsersState>((set, get) => ({
  // Initial state
  users: [],
  originalUsers: [],
  filteredUsers: [],
  loading: false,
  error: null,
  filters: initialFilters,
  pagination: initialPagination,
  
  // Fetch users from API
  fetchUsers: async () => {
    set({ loading: true, error: null })
    
    try {
      const users = await usersApi.getAll()
      
      set({ 
        users,
        originalUsers: users,
        loading: false 
      })
      
      // Apply filters after fetching
      get().applyFilters()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch users"
      set({ error: errorMessage, loading: false })
      toast.error("Failed to load users", {
        description: errorMessage
      })
    }
  },
  
  // Filter actions
  setSearch: (search) => {
    set(state => ({
      filters: { ...state.filters, search },
      pagination: { ...state.pagination, currentPage: 1 }
    }))
    get().applyFilters()
  },
  
  setStatus: (status) => {
    set(state => ({
      filters: { ...state.filters, status },
      pagination: { ...state.pagination, currentPage: 1 }
    }))
    get().applyFilters()
  },
  
  // Pagination actions
  setPage: (currentPage) => {
    set(state => ({
      pagination: { ...state.pagination, currentPage }
    }))
  },
  
  setItemsPerPage: (itemsPerPage) => {
    set(state => ({
      pagination: { 
        ...state.pagination, 
        itemsPerPage,
        currentPage: 1,
        totalPages: Math.ceil(state.pagination.totalItems / itemsPerPage)
      }
    }))
  },
  
  resetFilters: () => {
    set({ 
      filters: initialFilters,
      pagination: { ...initialPagination }
    })
    get().applyFilters()
  },
  
  // Apply all filters
  applyFilters: () => {
    const { originalUsers, filters } = get()
    
    // Guard against undefined arrays
    if (!originalUsers || !Array.isArray(originalUsers)) {
      console.warn('originalUsers is not a valid array:', originalUsers)
      return
    }
    
    let filtered = [...originalUsers]
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(user =>
        user.name.firstname.toLowerCase().includes(searchLower) ||
        user.name.lastname.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower) ||
        user.phone.toLowerCase().includes(searchLower) ||
        user.address.city.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply status filter
    if (filters.status !== "all") {
      // For demo purposes, we'll randomly assign some users as inactive
      // In a real app, this would be based on actual user status
      if (filters.status === "active") {
        filtered = filtered.filter(user => user.id % 2 === 1) // Odd IDs are active
      } else if (filters.status === "inactive") {
        filtered = filtered.filter(user => user.id % 2 === 0) // Even IDs are inactive
      }
    }
    
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / get().pagination.itemsPerPage)
    
    set(state => ({
      filteredUsers: filtered,
      pagination: {
        ...state.pagination,
        totalItems,
        totalPages,
        currentPage: Math.min(state.pagination.currentPage, totalPages || 1)
      }
    }))
  },
  
  clearError: () => {
    set({ error: null })
  },
}))