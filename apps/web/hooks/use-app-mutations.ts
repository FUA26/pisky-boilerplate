"use client"

import { useCallback } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { App } from "@/lib/types/apps"

const APPS_QUERY_KEY = ["apps"] as const

type CreateAppInput = {
  name: string
  slug?: string
  description?: string
  isActive?: boolean
}

type UpdateAppInput = {
  name?: string
  slug?: string
  description?: string
  isActive?: boolean
}

export function useAppMutations(onDone?: () => void) {
  const queryClient = useQueryClient()

  // Create App Mutation
  const createApp = useMutation({
    mutationFn: async (data: CreateAppInput) => {
      const res = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ error: "Failed to create app" }))
        throw new Error(error.error || "Failed to create app")
      }

      return res.json() as Promise<App>
    },
    onSuccess: (newApp) => {
      // Invalidate and refetch apps
      queryClient.invalidateQueries({ queryKey: APPS_QUERY_KEY })

      // Or optimistically add to cache
      queryClient.setQueryData(APPS_QUERY_KEY, (old: any) => {
        if (!old?.apps) return old
        return {
          ...old,
          apps: [newApp, ...old.apps],
          pagination: {
            ...old.pagination,
            total: old.pagination.total + 1,
          },
        }
      })

      toast.success(`App "${newApp.name}" created successfully`)
      onDone?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create app")
    },
  })

  // Update App Mutation
  const updateApp = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAppInput }) => {
      const res = await fetch(`/api/apps/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ error: "Failed to update app" }))
        throw new Error(error.error || "Failed to update app")
      }

      return res.json() as Promise<App>
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: APPS_QUERY_KEY })

      // Snapshot previous value
      const previousApps = queryClient.getQueryData(APPS_QUERY_KEY)

      // Optimistically update the cache
      queryClient.setQueryData(APPS_QUERY_KEY, (old: any) => {
        if (!old?.apps) return old
        return {
          ...old,
          apps: old.apps.map((app: App) =>
            app.id === id ? { ...app, ...data } : app
          ),
        }
      })

      return { previousApps }
    },
    onError: (error: Error, _variables, context) => {
      // Rollback to previous value
      queryClient.setQueryData(APPS_QUERY_KEY, context?.previousApps)
      toast.error(error.message || "Failed to update app")
    },
    onSuccess: (updatedApp) => {
      toast.success(`App "${updatedApp.name}" updated successfully`)
      onDone?.()
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state
      queryClient.invalidateQueries({ queryKey: APPS_QUERY_KEY })
    },
  })

  // Delete App Mutation
  const deleteApp = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/apps/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ error: "Failed to delete app" }))
        throw new Error(error.error || "Failed to delete app")
      }

      return id
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: APPS_QUERY_KEY })

      // Snapshot previous value
      const previousApps = queryClient.getQueryData(APPS_QUERY_KEY)

      // Optimistically remove from cache
      queryClient.setQueryData(APPS_QUERY_KEY, (old: any) => {
        if (!old?.apps) return old
        const deletedApp = old.apps.find((app: App) => app.id === id)
        return {
          ...old,
          apps: old.apps.filter((app: App) => app.id !== id),
          pagination: {
            ...old.pagination,
            total: old.pagination.total - 1,
          },
        }
      })

      return { previousApps }
    },
    onError: (error: Error, _variables, context) => {
      // Rollback to previous value
      queryClient.setQueryData(APPS_QUERY_KEY, context?.previousApps)
      toast.error(error.message || "Failed to delete app")
    },
    onSuccess: (_id, _variables, context) => {
      const previousApps = context?.previousApps as any
      const deletedApp = previousApps?.apps?.find(
        (app: App) => app.id === _variables
      )
      toast.success(`App "${deletedApp?.name || "App"}" deleted successfully`)
      onDone?.()
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state
      queryClient.invalidateQueries({ queryKey: APPS_QUERY_KEY })
    },
  })

  return {
    createApp,
    updateApp,
    deleteApp,
    isCreating: createApp.isPending,
    isUpdating: updateApp.isPending,
    isDeleting: deleteApp.isPending,
  }
}
