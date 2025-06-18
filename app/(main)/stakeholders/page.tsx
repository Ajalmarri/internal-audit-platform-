"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Filter, UserPlus, Users, Building } from "lucide-react"
import Link from "next/link"

type StakeholderStatus = "Active" | "Invited"
type StakeholderType = "Internal" | "External"

interface Stakeholder {
  id: string
  name: string
  email: string
  role: string
  type: StakeholderType
  status: StakeholderStatus
  avatar?: string // Optional for future use
}

const mockStakeholders: Stakeholder[] = [
  {
    id: "1",
    name: "Khaled M.",
    email: "khaled.m@example.com",
    role: "Lead Auditor",
    type: "Internal",
    status: "Active",
  },
  {
    id: "2",
    name: "Yema al Olman",
    email: "yema.o@example.com",
    role: "Senior Auditor",
    type: "Internal",
    status: "Active",
  },
  {
    id: "3",
    name: "Fatima H.",
    email: "fatima.h@example.com",
    role: "Business Owner",
    type: "Internal",
    status: "Active",
  },
  {
    id: "4",
    name: "External Partner Inc.",
    email: "contact@partner.com",
    role: "External Partner",
    type: "External",
    status: "Invited",
  },
  {
    id: "5",
    name: "Aisha B.",
    email: "aisha.b@example.com",
    role: "IT Manager",
    type: "Internal",
    status: "Active",
  },
  {
    id: "6",
    name: "Consulting Group LLC",
    email: "info@consulting.com",
    role: "External Consultant",
    type: "External",
    status: "Active",
  },
]

const getStatusBadgeVariant = (status: StakeholderStatus) => {
  switch (status) {
    case "Active":
      return "success"
    case "Invited":
      return "outline"
    default:
      return "default"
  }
}

const getTypeBadgeVariant = (type: StakeholderType) => {
  switch (type) {
    case "Internal":
      return "default"
    case "External":
      return "secondary"
    default:
      return "default"
  }
}

export default function StakeholdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<StakeholderType | "all">("all")

  const filteredStakeholders = useMemo(() => {
    return mockStakeholders.filter((stakeholder) => {
      const matchesSearch =
        stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stakeholder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stakeholder.role.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = filterType === "all" || stakeholder.type === filterType

      return matchesSearch && matchesType
    })
  }, [searchTerm, filterType])

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Stakeholders</h1>
          <p className="text-muted-foreground mt-1">
            Manage internal and external stakeholders involved in audit processes.
          </p>
        </div>
        <Link href="/stakeholders/new" passHref>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Stakeholder
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Smart search by name, email, or role..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter by Type
              {filterType !== "all" && (
                <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">{filterType}</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={filterType === "all"} onCheckedChange={() => setFilterType("all")}>
              All Types
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterType === "Internal"}
              onCheckedChange={() => setFilterType("Internal")}
            >
              <Users className="mr-2 h-4 w-4 text-blue-500" />
              Internal
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterType === "External"}
              onCheckedChange={() => setFilterType("External")}
            >
              <Building className="mr-2 h-4 w-4 text-purple-500" />
              External
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role/Title</TableHead>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStakeholders.length > 0 ? (
              filteredStakeholders.map((stakeholder) => (
                <TableRow key={stakeholder.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{stakeholder.name}</TableCell>
                  <TableCell className="text-muted-foreground">{stakeholder.email}</TableCell>
                  <TableCell>{stakeholder.role}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(stakeholder.type)} className="capitalize">
                      {stakeholder.type === "Internal" ? (
                        <Users className="mr-1 h-3 w-3" />
                      ) : (
                        <Building className="mr-1 h-3 w-3" />
                      )}
                      {stakeholder.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(stakeholder.status)} className="capitalize">
                      {stakeholder.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => alert(`Editing permissions for ${stakeholder.name}`)}>
                          Edit Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => alert(`Removing ${stakeholder.name}`)}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No stakeholders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {filteredStakeholders.length > 0 && (
        <p className="text-sm text-muted-foreground mt-4">
          Showing {filteredStakeholders.length} of {mockStakeholders.length} stakeholders.
        </p>
      )}
    </div>
  )
}
