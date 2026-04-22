// apps/web/features/backoffice/components/admin/user-detail-dialog.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Badge } from "@workspace/ui/components/badge"
import { Label } from "@workspace/ui/components/label"
import { useEffect, useState } from "react"
import { toast } from "sonner"

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

interface UserDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function UserDetailDialog({
  open,
  onOpenChange,
  userId,
}: UserDetailDialogProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && userId) {
      fetchUser()
    }
  }, [open, userId])

  async function fetchUser() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/users/${userId}`)
      if (!res.ok) {
        throw new Error("Failed to fetch user")
      }
      const data = await res.json()
      setUser(data.user)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      toast.error("Failed to load user details")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about this user account.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : user ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{user.name || "—"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Role</Label>
                <Badge variant="outline">{user.role?.name || "User"}</Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">User ID</Label>
                <p className="font-mono text-xs">{user.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Created</Label>
                <p className="text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Last Updated</Label>
                <p className="text-sm">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Failed to load user details
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
