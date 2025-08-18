"use client"

import { useAuth } from "@/contexts/auth-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/layout/app-sidebar"
import Header from "@/components/layout/header"
import MainPanel from "@/components/layout/main-panel"
import { Loader2 } from "lucide-react"

interface ConditionalLayoutProps {
  children: React.ReactNode
  defaultSidebarOpen: boolean
}

export default function ConditionalLayout({ children, defaultSidebarOpen }: ConditionalLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()

  // Debug logging
  console.log('ConditionalLayout - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading)

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('ConditionalLayout - Showing loading state')
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // For unauthenticated users, show a simple layout without sidebar/header
  if (!isAuthenticated) {
    console.log('ConditionalLayout - Showing simple layout for unauthenticated user')
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    )
  }

  // For authenticated users, show the full layout with sidebar and header
  console.log('ConditionalLayout - Showing full layout for authenticated user')
  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <MainPanel>
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/30">{children}</main>
        </MainPanel>
      </div>
    </SidebarProvider>
  )
}
