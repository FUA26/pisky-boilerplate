"use client"

import { useCallback, useState } from "react"
import type { App, Channel, ChannelType } from "@/lib/types/apps"

type ChannelFormData = {
  name: string
  type: string
  isActive: boolean
}

export function useChannelDialog() {
  const [dialog, setDialog] = useState<{
    open: boolean
    mode: "create" | "edit"
    app: App | null
    channel: Channel | null
  }>({
    open: false,
    mode: "create",
    app: null,
    channel: null,
  })
  const [sheet, setSheet] = useState<{
    open: boolean
    app: App | null
    channel: Channel | null
  }>({
    open: false,
    app: null,
    channel: null,
  })
  const [formData, setFormData] = useState<ChannelFormData>({
    name: "",
    type: "WEB_FORM",
    isActive: true,
  })

  const resetForm = useCallback((channel?: Channel | null) => {
    setFormData({
      name: channel?.name ?? "",
      type: channel?.type ?? "WEB_FORM",
      isActive: channel?.isActive ?? true,
    })
  }, [])

  const openCreate = useCallback(
    (app: App) => {
      setDialog({ open: true, mode: "create", app, channel: null })
      resetForm(null)
    },
    [resetForm]
  )

  const openSheet = useCallback(
    (app: App, channel: Channel) => {
      setSheet({ open: true, app, channel })
      resetForm(channel)
    },
    [resetForm]
  )

  const closeDialog = useCallback(
    () => setDialog((prev) => ({ ...prev, open: false })),
    []
  )
  const closeSheet = useCallback(
    () => setSheet((prev) => ({ ...prev, open: false })),
    []
  )
  const setDialogOpen = useCallback(
    (open: boolean) => setDialog((prev) => ({ ...prev, open })),
    []
  )
  const setSheetOpen = useCallback(
    (open: boolean) => setSheet((prev) => ({ ...prev, open })),
    []
  )

  const dispatchForm = useCallback(
    (
      action:
        | { type: "SET_NAME"; name: string }
        | { type: "SET_TYPE"; channelType: ChannelType }
        | { type: "SET_ACTIVE"; isActive: boolean }
    ) => {
      setFormData((prev) => {
        switch (action.type) {
          case "SET_NAME":
            return { ...prev, name: action.name }
          case "SET_TYPE":
            return { ...prev, type: action.channelType }
          case "SET_ACTIVE":
            return { ...prev, isActive: action.isActive }
        }
      })
    },
    []
  )

  const validate = useCallback(() => {
    if (!formData.name.trim()) return "Channel name is required"
    if (!formData.type.trim()) return "Channel type is required"
    return null
  }, [formData])

  const isEditMode = useCallback(
    () => dialog.mode === "edit" || sheet.open,
    [dialog.mode, sheet.open]
  )

  const getCreatePayload = useCallback(() => ({ ...formData }), [formData])
  const getUpdatePayload = useCallback(() => ({ ...formData }), [formData])

  return {
    dialog,
    sheet,
    formData,
    openCreate,
    openSheet,
    closeDialog,
    closeSheet,
    setDialogOpen,
    setSheetOpen,
    dispatchForm,
    validate,
    isEditMode,
    getCreatePayload,
    getUpdatePayload,
  }
}
