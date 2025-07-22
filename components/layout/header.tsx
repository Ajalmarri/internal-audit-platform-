"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
import { Card, CardContent } from "@/components/ui/card" // Added Card and CardContent
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Search, ChevronRight, Home, Briefcase, ShieldAlert, Users, FileText, AlertTriangle } from "lucide-react" // Added more icons
import Link from "next/link"
import { usePathname } from "next/navigation"

// Helper function to generate breadcrumbs (remains the same)
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

interface SearchResultItem {
  id: string
  title: string
  detail?: string
  href: string
  icon: React.ElementType
}

interface SearchResultGroup {
  category: string
  items: SearchResultItem[]
}

type SearchResults = SearchResultGroup[]

// Mock search function
const mockAllData = {
  assignments: [
    {
      id: "as1",
      title: "IT Security Compliance Check",
      detail: "Due: 2025-10-15",
      href: "/assignments/as1",
      icon: Briefcase,
    },
    {
      id: "as2",
      title: "Q3 Financial Audit",
      detail: "Status: In Progress",
      href: "/assignments/as2",
      icon: Briefcase,
    },
    {
      id: "as3",
      title: "Data Privacy Compliance Review",
      detail: "Due: 2025-11-01",
      href: "/assignments/as3",
      icon: Briefcase,
    },
  ],
  risks: [
    {
      id: "rs1",
      title: "Non-compliance with security policies",
      detail: "Severity: High",
      href: "/risks/rs1",
      icon: ShieldAlert,
    },
    {
      id: "rs2",
      title: "Data Breach Possibility",
      detail: "Severity: Critical",
      href: "/risks/rs2",
      icon: ShieldAlert,
    },
    { id: "rs3", title: "Vendor Compliance Risk", detail: "Severity: Medium", href: "/risks/rs3", icon: ShieldAlert },
  ],
  findings: [
    {
      id: "fn1",
      title: "Firewall Misconfiguration",
      detail: "Status: Open",
      href: "/findings/fn1",
      icon: AlertTriangle,
    },
    {
      id: "fn2",
      title: "Access Control Lacking for PII",
      detail: "Status: Overdue",
      href: "/findings/fn2",
      icon: AlertTriangle,
    },
  ],
  stakeholders: [
    { id: "sh1", title: "John Doe (Compliance Officer)", detail: "Internal", href: "/stakeholders/sh1", icon: Users },
    { id: "sh2", title: "External Auditors Inc.", detail: "External Partner", href: "/stakeholders/sh2", icon: Users },
  ],
  reports: [
    { id: "rp1", title: "Q2 Compliance Report", detail: "Status: Approved", href: "/reports/rp1", icon: FileText },
  ],
}

const getMockSearchResults = (query: string): SearchResults => {
  if (!query.trim()) return []
  const lowerQuery = query.toLowerCase()
  const results: SearchResults = []

  // Special case for "Compliance Check"
  if (lowerQuery.includes("compliance check")) {
    const assignment = mockAllData.assignments.find((a) => a.id === "as1")
    const risk = mockAllData.risks.find((r) => r.id === "rs1")
    if (assignment) {
      results.push({
        category: "Assignments",
        items: [assignment],
      })
    }
    if (risk) {
      results.push({
        category: "Risks",
        items: [risk],
      })
    }
    return results
  }

  const assignmentItems = mockAllData.assignments.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      (typeof item.detail === "string" && item.detail.toLowerCase().includes(lowerQuery)),
  )
  if (assignmentItems.length > 0) results.push({ category: "Assignments", items: assignmentItems })

  const riskItems = mockAllData.risks.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      (typeof item.detail === "string" && item.detail.toLowerCase().includes(lowerQuery)),
  )
  if (riskItems.length > 0) results.push({ category: "Risks", items: riskItems })

  const findingItems = mockAllData.findings.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      (typeof item.detail === "string" && item.detail.toLowerCase().includes(lowerQuery)),
  )
  if (findingItems.length > 0) results.push({ category: "Findings", items: findingItems })

  const stakeholderItems = mockAllData.stakeholders.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      (typeof item.detail === "string" && item.detail.toLowerCase().includes(lowerQuery)),
  )
  if (stakeholderItems.length > 0) results.push({ category: "Stakeholders", items: stakeholderItems })

  const reportItems = mockAllData.reports.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      (typeof item.detail === "string" && item.detail.toLowerCase().includes(lowerQuery)),
  )
  if (reportItems.length > 0) results.push({ category: "Reports", items: reportItems })

  return results
}

export default function Header() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResults>([])
  const [isResultsPanelOpen, setIsResultsPanelOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        const results = getMockSearchResults(searchQuery)
        setSearchResults(results)
        setIsResultsPanelOpen(true)
      }, 300) // Debounce search
      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
      setIsResultsPanelOpen(false)
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsResultsPanelOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const isDashboardPage = pathname === "/dashboard" || pathname.startsWith("/dashboard/")

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shrink-0">
      <div className="md:hidden">
        <SidebarTrigger className="h-8 w-8" />
      </div>
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
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <div className="relative hidden md:block" ref={searchContainerRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            type="search"
            placeholder="Smart search..."
            className="pl-9 sm:w-[200px] md:w-[250px] lg:w-[300px] h-9 rounded-md bg-muted/50 focus-visible:ring-offset-0 focus-visible:ring-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim()) setIsResultsPanelOpen(true)
            }}
          />
          {isResultsPanelOpen && (
            <Card className="absolute top-full mt-1 w-full shadow-lg z-50 bg-background border">
              <ScrollArea className="max-h-80">
                <CardContent className="p-2">
                  {searchResults.length > 0
                    ? searchResults.map((group) => (
                        <div key={group.category} className="mb-2 last:mb-0">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-1 pb-1.5">
                            {group.category}
                          </h4>
                          <ul>
                            {group.items.map((item) => (
                              <li key={item.id}>
                                <Link
                                  href={item.href}
                                  className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors duration-150"
                                  onClick={() => {
                                    setIsResultsPanelOpen(false)
                                    setSearchQuery("") // Optionally clear search query on selection
                                  }}
                                >
                                  <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                                  <div className="flex-grow overflow-hidden">
                                    <p className="font-medium text-sm truncate">{item.title}</p>
                                    {item.detail && (
                                      <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    : searchQuery.trim() && (
                        <p className="p-4 text-sm text-muted-foreground text-center">
                          No results found for "{searchQuery}"
                        </p>
                      )}
                </CardContent>
              </ScrollArea>
            </Card>
          )}
        </div>

        <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg?width=40&height=40" alt="User Profile" />
                <AvatarFallback>UA</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
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
