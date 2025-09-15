"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react"
import { productsApi } from "@/lib/mock-api"
import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PublicLayout } from "@/components/public-layout"
import { toast } from "sonner"

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

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const productId = parseInt(params.id as string)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || isNaN(productId)) {
        setError("Invalid product ID")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const productData = await productsApi.getById(productId)
        setProduct(productData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image
      })
    }

    // Custom toast for multiple items
    if (quantity > 1) {
      toast.success(`Added ${quantity} items to cart`, {
        description: product.title
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        })
      } catch {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-20 bg-muted rounded"></div>
                <div className="h-12 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (error || !product) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </PublicLayout>
    )
  }

  // Mock additional images (in real app, these would come from the API)
  const images = [product.image, product.image, product.image]

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-50">
              <Image
                src={images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              {product.rating.rate >= 4.5 && (
                <Badge className="absolute top-4 left-4 bg-green-500">
                  Top Rated
                </Badge>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative overflow-hidden rounded-md border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2 capitalize">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating.rate)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.rating.rate}</span>
                  <span className="text-muted-foreground">
                    ({product.rating.count} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                <Badge variant="secondary">In Stock</Badge>
              </div>
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="mr-2 h-5 w-5" />
                  Wishlist
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">SSL encrypted</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Key Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>High-quality materials and construction</li>
                      <li>Designed for durability and performance</li>
                      <li>Suitable for everyday use</li>
                      <li>Backed by manufacturer warranty</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">General</h4>
                      <dl className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Category:</dt>
                          <dd className="capitalize">{product.category}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Rating:</dt>
                          <dd>{product.rating.rate}/5</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Reviews:</dt>
                          <dd>{product.rating.count}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Details</h4>
                      <dl className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">SKU:</dt>
                          <dd>PROD-{product.id.toString().padStart(4, '0')}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Availability:</dt>
                          <dd>In Stock</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Shipping:</dt>
                          <dd>2-3 business days</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{product.rating.rate}</div>
                        <div className="flex justify-center mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating.rate)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {product.rating.count} reviews
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => {
                            const percentage = Math.max(0, (product.rating.rate - stars + 1) * 20)
                            return (
                              <div key={stars} className="flex items-center gap-2">
                                <span className="text-sm w-8">{stars}★</span>
                                <div className="flex-1 bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-yellow-400 h-2 rounded-full" 
                                    style={{ width: `${Math.min(100, percentage)}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground w-10">
                                  {Math.round(percentage)}%
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Customer reviews would appear here in a real application.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PublicLayout>
  )
}
