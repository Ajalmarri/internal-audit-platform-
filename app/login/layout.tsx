import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In | Audit Platform",
  description: "Sign in to the Audit Platform for the Dubai Future Foundation.",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  // This layout ensures the login page is full-screen and does not
  // inherit the main application's sidebars, headers, or other UI elements.
  return <>{children}</>
}
