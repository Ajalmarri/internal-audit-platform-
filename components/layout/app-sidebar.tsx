"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import ThemeToggle from "@/components/theme-toggle"
import LanguageSwitcher from "@/components/language-switcher"
import { useAuth } from "@/contexts/auth-context"
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
  Archive,
  MapIcon as Sitemap,
  Gauge,
  History,
  CheckSquare,
  BookHeart,
  BarChartHorizontalBig,
  Search,
} from "lucide-react"

const menuGroups = [
  {
    title: "Main",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Audit Cycle",
    items: [
      { href: "/audit-plans", label: "Audit Plans", icon: FileText },
      { href: "/engagements", label: "Engagements", icon: Briefcase },
      { href: "/assignments", label: "Assignments", icon: ClipboardList },
      { href: "/findings", label: "Findings", icon: ClipboardCheck },
      { href: "/csv-findings", label: "CSV Findings", icon: FileText },
      { href: "/action-plans", label: "Action Plans", icon: ListChecks },
    ],
  },
  {
    title: "Governance",
    items: [
      { href: "/risks", label: "Risks", icon: ShieldAlert },
      { href: "/controls", label: "Controls", icon: ShieldCheck },
      { href: "/audit-universe", label: "Audit Universe", icon: Sitemap },
    ],
  },
  {
    title: "Analytics & Reporting",
    items: [
      { href: "/reports", label: "Reports", icon: BarChart3 },
      { href: "/executive-command-center", label: "Executive Command Center", icon: Gauge },
      { href: "/data-analytics-hub", label: "Analytics Hub", icon: BarChartHorizontalBig },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: "/stakeholders", label: "Stakeholders", icon: Users },
      { href: "/evidence-locker", label: "Evidence Locker", icon: Archive },
      { href: "/knowledge-center", label: "Knowledge Center", icon: BookHeart },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/global-activity-log", label: "Global Activity Log", icon: History },
      { href: "/quality-assurance-reviews", label: "Quality Assurance", icon: CheckSquare },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const [state, setState] = useState<"expanded" | "collapsed">("expanded")
  const [isMobile, setIsMobile] = useState(false)
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMenuGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase())),
    }))
    .filter((group) => group.items.length > 0)

  const defaultOpen = menuGroups.findIndex((group) => group.items.some((item) => pathname.startsWith(item.href)))

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon" side="left" variant="sidebar" className="flex flex-col">
        <SidebarHeader className="p-4 flex items-center gap-2.5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <BuildingIcon className="w-7 h-7 text-primary flex-shrink-0" />
            {state === "expanded" && (
              <h1 className="text-xl font-bold text-primary whitespace-nowrap">Audit Platform</h1>
            )}
          </Link>
        </SidebarHeader>

        {state === "expanded" && (
          <div className="px-4 mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          </div>
        )}

        <SidebarContent className="flex-1 overflow-y-auto">
          {state === "expanded" ? (
            <Accordion
              type="single"
              collapsible
              defaultValue={`item-${defaultOpen > -1 ? defaultOpen : 0}`}
              className="w-full px-2"
            >
              {filteredMenuGroups.map((group, groupIndex) => (
                <AccordionItem value={`item-${groupIndex}`} key={group.title} className="border-b-0">
                  <AccordionTrigger className="py-2 px-2 text-sm font-semibold text-muted-foreground hover:no-underline hover:bg-muted/50 rounded-md [&[data-state=open]>svg]:rotate-180">
                    {group.title}
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-0">
                    <div className="flex flex-col space-y-1">
                      {group.items.map((item) => (
                        <Button
                          key={item.href}
                          asChild
                          variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                          className="justify-start h-9"
                        >
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center space-y-2 px-2">
              {menuGroups
                .flatMap((group) => group.items)
                .map((item) => (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                        className="w-10 h-10 p-0"
                      >
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          )}
        </SidebarContent>

        <SidebarFooter className="p-3 space-y-3 mt-auto border-t">
          {state === "expanded" && (
            <div className="flex items-center gap-3 px-1">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg?width=40&height=40" alt="User Name" />
                <AvatarFallback>
                  {user && user.firstName && user.lastName ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : "UA"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {user && user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user && user.roleName ? user.roleName : "Unknown Role"}
                </p>
              </div>
            </div>
          )}
          {state === "collapsed" && !isMobile && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-9 w-9 mx-auto cursor-pointer">
                  <AvatarImage src="/placeholder.svg?width=40&height=40" alt="User Name" />
                  <AvatarFallback>
                    {user && user.firstName && user.lastName ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : "UA"}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p>{user && user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "User"}</p>
                <p className="text-xs text-muted-foreground">
                  {user && user.roleName ? user.roleName : "Unknown Role"}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
          {state === "collapsed" && isMobile && (
            <Avatar className="h-9 w-9 mx-auto">
              <AvatarImage src="/placeholder.svg?width=40&height=40" alt="User Name" />
              <AvatarFallback>
                {user && user.firstName && user.lastName ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : "UA"}
              </AvatarFallback>
            </Avatar>
          )}

          <div
            className={cn(
              "flex items-center",
              state === "expanded" ? "justify-between" : "justify-center flex-col gap-2",
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
