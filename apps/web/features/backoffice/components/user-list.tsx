"use client"

import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Badge, badgeVariants } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "sonner"
import {
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  UserPlusIcon,
} from "lucide-react"
import { UserDialog } from "./admin/user-dialog"
import { UserDetailDialog } from "./admin/user-detail-dialog"

// Types
interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  roleId: string
  createdAt: string
  updatedAt: string
  role?: {
    id: string
    name: string
  }
}

interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

export function UserList() {
  const [users, setUsers] = React.useState<User[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [pageSize] = React.useState(10)
  const [totalCount, setTotalCount] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(0)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean
    user: User | null
  }>({ open: false, user: null })
  const [bulkDeleteDialog, setBulkDeleteDialog] = React.useState(false)
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [editDialog, setEditDialog] = React.useState<{
    open: boolean
    userId: string
  }>({
    open: false,
    userId: "",
  })
  const [detailDialog, setDetailDialog] = React.useState<{
    open: boolean
    userId: string
  }>({
    open: false,
    userId: "",
  })

  const fetchUsers = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
      })

      const response = await fetch(`/api/users?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data: UsersResponse = await response.json()
      setUsers(data.users)
      setTotalCount(data.pagination.totalCount)
      setTotalPages(data.pagination.totalPages)
    } catch {
      toast.error("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize, search])

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [fetchUsers])

  const handleDelete = async () => {
    const user = deleteDialog.user
    if (!user) return

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      toast.success("User deleted successfully")
      setDeleteDialog({ open: false, user: null })
      fetchUsers()
    } catch {
      toast.error("Failed to delete user")
    }
  }

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`/api/users/${id}`, { method: "DELETE" })
        )
      )

      toast.success(
        `${selectedIds.size} user${selectedIds.size > 1 ? "s" : ""} deleted successfully`
      )
      setSelectedIds(new Set())
      setBulkDeleteDialog(false)
      fetchUsers()
    } catch {
      toast.error("Failed to delete users")
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const allSelected = users.length > 0 && selectedIds.size === users.length
  const someSelected = selectedIds.size > 0

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(users.map((u) => u.id)))
    }
  }

  const toggleOne = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? "user" : "users"}
            {someSelected && (
              <span className="ml-2 font-medium text-foreground">
                ({selectedIds.size} selected)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-64 pl-9"
            />
          </div>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <PlusIcon className="size-4" />
            Add User
          </Button>
          {someSelected && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setBulkDeleteDialog(true)}
            >
              <TrashIcon className="size-4" />
              Delete ({selectedIds.size})
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all users"
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64">
                  <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                      <UserPlusIcon className="size-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {search
                          ? "No users found matching your search"
                          : "No users yet"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {search
                          ? "Try adjusting your search terms"
                          : "Get started by creating your first user account"}
                      </p>
                    </div>
                    {!search && (
                      <Button
                        size="sm"
                        onClick={() => setCreateDialogOpen(true)}
                      >
                        <PlusIcon className="size-4" />
                        Create User
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(user.id)}
                      onCheckedChange={() => toggleOne(user.id)}
                      aria-label={`Select ${user.name || user.email}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {user.name || "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {user.role?.name || "User"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon-sm" variant="ghost">
                          <MoreVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            setDetailDialog({ open: true, userId: user.id })
                          }
                        >
                          <EyeIcon className="size-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setEditDialog({ open: true, userId: user.id })
                          }
                        >
                          <PencilIcon className="size-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleteDialog({ open: true, user })}
                        >
                          <TrashIcon className="size-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, totalCount)} of {totalCount} users
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum =
                  totalPages > 5
                    ? page <= 3
                      ? i + 1
                      : page >= totalPages - 2
                        ? totalPages - 4 + i
                        : page - 2 + i
                    : i + 1
                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={page === pageNum ? "default" : "outline"}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Single Delete Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {deleteDialog.user?.name || deleteDialog.user?.email}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={bulkDeleteDialog} onOpenChange={setBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Users</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedIds.size}</strong> user
              {selectedIds.size > 1 ? "s" : ""}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Create/Edit Dialogs */}
      <UserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        mode="create"
        onSuccess={fetchUsers}
      />
      <UserDialog
        open={editDialog.open}
        onOpenChange={(open) =>
          setEditDialog({ open, userId: open ? editDialog.userId : "" })
        }
        mode="edit"
        userId={editDialog.userId}
        onSuccess={fetchUsers}
      />
      <UserDetailDialog
        open={detailDialog.open}
        onOpenChange={(open) =>
          setDetailDialog({ open, userId: open ? detailDialog.userId : "" })
        }
        userId={detailDialog.userId}
      />
    </>
  )
}
