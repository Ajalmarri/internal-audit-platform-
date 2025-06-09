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

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Internal Audit Platform",
  description: "A platform for managing internal audits.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  // Ensure defaultOpen is boolean. If cookie is not set, default to true (expanded).
  const defaultSidebarOpen = cookieStore.get("sidebar:state")?.value !== "false"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "overflow-hidden")}>
        {" "}
        {/* Prevent body scroll when sidebar is fixed */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider defaultOpen={defaultSidebarOpen}>
            <div className="flex h-screen w-full bg-background">
              <AppSidebar />
              <div className="flex flex-col flex-1 h-screen overflow-y-auto">
                {" "}
                {/* Make content area scrollable */}
                <Header />
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/30">{children}</main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
