"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Helper function to generate breadcrumbs
const generateBreadcrumbs = (pathname: string) => {
  const pathParts = pathname.split("/").filter((part) => part)
  const breadcrumbs = [{ href: "/", label: "Home", icon: Home, isCurrent: pathname === "/" }]

  let currentPath = ""
  pathParts.forEach((part, index) => {
    currentPath += `/${part}`
    breadcrumbs.push({
      href: currentPath,
      label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
      icon: null,
      isCurrent: index === pathParts.length - 1,
    })
  })
  return breadcrumbs
}

export default function Header() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shrink-0">
      {" "}
      {/* Added z-30 and shrink-0 */}
      <div className="md:hidden">
        {" "}
        {/* Group trigger for mobile */}
        <SidebarTrigger className="h-8 w-8" />
      </div>
      {/* Breadcrumbs for larger screens */}
      <nav className="hidden md:flex items-center text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1.5 text-muted-foreground" />}
            {crumb.isCurrent ? (
              <span className="font-medium text-foreground">
                {crumb.icon && index === 0 ? (
                  <span className="flex items-center gap-1.5">
                    <crumb.icon className="h-4 w-4" /> {crumb.label}
                  </span>
                ) : (
                  crumb.label
                )}
              </span>
            ) : (
              <Link href={crumb.href} className="text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                {crumb.icon && index === 0 && <crumb.icon className="h-4 w-4" />}
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3 md:gap-4">
        {" "}
        {/* Adjusted gap */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />{" "}
          {/* Centered icon */}
          <Input
            type="search"
            placeholder="Smart search..."
            className="pl-9 sm:w-[200px] md:w-[250px] lg:w-[300px] h-9 rounded-md bg-muted/50 focus-visible:ring-offset-0 focus-visible:ring-1" // Adjusted padding and styling
          />
        </div>
        <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9">
          <Bell className="h-5 w-5" />
          {/* Simulated notification dot */}
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              {" "}
              {/* Removed padding for better avatar fit */}
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg?width=40&height=40" alt="User Profile" />
                <AvatarFallback>UA</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {" "}
            {/* Added width */}
            <DropdownMenuLabel>
              <p className="font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">audit.manager@example.com</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
