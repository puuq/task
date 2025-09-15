"use client"
import React from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useUsersStore } from "@/lib/users-store"

const statusOptions = [
  { value: "all", label: "All Users" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export function UsersSearch() {
  const { 
    filters, 
    setSearch, 
    setStatus, 
    resetFilters,
    pagination 
  } = useUsersStore()

  const hasActiveFilters = filters.search || filters.status !== "all"

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, username..."
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filters.status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button 
              onClick={resetFilters} 
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
          {filters.status !== "all" && (
            <Badge variant="secondary">
              Status: {statusOptions.find(s => s.value === filters.status)?.label}
              <button
                onClick={() => setStatus("all")}
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
        Showing {pagination.totalItems} users
      </div>
    </div>
  )
}