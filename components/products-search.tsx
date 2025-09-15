"use client"
import React from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useProductsStore } from "@/lib/products-store"

const categories = [
  { value: "all", label: "All Categories" },
  { value: "electronics", label: "Electronics" },
  { value: "jewelery", label: "Jewelery" },
  { value: "men's clothing", label: "Men's Clothing" },
  { value: "women's clothing", label: "Women's Clothing" },
]

export function ProductsSearch() {
  const { 
    filters, 
    setSearch, 
    setCategory, 
    setPriceRange, 
    resetFilters,
    pagination 
  } = useProductsStore()
  
  const [priceMin, setPriceMin] = React.useState("")
  const [priceMax, setPriceMax] = React.useState("")

  const handlePriceRangeApply = () => {
    const min = priceMin ? parseFloat(priceMin) : null
    const max = priceMax ? parseFloat(priceMax) : null
    setPriceRange(min, max)
  }

  const hasActiveFilters = filters.search || filters.category !== "" || filters.minPrice !== null || filters.maxPrice !== null

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filters.category || "all"} onValueChange={(value) => setCategory(value === "all" ? "" : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <div className="flex gap-1">
            <Input
              type="number"
              placeholder="Min $"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-20"
            />
            <Input
              type="number"
              placeholder="Max $"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-20"
            />
            <Button onClick={handlePriceRangeApply} variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {hasActiveFilters && (
            <Button 
              onClick={() => {
                resetFilters()
                setPriceMin("")
                setPriceMax("")
              }} 
              variant="outline" 
              size="sm"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary">
              Search: {filters.search}
              <button
                onClick={() => setSearch("")}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary">
              Category: {categories.find(c => c.value === filters.category)?.label}
              <button
                onClick={() => setCategory("")}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(filters.minPrice !== null || filters.maxPrice !== null) && (
            <Badge variant="secondary">
              Price: {filters.minPrice ? `$${filters.minPrice}` : "$0"} - {filters.maxPrice ? `$${filters.maxPrice}` : "∞"}
              <button
                onClick={() => setPriceRange(null, null)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
      
      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {pagination.totalItems} results
      </div>
    </div>
  )
}