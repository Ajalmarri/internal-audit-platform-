import type React from "react"

// This layout ensures that the login page is rendered in isolation,
// without any of the main application's UI elements like sidebars or headers.
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
