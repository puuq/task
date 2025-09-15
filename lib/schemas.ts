import { z } from "zod"

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Product Schemas
export const productSchema = z.object({
  title: z.string().min(1, "Product name is required").min(3, "Product name must be at least 3 characters"),
  price: z.string().min(1, "Price is required").refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Price must be a valid positive number"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Please enter a valid image URL")
})

export const productCreateSchema = z.object({
  title: z.string().min(3, "Product name must be at least 3 characters"),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["electronics", "jewelery", "men's clothing", "women's clothing"]),
  image: z.string().url("Please enter a valid image URL")
})

export const productSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})

// User Schemas
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  address: z.object({
    city: z.string(),
    street: z.string(),
    number: z.number(),
    zipcode: z.string(),
  }),
})

export const userSearchSchema = z.object({
  query: z.string().optional(),
  status: z.enum(["active", "inactive", "all"]).default("all"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})

export const authUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  firstName: z.string(),
  lastName: z.string(),
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type ProductFormData = z.infer<typeof productSchema>
export type ProductCreateData = z.infer<typeof productCreateSchema>
export type ProductSearchData = z.infer<typeof productSearchSchema>
export type UserData = z.infer<typeof userSchema>
export type UserSearchData = z.infer<typeof userSearchSchema>
export type AuthUser = z.infer<typeof authUserSchema>

// API Response Schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
})

export type ApiResponse = z.infer<typeof apiResponseSchema>