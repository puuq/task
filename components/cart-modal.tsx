"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface CheckoutFormData {
  name: string
  email: string
  address: string
  city: string
  zipCode: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

export function CartModal() {
  const { 
    items, 
    isOpen, 
    isCheckoutOpen, 
    total, 
    itemCount,
    closeCart, 
    openCheckout, 
    closeCheckout,
    updateQuantity, 
    removeItem,
    checkout 
  } = useCartStore()

  const [checkoutData, setCheckoutData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await checkout(checkoutData)
      // Reset form on success
      setCheckoutData({
        name: "",
        email: "",
        address: "",
        city: "",
        zipCode: "",
        cardNumber: "",
        expiryDate: "",
        cvv: ""
      })
    } catch {
      // Error is handled in the store
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setCheckoutData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
      {/* Cart Sheet */}
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader className="px-6 pt-6">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </SheetTitle>
            <SheetDescription>
              Review your items and proceed to checkout when ready.
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-4 px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Your cart is empty</h3>
                  <p className="text-muted-foreground">Add some items to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm leading-tight mb-1">
                              {item.title}
                            </h4>
                            <p className="text-lg font-semibold text-primary">
                              ${item.price.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            {items.length > 0 && (
              <div className="border-t pt-4 px-6 pb-4 space-y-3">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button 
                  onClick={openCheckout}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Checkout Sheet */}
      <Sheet open={isCheckoutOpen} onOpenChange={(open) => !open && closeCheckout()}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-4">
          <SheetHeader>
            <SheetTitle>Checkout</SheetTitle>
            <SheetDescription>
              Complete your order by filling out the form below.
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleCheckout} className="space-y-6 py-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={checkoutData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={checkoutData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={checkoutData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={checkoutData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={checkoutData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={checkoutData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={checkoutData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={checkoutData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeCheckout}
                className="flex-1"
              >
                Back to Cart
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
