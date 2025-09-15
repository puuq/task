"use client"
import React, { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useProductsStore } from "@/lib/products-store"
import { TableSkeleton } from "@/components/table-skeleton"
import { Trash2 } from "lucide-react"

export default function ProductsTable() {
  const { 
    filteredProducts, 
    loading, 
    error, 
    pagination,
    fetchProducts,
    setPage,
    setItemsPerPage,
    deleteProduct
  } = useProductsStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (loading && filteredProducts.length === 0) {
    return <TableSkeleton rows={10} columns={5} />
  }

  if (error) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-destructive mb-4">Error loading products: {error}</p>
        <Button onClick={fetchProducts} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  // Calculate paginated products
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
  const endIndex = startIndex + pagination.itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const totalPages = pagination.totalPages
    const currentPage = pagination.currentPage

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1)
        pages.push("ellipsis")
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("ellipsis")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No products found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="max-w-[400px]">
                    <Link 
                      href={`/dashboard/products/${product.id}`}
                      className="flex items-center gap-3 hover:bg-muted/50 rounded-md p-2 -m-2 transition-colors"
                    >
                      <div className="w-12 h-12 bg-white rounded border overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <p className="font-medium line-clamp-2 hover:text-primary transition-colors">
                          {product.title}
                        </p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{product.rating.rate}</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.rating.count} reviews)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      In Stock
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
                          deleteProduct(product.id)
                        }
                      }}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Items per page:</span>
            <Select value={pagination.itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  size="default"
                  onClick={(e) => {
                    e.preventDefault()
                    if (pagination.currentPage > 1) {
                      setPage(pagination.currentPage - 1)
                    }
                  }}
                  className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      size="default"
                      onClick={(e) => {
                        e.preventDefault()
                        setPage(page as number)
                      }}
                      isActive={pagination.currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  size="default"
                  onClick={(e) => {
                    e.preventDefault()
                    if (pagination.currentPage < pagination.totalPages) {
                      setPage(pagination.currentPage + 1)
                    }
                  }}
                  className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        </div>
      )}
    </div>
  )
}