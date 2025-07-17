"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

// This is a mock role switcher for demonstration purposes.
// In a real app, the user role would be determined by the authentication system.
function RoleSwitcher({
  role,
  setRole,
}: {
  role: string
  setRole: (role: "Admin" | "BusinessOwner") => void
}) {
  return (
    <div className="absolute top-4 right-4 z-50 flex gap-2">
      <Button size="sm" variant={role === "Admin" ? "secondary" : "outline"} onClick={() => setRole("Admin")}>
        View as Admin/Auditor
      </Button>
      <Button
        size="sm"
        variant={role === "BusinessOwner" ? "secondary" : "outline"}
        onClick={() => setRole("BusinessOwner")}
      >
        View as Business Owner
      </Button>
    </div>
  )
}

export default function DashboardLayout({
  children, // Default dashboard for admin/auditor
  businessowner,
}: {
  children: ReactNode
  businessowner: ReactNode
}) {
  const [mockRole, setMockRole] = useState<"Admin" | "BusinessOwner">("Admin")

  return (
    <div className="relative">
      <RoleSwitcher role={mockRole} setRole={setMockRole} />
      {mockRole === "BusinessOwner" ? businessowner : children}
    </div>
  )
}
