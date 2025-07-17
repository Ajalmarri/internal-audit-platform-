import type { ReactNode } from "react"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock user data for layout. In a real app, this would come from a session.
const user = {
  name: "Jane Doe",
}

export default function BusinessOwnerPortalLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-4">
          <Link href="/portal/dashboard" className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="text-lg">Audit Platform</span>
          </Link>
          <div className="ml-4 border-l pl-4">
            <span className="font-medium text-muted-foreground">Business Owner Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
