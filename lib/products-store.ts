import { create } from "zustand"
import { toast } from "sonner"
import { productsApi } from "./mock-api"

interface Product {
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

interface ProductFilters {
  search: string
  category: string
  minPrice: number | null
  maxPrice: number | null
}

interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

interface ProductsState {
  // Data
  products: Product[]
  originalProducts: Product[]
  filteredProducts: Product[]
  loading: boolean
  error: string | null
  
  // Filters
  filters: ProductFilters
  
  // Pagination
  pagination: PaginationState
  
  // Actions
  fetchProducts: () => Promise<void>
  setSearch: (search: string) => void
  setCategory: (category: string) => void
  setPriceRange: (min: number | null, max: number | null) => void
  setPage: (page: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
  resetFilters: () => void
  applyFilters: () => void
  
  // CRUD operations
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  
  clearError: () => void
}

const initialFilters: ProductFilters = {
  search: "",
  category: "all",
  minPrice: null,
  maxPrice: null,
}

const initialPagination: PaginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  // Initial state
  products: [],
  originalProducts: [],
  filteredProducts: [],
  loading: false,
  error: null,
  filters: initialFilters,
  pagination: initialPagination,
  
  // Fetch products from API
  fetchProducts: async () => {
    set({ loading: true, error: null })
    
    try {
      const products = await productsApi.getAll()
      
      set({ 
        products,
        originalProducts: products,
        loading: false 
      })
      
      // Apply filters after fetching
      get().applyFilters()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch products"
      set({ error: errorMessage, loading: false })
      toast.error("Failed to load products", {
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
  
  setCategory: (category) => {
    set(state => ({
      filters: { ...state.filters, category },
      pagination: { ...state.pagination, currentPage: 1 }
    }))
    get().applyFilters()
  },
  
  setPriceRange: (minPrice, maxPrice) => {
    set(state => ({
      filters: { ...state.filters, minPrice, maxPrice },
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
    const { originalProducts, filters } = get()
    
    // Guard against undefined arrays
    if (!originalProducts || !Array.isArray(originalProducts)) {
      console.warn('originalProducts is not a valid array:', originalProducts)
      return
    }
    
    let filtered = [...originalProducts]
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply category filter
    if (filters.category && filters.category !== "all" && filters.category !== "") {
      filtered = filtered.filter(product => product.category === filters.category)
    }
    
    // Apply price range filter
    if (filters.minPrice !== null) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== null) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!)
    }
    
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / get().pagination.itemsPerPage)
    
    set(state => ({
      filteredProducts: filtered,
      pagination: {
        ...state.pagination,
        totalItems,
        totalPages,
        currentPage: Math.min(state.pagination.currentPage, totalPages || 1)
      }
    }))
  },
  
  // CRUD operations
  addProduct: async (productData) => {
    set({ loading: true, error: null })
    
    try {
      const newProduct = await productsApi.create(productData)
      
      set(state => ({
        products: [...state.products, newProduct],
        originalProducts: [...state.originalProducts, newProduct],
        loading: false
      }))
      
      get().applyFilters()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add product"
      set({ error: errorMessage, loading: false })
      toast.error("Failed to add product", {
        description: errorMessage
      })
    }
  },
  
  updateProduct: async (id, productData) => {
    set({ loading: true, error: null })
    
    try {
      const updatedProduct = await productsApi.update(id, productData)
      
      set(state => {
        const updatedProducts = state.products.map(product =>
          product.id === id ? updatedProduct : product
        )
        const updatedOriginalProducts = state.originalProducts.map(product =>
          product.id === id ? updatedProduct : product
        )
        
        return {
          products: updatedProducts,
          originalProducts: updatedOriginalProducts,
          loading: false
        }
      })
      
      get().applyFilters()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update product"
      set({ error: errorMessage, loading: false })
      toast.error("Failed to update product", {
        description: errorMessage
      })
    }
  },
  
  deleteProduct: async (id) => {
    // Get the current state before making changes
    const currentState = get()
    const productToDelete = currentState.products.find(product => product.id === id)
    
    if (!productToDelete) {
      toast.error("Product not found")
      return
    }
    
    // Optimistic update: Remove product immediately from UI
    set(state => ({
      products: state.products.filter(product => product.id !== id),
      originalProducts: state.originalProducts.filter(product => product.id !== id),
      error: null
    }))
    
    // Apply filters to update the UI immediately
    get().applyFilters()
    
    // Show optimistic loading toast
    const loadingToast = toast.loading(`Deleting "${productToDelete.title}"...`)
    
    try {
      // Make the API call
      await productsApi.delete(id)
      
      // Success: dismiss loading toast and show success
      toast.dismiss(loadingToast)
      toast.success("Product deleted successfully", {
        description: `"${productToDelete.title}" has been removed.`
      })
      
    } catch (error) {
      // Rollback: restore the product to the state
      set(state => ({
        products: [...state.products, productToDelete].sort((a, b) => a.id - b.id),
        originalProducts: [...state.originalProducts, productToDelete].sort((a, b) => a.id - b.id),
        error: error instanceof Error ? error.message : "Failed to delete product"
      }))
      
      // Apply filters to restore the UI
      get().applyFilters()
      
      // Show error toast
      toast.dismiss(loadingToast)
      const errorMessage = error instanceof Error ? error.message : "Failed to delete product"
      toast.error("Failed to delete product", {
        description: `Could not delete "${productToDelete.title}". ${errorMessage}`
      })
    }
  },
  
  clearError: () => {
    set({ error: null })
  },
}))