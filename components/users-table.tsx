"use client"
import React, { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Mail, Phone } from "lucide-react"
import { useUsersStore } from "@/lib/users-store"
import { TableSkeleton } from "@/components/table-skeleton"

export default function UsersTable() {
  const { 
    filteredUsers, 
    loading, 
    error, 
    filters,
    fetchUsers
  } = useUsersStore()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  if (loading && filteredUsers.length === 0) {
    return <TableSkeleton rows={8} columns={7} />
  }

  if (error) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-destructive mb-4">Error loading users: {error}</p>
        <Button onClick={fetchUsers} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  const getUserStatus = (userId: number) => {
    // Mock logic: odd IDs are active, even IDs are inactive
    return userId % 2 === 1 ? "active" : "inactive"
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No users found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => {
              const status = getUserStatus(user.id)
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    #{user.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <span className="text-xs font-medium text-primary">
                          {user.name.firstname.charAt(0).toUpperCase()}
                          {user.name.lastname.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {user.name.firstname} {user.name.lastname}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {user.username}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{user.address.city}</p>
                      <p className="text-muted-foreground text-xs">
                        {user.address.street} {user.address.number}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status === "active" ? "outline" : "secondary"}>
                      {status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}