import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"

export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

export interface CheckoutData {
  name: string
  email: string
  address: string
  city: string
  zipCode: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

interface CartState {
  // Cart data
  items: CartItem[]
  isOpen: boolean
  isCheckoutOpen: boolean
  
  // Computed values
  itemCount: number
  total: number
  
  // Actions
  addItem: (product: { id: number; title: string; price: number; image: string }) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  
  // Modal actions
  openCart: () => void
  closeCart: () => void
  openCheckout: () => void
  closeCheckout: () => void
  
  // Checkout
  checkout: (data: CheckoutData) => Promise<void>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      isCheckoutOpen: false,
      itemCount: 0,
      total: 0,
      
      // Add item to cart
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id)
          
          let newItems: CartItem[]
          if (existingItem) {
            // Update quantity if item already exists
            newItems = state.items.map(item =>
              item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          } else {
            // Add new item
            newItems = [...state.items, { ...product, quantity: 1 }]
          }
          
          const itemCount = newItems.reduce((total, item) => total + item.quantity, 0)
          const total = newItems.reduce((total, item) => total + (item.price * item.quantity), 0)
          
          return { 
            items: newItems, 
            itemCount, 
            total: Math.round(total * 100) / 100 // Round to 2 decimal places
          }
        })
        
        toast.success("Added to cart", {
          description: product.title
        })
      },
      
      // Remove item from cart
      removeItem: (id) => {
        set((state) => {
          const itemToRemove = state.items.find(item => item.id === id)
          const newItems = state.items.filter(item => item.id !== id)
          
          const itemCount = newItems.reduce((total, item) => total + item.quantity, 0)
          const total = newItems.reduce((total, item) => total + (item.price * item.quantity), 0)
          
          if (itemToRemove) {
            toast.success("Removed from cart", {
              description: itemToRemove.title
            })
          }
          
          return { 
            items: newItems, 
            itemCount, 
            total: Math.round(total * 100) / 100
          }
        })
      },
      
      // Update item quantity
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        set((state) => {
          const newItems = state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
          
          const itemCount = newItems.reduce((total, item) => total + item.quantity, 0)
          const total = newItems.reduce((total, item) => total + (item.price * item.quantity), 0)
          
          return { 
            items: newItems, 
            itemCount, 
            total: Math.round(total * 100) / 100
          }
        })
      },
      
      // Clear all items
      clearCart: () => {
        set({ items: [], itemCount: 0, total: 0 })
        toast.success("Cart cleared")
      },
      
      // Modal actions
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      openCheckout: () => set({ isCheckoutOpen: true, isOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),
      
      // Checkout process
      checkout: async (data: CheckoutData) => {
        const { items } = get()
        
        if (items.length === 0) {
          toast.error("Cart is empty")
          return
        }
        
        // Simulate checkout process
        const loadingToast = toast.loading("Processing your order...")
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Simulate random checkout failure
          if (Math.random() < 0.1) {
            throw new Error("Payment failed. Please try again.")
          }
          
          // Success: clear cart and close modals
          set({ 
            items: [], 
            itemCount: 0, 
            total: 0, 
            isCheckoutOpen: false, 
            isOpen: false 
          })
          
          toast.dismiss(loadingToast)
          toast.success("Order placed successfully!", {
            description: "Thank you for your purchase. You'll receive a confirmation email shortly."
          })
          
        } catch (error) {
          toast.dismiss(loadingToast)
          const errorMessage = error instanceof Error ? error.message : "Checkout failed"
          toast.error("Checkout failed", {
            description: errorMessage
          })
          throw error
        }
      }
    }),
    {
      name: "cart-storage", // Key for localStorage
      partialize: (state) => ({ 
        items: state.items,
        itemCount: state.itemCount,
        total: state.total
      }), // Only persist cart data, not modal states
    }
  )
)
