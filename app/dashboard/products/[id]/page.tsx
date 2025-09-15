"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Upload } from "lucide-react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { toast } from "sonner"

const productSchema = z.object({
  title: z.string().min(1, "Product name is required").min(3, "Product name must be at least 3 characters"),
  price: z.string().min(1, "Price is required").refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Price must be a valid positive number"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Please enter a valid image URL")
})

type ProductFormData = z.infer<typeof productSchema>

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

export default function ProductEditPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    price: "",
    description: "",
    category: "",
    image: ""
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${params.id}`)
        const data = await response.json()
        setProduct(data)
        setFormData({
          title: data.title,
          price: data.price.toString(),
          description: data.description,
          category: data.category,
          image: data.image
        })
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleSave = async () => {
    try {
      // Validate form data
      const validatedData = productSchema.parse(formData)
      setErrors({}) // Clear any previous errors
      
      setSaving(true)
      
      // Show loading toast
      const loadingToast = toast.loading("Saving product changes...")
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast)
      toast.success("Product updated successfully!", {
        description: `${validatedData.title} has been saved.`
      })
      
      setSaving(false)
      
      // In a real app, you'd make the API call here
      console.log("Saving product:", validatedData)
      
    } catch (error) {
      setSaving(false)
      
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Partial<Record<keyof ProductFormData, string>> = {}
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ProductFormData] = err.message
          }
        })
        setErrors(fieldErrors)
        
        toast.error("Validation failed", {
          description: "Please check the form for errors and try again."
        })
      } else {
        toast.error("Failed to save product", {
          description: "An unexpected error occurred. Please try again."
        })
      }
    }
  }


  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <h1 className="text-lg font-semibold">Edit Product</h1>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!product) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <h1 className="text-lg font-semibold">Product Not Found</h1>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="text-center">
              <p className="text-muted-foreground">Product not found</p>
              <Button onClick={() => router.back()} className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">Edit Product #{params.id}</h1>
          <div className="ml-auto flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="image">Product Image</Label>
                <div className="mt-2 space-y-4">
                  <div className="aspect-square bg-white rounded-lg border overflow-hidden">
                    <img
                      src={formData.image}
                      alt={formData.title}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Image
                    </Button>
                  </div>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="Image URL"
                    className={errors.image ? "border-destructive" : ""}
                  />
                  {errors.image && (
                    <p className="text-sm text-destructive">{errors.image}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Product Details Form */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Name</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter product name"
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                      className={errors.price ? "border-destructive" : ""}
                    />
                    {errors.price && (
                      <p className="text-sm text-destructive">{errors.price}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="jewelery">Jewelery</SelectItem>
                        <SelectItem value="men's clothing">Men&apos;s Clothing</SelectItem>
                        <SelectItem value="women's clothing">Women&apos;s Clothing</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter product description"
                    rows={6}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>
              </div>
              
              {/* Product Stats */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h3 className="font-semibold">Product Statistics</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="ml-2 font-medium">{product.rating.rate}/5</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reviews:</span>
                    <span className="ml-2 font-medium">{product.rating.count}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="ml-2">Active</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stock:</span>
                    <span className="ml-2 font-medium">In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}