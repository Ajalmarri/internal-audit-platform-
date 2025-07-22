import type React from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  businessowner: React.ReactNode
}

export default function DashboardLayout({ children, businessowner }: DashboardLayoutProps) {
  // For now, we'll just render the main dashboard (children)
  // The businessowner slot is available but not used in this layout
  return <>{children}</>
}
