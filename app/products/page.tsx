"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, Filter } from "lucide-react"
import { useProductsStore } from "@/lib/products-store"
import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { PublicLayout } from "@/components/public-layout"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"

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

export default function ProductsPage() {
  const { 
    filteredProducts, 
    loading, 
    filters, 
    pagination,
    fetchProducts,
    setSearch,
    setCategory,
    setPriceRange,
    setPage,
    resetFilters
  } = useProductsStore()
  const { addItem } = useCartStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image
    })
  }

  // Get paginated products
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
  const endIndex = startIndex + pagination.itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Get unique categories
  const categories = Array.from(new Set(filteredProducts.map(p => p.category)))

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Products</h1>
            <p className="text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, pagination.totalItems)} of {pagination.totalItems} products
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            {/* Search */}
            <div className="relative flex-1 lg:w-80">
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-6">
                  <FiltersContent 
                    categories={categories}
                    filters={filters}
                    setCategory={setCategory}
                    setPriceRange={setPriceRange}
                    resetFilters={resetFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={resetFilters}
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <FiltersContent 
                  categories={categories}
                  filters={filters}
                  setCategory={setCategory}
                  setPriceRange={setPriceRange}
                  resetFilters={resetFilters}
                />
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="p-0">
                      <div className="aspect-square bg-muted rounded-t-lg"></div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters.
                </p>
                <Button onClick={resetFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedProducts.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="p-0">
                        <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-50">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          {product.rating.rate >= 4.5 && (
                            <Badge className="absolute top-2 left-2 bg-green-500">
                              Top Rated
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Link 
                          href={`/product/${product.id}`}
                          className="block hover:text-primary transition-colors"
                        >
                          <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">
                            {product.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground mb-2 capitalize">
                          {product.category}
                        </p>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating.rate}</span>
                          <span className="text-sm text-muted-foreground">
                            ({product.rating.count})
                          </span>
                        </div>
                        <p className="text-xl font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          onClick={() => handleAddToCart(product)}
                          className="w-full"
                          size="sm"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setPage(Math.max(1, pagination.currentPage - 1))}
                            className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                          .filter(page => {
                            const current = pagination.currentPage
                            return page === 1 || page === pagination.totalPages || 
                                   (page >= current - 1 && page <= current + 1)
                          })
                          .map((page, index, array) => (
                            <PaginationItem key={page}>
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span className="px-2">...</span>
                              )}
                              <PaginationLink
                                onClick={() => setPage(page)}
                                isActive={page === pagination.currentPage}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setPage(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                            className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

interface FiltersContentProps {
  categories: string[]
  filters: {
    category: string
    minPrice: number | null
    maxPrice: number | null
  }
  setCategory: (category: string) => void
  setPriceRange: (min: number | null, max: number | null) => void
  resetFilters: () => void
}

function FiltersContent({ categories, filters, setCategory, setPriceRange }: FiltersContentProps) {
  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Category</Label>
        <Select value={filters.category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="capitalize">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Price Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="minPrice" className="text-xs text-muted-foreground">Min</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="$0"
              value={filters.minPrice || ""}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : null
                setPriceRange(value, filters.maxPrice)
              }}
            />
          </div>
          <div>
            <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">Max</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="$1000"
              value={filters.maxPrice || ""}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : null
                setPriceRange(filters.minPrice, value)
              }}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Quick Price Filters */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Quick Filters</Label>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => setPriceRange(null, 25)}
          >
            Under $25
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => setPriceRange(25, 50)}
          >
            $25 - $50
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => setPriceRange(50, 100)}
          >
            $50 - $100
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => setPriceRange(100, null)}
          >
            Over $100
          </Button>
        </div>
      </div>
    </div>
  )
}
