"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface App {
  id: string
  name: string
  slug: string
}

interface AppContextType {
  selectedAppId: string | null
  setSelectedAppId: (id: string | null) => void
  accessibleApps: App[]
  hasAllAccess: boolean
  isLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)

  // TODO: Fetch from API based on user permissions
  const accessibleApps: App[] = []
  const hasAllAccess = false
  const isLoading = false

  return (
    <AppContext.Provider
      value={{
        selectedAppId,
        setSelectedAppId,
        accessibleApps,
        hasAllAccess,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
