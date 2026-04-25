"use client"

import { useCallback, useState } from "react"
import type { App } from "@/lib/types/apps"

type AppFormData = {
  name: string
  slug: string
  description: string
  isActive: boolean
}

export function useAppDialog() {
  const [dialog, setDialog] = useState<{
    open: boolean
    mode: "create" | "edit"
    app: App | null
  }>({
    open: false,
    mode: "create",
    app: null,
  })
  const [formData, setFormData] = useState<AppFormData>({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  })

  const resetForm = useCallback((app?: App | null) => {
    setFormData({
      name: app?.name ?? "",
      slug: app?.slug ?? "",
      description: app?.description ?? "",
      isActive: app?.isActive ?? true,
    })
  }, [])

  const openCreate = useCallback(() => {
    setDialog({ open: true, mode: "create", app: null })
    resetForm(null)
  }, [resetForm])

  const openEdit = useCallback(
    (app: App) => {
      setDialog({ open: true, mode: "edit", app })
      resetForm(app)
    },
    [resetForm]
  )

  const close = useCallback(() => {
    setDialog({ open: false, mode: "create", app: null })
  }, [])

  const setOpen = useCallback((open: boolean) => {
    setDialog((prev) => ({ ...prev, open }))
  }, [])

  const formatSlug = useCallback(
    (value: string) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    []
  )

  const dispatchForm = useCallback(
    (
      action:
        | { type: "SET_NAME"; name: string }
        | { type: "SET_SLUG"; slug: string }
        | { type: "SET_DESCRIPTION"; description: string }
        | { type: "SET_ACTIVE"; isActive: boolean }
    ) => {
      setFormData((prev) => {
        switch (action.type) {
          case "SET_NAME":
            return { ...prev, name: action.name }
          case "SET_SLUG":
            return { ...prev, slug: action.slug }
          case "SET_DESCRIPTION":
            return { ...prev, description: action.description }
          case "SET_ACTIVE":
            return { ...prev, isActive: action.isActive }
        }
      })
    },
    []
  )

  const validate = useCallback(() => {
    if (!formData.name.trim()) return "App name is required"
    if (!formData.slug.trim()) return "App slug is required"
    return null
  }, [formData])

  const getCreatePayload = useCallback(() => formData, [formData])
  const getUpdatePayload = useCallback(() => {
    if (!dialog.app) return null
    return {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      isActive: formData.isActive,
    }
  }, [dialog.app, formData])

  return {
    dialog,
    formData,
    openCreate,
    openEdit,
    close,
    setOpen,
    dispatchForm,
    formatSlug,
    validate,
    getCreatePayload,
    getUpdatePayload,
  }
}
