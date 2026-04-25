"use client"

import { useCallback } from "react"

export function useAppMutations(onDone: () => void) {
  const createApp = useCallback(
    async (data: unknown) => {
      await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => undefined)
      onDone()
    },
    [onDone]
  )

  const updateApp = useCallback(
    async ({ id, data }: { id: string; data: unknown }) => {
      await fetch(`/api/apps/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => undefined)
      onDone()
    },
    [onDone]
  )

  const deleteApp = useCallback(
    async (id: string) => {
      await fetch(`/api/apps/${id}`, { method: "DELETE" }).catch(
        () => undefined
      )
      onDone()
    },
    [onDone]
  )

  return { createApp, updateApp, deleteApp }
}
