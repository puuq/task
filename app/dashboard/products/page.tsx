"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import ProductsTable from "@/components/products-table"
import { ProductsSearch } from "@/components/products-search"
import { AddProductModal } from "@/components/add-product-modal"

export default function ProductsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-lg font-semibold">Products</h1>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Product Management</h2>
              <p className="text-muted-foreground">
                Manage your product inventory and pricing
              </p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
          
          <ProductsSearch />
          <ProductsTable />
        </div>
      </SidebarInset>

      {/* Add Product Modal */}
      <AddProductModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </SidebarProvider>
  )
}