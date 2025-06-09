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
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/audit-plans", label: "Audit Plans", icon: FileText },
  { href: "/risks", label: "Risks", icon: ShieldAlert },
  { href: "/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/findings", label: "Findings", icon: ClipboardCheck },
  { href: "/action-plans", label: "Action Plans", icon: ListChecks },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/stakeholders", label: "Stakeholders", icon: Users },
  { href: "/engagements", label: "Engagements", icon: Briefcase },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const { state, isMobile } = useSidebar()

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
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
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
                <AvatarImage src="/placeholder.svg?width=40&height=40" alt="User Name" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Audit Manager</p>
              </div>
            </div>
          )}
          {state === "collapsed" && !isMobile && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-9 w-9 mx-auto cursor-pointer">
                  <AvatarImage src="/placeholder.svg?width=40&height=40" alt="User Name" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p>John Doe</p>
                <p className="text-xs text-muted-foreground">Audit Manager</p>
              </TooltipContent>
            </Tooltip>
          )}
          {state === "collapsed" && isMobile && (
            <Avatar className="h-9 w-9 mx-auto">
              <AvatarImage src="/placeholder.svg?width=40&height=40" alt="User Name" />
              <AvatarFallback>JD</AvatarFallback>
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
