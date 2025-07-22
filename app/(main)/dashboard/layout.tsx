"use client"

import { useState, useEffect } from "react"
import type React from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  businessowner: React.ReactNode
}

// Mock user role - in a real app, this would come from authentication context
const getUserRole = (): "auditor" | "business_owner" => {
  // For demo purposes, we'll use localStorage to simulate role switching
  if (typeof window !== "undefined") {
    const savedRole = localStorage.getItem("userRole")
    return (savedRole as "auditor" | "business_owner") || "auditor"
  }
  return "auditor"
}

export default function DashboardLayout({ children, businessowner }: DashboardLayoutProps) {
  const [userRole, setUserRole] = useState<"auditor" | "business_owner">("auditor")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setUserRole(getUserRole())
  }, [])

  const handleRoleSwitch = (role: "auditor" | "business_owner") => {
    setUserRole(role)
    localStorage.setItem("userRole", role)
  }

  if (!isClient) {
    // Show loading state during hydration
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
            <div className="h-7 w-48 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-36 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 h-64 bg-muted rounded-lg animate-pulse"></div>
          <div className="lg:col-span-1 h-64 bg-muted rounded-lg animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Role Switcher - For demo purposes */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <span className="text-sm font-medium">Current Role:</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleRoleSwitch("auditor")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              userRole === "auditor" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
            }`}
          >
            Auditor
          </button>
          <button
            onClick={() => handleRoleSwitch("business_owner")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              userRole === "business_owner" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
            }`}
          >
            Business Owner
          </button>
        </div>
      </div>

      {/* Conditional Dashboard Rendering */}
      {userRole === "business_owner" ? businessowner : children}
    </div>
  )
}
