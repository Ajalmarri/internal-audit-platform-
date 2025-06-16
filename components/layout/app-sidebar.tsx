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
import { useMockUser } from "@/hooks/use-mock-user"

// Define all possible menu items with the roles that can see them
const allMenuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Auditor", "Audit Manager"] },
  { href: "/dashboard/business-owner", label: "Dashboard", icon: LayoutDashboard, roles: ["Business Owner"] },
  { href: "/audit-plans", label: "Audit Plans", icon: FileText, roles: ["Auditor", "Audit Manager"] },
  { href: "/risks", label: "Risks", icon: ShieldAlert, roles: ["Auditor", "Audit Manager"] },
  { href: "/controls", label: "Controls", icon: ShieldCheck, roles: ["Auditor", "Audit Manager"] },
  { href: "/assignments", label: "Assignments", icon: ClipboardList, roles: ["Auditor", "Audit Manager"] },
  { href: "/findings", label: "Findings", icon: ClipboardCheck, roles: ["Auditor", "Audit Manager", "Business Owner"] },
  {
    href: "/action-plans",
    label: "Action Plans",
    icon: ListChecks,
    roles: ["Auditor", "Audit Manager", "Business Owner"],
  },
  { href: "/reports", label: "Reports", icon: BarChart3, roles: ["Auditor", "Audit Manager"] },
  { href: "/stakeholders", label: "Stakeholders", icon: Users, roles: ["Audit Manager"] },
  { href: "/engagements", label: "Engagements", icon: Briefcase, roles: ["Audit Manager"] },
  { href: "/requests", label: "My Requests", icon: FileQuestion, roles: ["Business Owner"] },
  { href: "/notifications", label: "Notifications", icon: Bell, roles: ["Business Owner"] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["Auditor", "Audit Manager"] },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const { state, isMobile } = useSidebar()
  const { user } = useMockUser() // Get the current mock user

  // Filter menu items based on the user's role
  const visibleMenuItems = allMenuItems.filter((item) => item.roles.includes(user.role))

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon" side="left" variant="sidebar">
        <SidebarHeader className="p-4 flex items-center gap-2.5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
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
                    (item.href !== "/dashboard" && !item.href.includes("/dashboard") && pathname.startsWith(item.href))
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
                <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
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
                  <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
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
              <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
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
