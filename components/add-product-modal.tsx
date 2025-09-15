"use client"

import React, { useState } from "react"
import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Upload } from "lucide-react"
import { useProductsStore } from "@/lib/products-store"

// Form validation schema
const addProductSchema = z.object({
  title: z.string().min(3, "Product name must be at least 3 characters"),
  price: z.string().min(1, "Price is required").refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Price must be a valid positive number"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["electronics", "jewelery", "men's clothing", "women's clothing"]),
  image: z.string().url("Please enter a valid image URL")
})

type AddProductFormData = z.infer<typeof addProductSchema>

interface AddProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "jewelery", label: "Jewelery" },
  { value: "men's clothing", label: "Men's Clothing" },
  { value: "women's clothing", label: "Women's Clothing" },
]

export function AddProductModal({ open, onOpenChange }: AddProductModalProps) {
  const { addProduct } = useProductsStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    clearErrors
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: "",
      price: "",
      description: "",
      category: undefined,
      image: ""
    }
  })

  const watchedImage = watch("image")

  // Update image preview when URL changes
  React.useEffect(() => {
    if (watchedImage && watchedImage.trim()) {
      // Simple URL validation
      try {
        new URL(watchedImage)
        setImagePreview(watchedImage)
      } catch {
        setImagePreview(null)
      }
    } else {
      setImagePreview(null)
    }
  }, [watchedImage])

  const onSubmit = async (data: AddProductFormData) => {
    setIsSubmitting(true)
    
    try {
      // Convert form data to the format expected by the store
      const productData = {
        title: data.title,
        price: parseFloat(data.price),
        description: data.description,
        category: data.category,
        image: data.image,
        rating: {
          rate: 0,
          count: 0
        }
      }

      // Add product using the store function (which includes optimistic updates)
      await addProduct(productData)
      
      // Success - close modal and reset form
      onOpenChange(false)
      reset()
      setImagePreview(null)
      
    } catch (error) {
      // Error handling is done in the store, but we can add additional UI feedback here
      console.error("Error adding product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    reset()
    setImagePreview(null)
    clearErrors()
    onOpenChange(false)
  }

  const handleImageLoad = () => {
    // Image loaded successfully
  }

  const handleImageError = () => {
    setImagePreview(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the product details below. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Product Image */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="image">Product Image URL</Label>
                <div className="mt-2 space-y-4">
                  {/* Image Preview */}
                  <div className="aspect-square bg-muted rounded-lg border overflow-hidden">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        width={400}
                        height={400}
                        className="w-full h-full object-contain p-4"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <Upload className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">Image preview will appear here</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Image URL Input */}
                  <div>
                    <Input
                      id="image"
                      {...register("image")}
                      placeholder="https://example.com/image.jpg"
                      className={errors.image ? "border-destructive" : ""}
                    />
                    {errors.image && (
                      <p className="text-sm text-destructive mt-1">{errors.image.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <Label htmlFor="title">Product Name *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter product name"
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price")}
                    placeholder="0.00"
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => setValue("category", value as "men's clothing" | "women's clothing" | "electronics" | "jewelery")}>
                    <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter product description"
                  rows={6}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
