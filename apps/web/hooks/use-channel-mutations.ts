"use client"

import { useCallback } from "react"

export function useChannelMutations(
  onCloseDialog: () => void,
  onCloseSheet: () => void
) {
  const createChannel = useCallback(
    async (data: unknown) => {
      await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => undefined)
      onCloseDialog()
    },
    [onCloseDialog]
  )

  const updateChannel = useCallback(
    async ({ id, data }: { id: string; data: unknown }) => {
      await fetch(`/api/channels/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => undefined)
      onCloseDialog()
      onCloseSheet()
    },
    [onCloseDialog, onCloseSheet]
  )

  const deleteChannel = useCallback(
    async (id: string) => {
      await fetch(`/api/channels/${id}`, { method: "DELETE" }).catch(
        () => undefined
      )
      onCloseDialog()
      onCloseSheet()
    },
    [onCloseDialog, onCloseSheet]
  )

  return { createChannel, updateChannel, deleteChannel }
}
