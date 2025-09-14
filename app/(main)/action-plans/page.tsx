"use client"

import type React from "react"
import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  SlidersHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Rocket,
  AlertTriangle,
} from "lucide-react"

import { useEffect } from "react"

// Real data interface matching the database schema
interface ActionPlanFromDB {
  id: string
  description: string
  responsible_id: string
  due_date: string
  status_id: number
  finding_id: string
  finding_title: string
  finding_description: string
  objective: string
  priority_id: number
  priority_name: string
  effort: string
  created_date: string
  is_approved: boolean
}

// Simple ActionPlan interface for the UI
interface ActionPlan {
  id: string
  description: string
  responsible_id: string
  due_date: string
  status_id: number
  finding_id: string
  finding_title: string
  finding_description: string
  objective: string
  priority_id: number
  priority_name: string
  effort: string
  created_date: string
  is_approved: boolean
  status: "Not Started" | "In Progress" | "Completed"
}

// Configuration for Action Plan Status display - Updated
const actionPlanStatusConfig: Record<
  string,
  { icon: React.ElementType; color: string; badgeVariant?: "default" | "secondary" | "destructive" | "outline" }
> = {
  "Not Started": { icon: Clock, color: "text-gray-500", badgeVariant: "secondary" },
  "In Progress": { icon: Rocket, color: "text-blue-500", badgeVariant: "default" },
  "Completed": { icon: CheckCircle, color: "text-green-500", badgeVariant: "default" },
}

// Configuration for Priority display
const getPriorityColor = (priorityName: string) => {
  switch (priorityName?.toLowerCase()) {
    case 'critical':
      return 'bg-red-500 hover:bg-red-600 text-white'
    case 'high':
      return 'bg-orange-500 hover:bg-orange-600 text-white'
    case 'medium':
      return 'bg-yellow-500 hover:bg-yellow-600 text-black'
    case 'low':
      return 'bg-green-500 hover:bg-green-600 text-white'
    default:
      return 'bg-gray-500 hover:bg-gray-600 text-white'
  }
}

export default function ActionPlansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({
    "Not Started": false,
    "In Progress": false,
    "Completed": false,
  })

  // Fetch real data from API
  useEffect(() => {
    const fetchActionPlans = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/action-plans')
        if (!response.ok) throw new Error('Failed to fetch action plans')
        
        const data = await response.json()
        // Transform the data to add a default status and format dates
        const transformedData: ActionPlan[] = data.map((plan: ActionPlanFromDB) => ({
          ...plan,
          status: plan.is_approved ? "In Progress" as const : "Not Started" as const
        }))
        
        setActionPlans(transformedData)
      } catch (error) {
        console.error('Error loading action plans:', error)
        setActionPlans([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchActionPlans()
  }, [])

  const filteredActionPlans = useMemo(() => {
    let currentPlans = [...actionPlans]
    if (searchTerm) {
      currentPlans = currentPlans.filter(
        (plan) =>
          plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (plan.finding_title && plan.finding_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (plan.finding_description && plan.finding_description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    const activeStatusFilters = Object.entries(statusFilters)
      .filter(([_, isActive]) => isActive)
      .map(([status]) => status)
    if (activeStatusFilters.length > 0) {
      currentPlans = currentPlans.filter((plan) => activeStatusFilters.includes(plan.status))
    }
    return currentPlans
  }, [actionPlans, searchTerm, statusFilters])

  const handleDeleteActionPlan = async (planId: string) => {
    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this action plan? This action cannot be undone.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/action-plans/${planId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete action plan')
      }
      
      // Only update local state if API call was successful
      setActionPlans((prevPlans) => prevPlans.filter((p) => p.id !== planId))
    } catch (error) {
      console.error('Error deleting action plan:', error)
      alert('Failed to delete action plan. Please try again.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold text-foreground">Action Plans</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/action-plans/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Action Plan
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Action Plans List</CardTitle>
          <CardDescription>Track and manage action plans for addressing audit findings.</CardDescription>
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by action plan, finding, owner, auditor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(statusFilters).map((statusKey) => {
                  const status = statusKey as ActionPlanStatus
                  const config = actionPlanStatusConfig[status]
                  return (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={statusFilters[status]}
                      onCheckedChange={(checked) => setStatusFilters((prev) => ({ ...prev, [status]: !!checked }))}
                    >
                      <span className="flex items-center">
                        {config && <config.icon className={`mr-2 h-4 w-4 ${config.color}`} />}
                        {status}
                      </span>
                    </DropdownMenuCheckboxItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[300px]">Action Plan Description</TableHead>
                  <TableHead className="min-w-[200px]">Related Finding</TableHead>
                  <TableHead className="min-w-[120px]">Responsible ID</TableHead>
                  <TableHead className="min-w-[120px]">Due Date</TableHead>
                  <TableHead className="min-w-[120px]">Priority</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span>Loading action plans...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredActionPlans.length > 0 ? (
                  filteredActionPlans.map((plan) => {
                    const statusInfo = actionPlanStatusConfig[plan.status]
                    return (
                      <TableRow key={plan.id}>
                        <TableCell className="font-mono text-xs">
                          <Link 
                            href={`/action-plans/${plan.id}`}
                            className="hover:underline text-blue-600 dark:text-blue-400"
                          >
                            {plan.id}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div
                            className="font-medium truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                            title={plan.description}
                          >
                            {plan.description}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          {plan.finding_id && plan.finding_title ? (
                            <Link
                              href={`/findings/${plan.finding_id}`}
                              className="hover:underline text-blue-600 dark:text-blue-400"
                              title={plan.finding_description}
                            >
                              <div className="font-medium truncate max-w-[180px]" title={plan.finding_title}>
                                {plan.finding_title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate max-w-[180px]" title={plan.finding_description}>
                                {plan.finding_description}
                              </div>
                            </Link>
                          ) : (
                            <span className="text-muted-foreground italic">No finding linked</span>
                          )}
                        </TableCell>
                        <TableCell className="truncate max-w-[120px]" title={plan.responsible_id}>
                          {plan.responsible_id}
                        </TableCell>
                        <TableCell className="text-center">
                          {plan.due_date ? new Date(plan.due_date).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`text-xs ${getPriorityColor(plan.priority_name)}`}>
                            {plan.priority_name || `Priority ${plan.priority_id}`}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusInfo?.badgeVariant || "secondary"}
                            className={
                              plan.status === "Completed"
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : plan.status === "In Progress"
                                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                                  : "bg-gray-500 hover:bg-gray-600 text-white"
                            }
                          >
                            {plan.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-5 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/action-plans/${plan.id}`}>
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                                </Link>
                              </DropdownMenuItem>
                              {plan.finding_id && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/findings/${plan.finding_id}`}>
                                    <AlertTriangle className="mr-2 h-4 w-4" /> View Finding
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem asChild>
                                <Link href={`/action-plans/${plan.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit Plan
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteActionPlan(plan.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Plan
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No action plans match your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

    </div>
  )
}
