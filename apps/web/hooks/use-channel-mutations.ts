"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { App, Channel } from "@/lib/types/apps"

const APPS_QUERY_KEY = ["apps"] as const

type CreateChannelInput = {
  appId: string
  type: string
  name: string
  slug?: string
  config?: Record<string, unknown>
  isActive?: boolean
}

type UpdateChannelInput = {
  name?: string
  type?: string
  config?: Record<string, unknown>
  isActive?: boolean
}

export function useChannelMutations(
  onCloseDialog?: () => void,
  onCloseSheet?: () => void
) {
  const queryClient = useQueryClient()

  // Create Channel Mutation
  const createChannel = useMutation({
    mutationFn: async (data: CreateChannelInput) => {
      const res = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ error: "Failed to create channel" }))
        throw new Error(error.error || "Failed to create channel")
      }

      return res.json() as Promise<Channel>
    },
    onSuccess: (newChannel, variables) => {
      // Invalidate and refetch apps
      queryClient.invalidateQueries({ queryKey: APPS_QUERY_KEY })

      toast.success(`Channel "${newChannel.name}" created successfully`)
      onCloseDialog?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create channel")
    },
  })

  // Update Channel Mutation
  const updateChannel = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateChannelInput
    }) => {
      const res = await fetch(`/api/channels/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ error: "Failed to update channel" }))
        throw new Error(error.error || "Failed to update channel")
      }

      return res.json() as Promise<Channel>
    },
    onSuccess: (updatedChannel) => {
      // Invalidate and refetch apps
      queryClient.invalidateQueries({ queryKey: APPS_QUERY_KEY })

      toast.success(`Channel "${updatedChannel.name}" updated successfully`)
      onCloseDialog?.()
      onCloseSheet?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update channel")
    },
  })

  // Delete Channel Mutation
  const deleteChannel = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/channels/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ error: "Failed to delete channel" }))
        throw new Error(error.error || "Failed to delete channel")
      }

      return id
    },
    onSuccess: () => {
      // Invalidate and refetch apps
      queryClient.invalidateQueries({ queryKey: APPS_QUERY_KEY })

      toast.success("Channel deleted successfully")
      onCloseDialog?.()
      onCloseSheet?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete channel")
    },
  })

  return {
    createChannel,
    updateChannel,
    deleteChannel,
    isCreating: createChannel.isPending,
    isUpdating: updateChannel.isPending,
    isDeleting: deleteChannel.isPending,
  }
}
