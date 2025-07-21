import type { ReactNode } from "react"
import Link from "next/link"
import { ShieldCheck, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock user data for layout. In a real app, this would come from a session.
const user = {
  name: "Yema al Olman",
}

export default function BusinessOwnerPortalLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-4">
          <Link href="/portal/dashboard" className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="text-lg">Audit Platform</span>
          </Link>
          <div className="ml-4 hidden border-l pl-4 md:block">
            <span className="font-medium text-muted-foreground">Business Owner Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted-foreground sm:inline-block">Welcome, {user.name}</span>
          <Button variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
