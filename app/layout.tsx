import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/layout/app-sidebar"
import Header from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"
import { cookies } from "next/headers"
import { cn } from "@/lib/utils"
import MainPanel from "@/components/layout/main-panel"
import { AuthProvider } from "@/contexts/auth-context"
import ConditionalLayout from "@/components/layout/conditional-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Internal Audit Platform",
  description: "A platform for managing internal audits.",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  // Ensure defaultOpen is boolean. If cookie is not set, default to true (expanded).
  const defaultSidebarOpen = cookieStore.get("sidebar:state")?.value !== "false"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "overflow-hidden")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ConditionalLayout defaultSidebarOpen={defaultSidebarOpen}>
              {children}
            </ConditionalLayout>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
