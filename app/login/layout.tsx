import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In | Audit Platform",
  description: "Sign in to the Audit Platform for the Dubai Future Foundation.",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout ensures the login page doesn't inherit the main app's sidebars or headers
  return <>{children}</>
}
