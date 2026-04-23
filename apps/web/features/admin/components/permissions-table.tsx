// apps/web/features/admin/components/permissions-table.tsx
"use client"

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
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  ArrowUpDown,
  Edit,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  useReactTable,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { PermissionDialog } from "./permission-dialog"
import { Loader2 } from "lucide-react"

interface PermissionRecord {
  id: string
  name: string
  category: string
  description: string | null
  _count?: {
    rolePermissions: number
  }
}

interface PermissionsTableProps {
  data: PermissionRecord[]
  categories: string[]
  onRefresh: () => void
}

export function PermissionsTable({
  data,
  categories,
  onRefresh,
}: PermissionsTableProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] =
    useState<PermissionRecord | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [permissionToDelete, setPermissionToDelete] =
    useState<PermissionRecord | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase()

    return data.filter((permission) => {
      const matchesCategory =
        categoryFilter === "all" || permission.category === categoryFilter
      const matchesSearch =
        !query ||
        permission.name.toLowerCase().includes(query) ||
        permission.description?.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [data, categoryFilter, searchQuery])

  const handleSavePermission = async (data: {
    name: string
    category: string
    description?: string
  }) => {
    const url = editingPermission
      ? `/api/permissions/${editingPermission.id}`
      : "/api/permissions"
    const method = editingPermission ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(
        error.error || error.message || "Failed to save permission"
      )
    }

    toast.success(
      editingPermission ? "Permission updated" : "Permission created"
    )
    onRefresh()
  }

  const handleDelete = async () => {
    if (!permissionToDelete) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/permissions/${permissionToDelete.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(
          error.error || error.message || "Failed to delete permission"
        )
      }

      toast.success("Permission deleted")
      onRefresh()
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete permission:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to delete permission"
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: ColumnDef<PermissionRecord>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
            {row.getValue("name")}
          </code>
        ),
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue("category")}</Badge>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.getValue("description") || "-"}
          </span>
        ),
      },
      {
        accessorKey: "usage",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Usage
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const usageCount = row.original._count?.rolePermissions || 0
          return (
            <div className="text-center">
              <Badge
                variant={usageCount > 0 ? "default" : "secondary"}
                className="font-mono"
              >
                {usageCount}
              </Badge>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const permission = row.original
          const usageCount = permission._count?.rolePermissions || 0

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Actions">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setEditingPermission(permission)
                    setDialogOpen(true)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setPermissionToDelete(permission)
                    setDeleteDialogOpen(true)
                  }}
                  disabled={usageCount > 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable(
    useMemo(
      () => ({
        data: filteredData,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting,
        },
      }),
      [columns, filteredData, sorting]
    )
  )

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search permissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Permission
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No permissions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <PermissionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        permission={null}
        categories={categories}
        onSave={handleSavePermission}
      />
      <PermissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        permission={editingPermission}
        categories={categories}
        onSave={handleSavePermission}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{permissionToDelete?.name}</strong>?
              {permissionToDelete?._count?.rolePermissions
                ? ` This permission is used by ${permissionToDelete._count.rolePermissions} role(s).`
                : " This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={
                isDeleting ||
                (permissionToDelete?._count?.rolePermissions ?? 0) > 0
              }
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
