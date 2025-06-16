"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ThemeToggle from "@/components/theme-toggle"
import LanguageSwitcher from "@/components/language-switcher"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  ShieldAlert,
  ClipboardList,
  ClipboardCheck,
  ListChecks,
  BarChart3,
  Settings,
  BuildingIcon,
  Users,
  Briefcase,
  ShieldCheck,
  FileQuestion,
  Bell,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useMockUser, type UserRole } from "@/hooks/use-mock-user" // Ensure type UserRole is imported if needed elsewhere

// Define all possible menu items with the roles that can see them
const allMenuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Auditor", "Audit Manager"] as UserRole[] },
  {
    href: "/dashboard/business-owner",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["Business Owner"] as UserRole[],
  },
  { href: "/audit-plans", label: "Audit Plans", icon: FileText, roles: ["Auditor", "Audit Manager"] as UserRole[] },
  { href: "/risks", label: "Risks", icon: ShieldAlert, roles: ["Auditor", "Audit Manager"] as UserRole[] },
  { href: "/controls", label: "Controls", icon: ShieldCheck, roles: ["Auditor", "Audit Manager"] as UserRole[] },
  {
    href: "/assignments",
    label: "Assignments",
    icon: ClipboardList,
    roles: ["Auditor", "Audit Manager"] as UserRole[],
  },
  {
    href: "/findings",
    label: "Findings",
    icon: ClipboardCheck,
    roles: ["Auditor", "Audit Manager", "Business Owner"] as UserRole[],
  },
  {
    href: "/action-plans",
    label: "Action Plans",
    icon: ListChecks,
    roles: ["Auditor", "Audit Manager", "Business Owner"] as UserRole[],
  },
  { href: "/reports", label: "Reports", icon: BarChart3, roles: ["Auditor", "Audit Manager"] as UserRole[] },
  { href: "/stakeholders", label: "Stakeholders", icon: Users, roles: ["Audit Manager"] as UserRole[] },
  { href: "/engagements", label: "Engagements", icon: Briefcase, roles: ["Audit Manager"] as UserRole[] },
  // Example items for Business Owner - adjust icons and paths as needed
  { href: "/requests", label: "My Requests", icon: FileQuestion, roles: ["Business Owner"] as UserRole[] },
  { href: "/notifications", label: "Notifications", icon: Bell, roles: ["Business Owner"] as UserRole[] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["Auditor", "Audit Manager"] as UserRole[] },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const { state, isMobile } = useSidebar()
  const { user } = useMockUser() // Get the current mock user

  // Filter menu items based on the user's role
  const visibleMenuItems = allMenuItems.filter((item) => item.roles.includes(user.role))

  // Determine the correct dashboard link based on role
  const dashboardHref = user.role === "Business Owner" ? "/dashboard/business-owner" : "/dashboard"

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon" side="left" variant="sidebar">
        <SidebarHeader className="p-4 flex items-center gap-2.5">
          {/* Ensure the main platform logo/link also considers the dashboard href */}
          <Link href={dashboardHref} className="flex items-center gap-2.5">
            <BuildingIcon className="w-7 h-7 text-primary flex-shrink-0" />
            {state === "expanded" && (
              <h1 className="text-xl font-bold text-primary whitespace-nowrap">Audit Platform</h1>
            )}
          </Link>
        </SidebarHeader>

        <SidebarContent className="flex-1">
          <SidebarMenu>
            {visibleMenuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname === item.href ||
                    // More robust active state logic:
                    // 1. Exact match
                    // 2. For non-dashboard base paths, check if current path starts with item.href
                    //    (e.g., /findings/ID should activate /findings)
                    // 3. Special handling for the active dashboard (main or business-owner)
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      !item.href.startsWith("/dashboard/business-owner") &&
                      pathname.startsWith(item.href)) ||
                    (item.href === dashboardHref && pathname === dashboardHref) || // Active if it's the user's specific dashboard
                    (item.href === "/dashboard" &&
                      user.role !== "Business Owner" &&
                      pathname.startsWith("/dashboard") &&
                      !pathname.startsWith("/dashboard/business-owner")) || // Auditor dashboard active for subpaths
                    (item.href === "/dashboard/business-owner" &&
                      user.role === "Business Owner" &&
                      pathname.startsWith("/dashboard/business-owner")) // BO dashboard active for subpaths
                  }
                  tooltip={{ children: item.label, side: "right", align: "center" }}
                  className="[&>svg]:shrink-0"
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-3 space-y-3">
          {state === "expanded" && (
            <div className="flex items-center gap-3 px-1">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user.avatarUrl || "/placeholder.svg?width=40&height=40&query=User+Avatar"}
                  alt={user.name}
                />
                <AvatarFallback>{user.fallback}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.title}</p>
              </div>
            </div>
          )}
          {state === "collapsed" && !isMobile && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-9 w-9 mx-auto cursor-pointer">
                  <AvatarImage
                    src={user.avatarUrl || "/placeholder.svg?width=40&height=40&query=User+Avatar"}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.fallback}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p>{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.title}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {state === "collapsed" && isMobile && (
            <Avatar className="h-9 w-9 mx-auto">
              <AvatarImage
                src={user.avatarUrl || "/placeholder.svg?width=40&height=40&query=User+Avatar"}
                alt={user.name}
              />
              <AvatarFallback>{user.fallback}</AvatarFallback>
            </Avatar>
          )}

          <div
            className={cn(
              "flex items-center",
              state === "expanded" ? "flex-col gap-1.5" : "justify-center flex-col gap-2",
            )}
          >
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          {state === "expanded" && <p className="text-xs text-muted-foreground text-center pt-1">Version 1.0.0</p>}
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}
