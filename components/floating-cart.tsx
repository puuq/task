"use client"

import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function FloatingCart() {
  const { itemCount, openCart } = useCartStore()

  // Don't show if cart is empty
  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={openCart}
        size="lg"
        className="relative rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      >
        <ShoppingCart className="h-6 w-6" />
        <Badge 
          variant="secondary" 
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </Badge>
      </Button>
    </div>
  )
}
