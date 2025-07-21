import type { ReactNode } from "react"
import Link from "next/link"
import { ShieldCheck, LayoutDashboard, ClipboardCheck, Archive, BookHeart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock user data for the portal layout
const user = {
  name: "Yema al Olman",
  role: "Finance Department Head",
  avatar: "/placeholder.svg?width=40&height=40",
  fallback: "YO",
}

const navItems = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "#", label: "My Action Items", icon: ClipboardCheck },
  { href: "#", label: "Evidence Requests", icon: Archive },
  { href: "#", label: "Knowledge Center", icon: BookHeart },
]

export default function BusinessOwnerPortalLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="flex h-screen w-64 flex-col border-r bg-background">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/portal/dashboard" className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span>Audit Platform</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.fallback}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <h1 className="text-xl font-semibold">Welcome back, {user.name.split(" ")[0]}!</h1>
          <Button variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
