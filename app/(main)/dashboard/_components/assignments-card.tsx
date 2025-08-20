"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ListChecks, Clock } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const statusColors: { [key: string]: string } = {
  "In Progress": "bg-blue-500 hover:bg-blue-600",
  "Due Soon": "bg-yellow-500 hover:bg-yellow-600 text-black",
  Completed: "bg-green-500 hover:bg-green-600",
  Pending: "bg-gray-500 hover:bg-gray-600",
}

export default function AssignmentsCard() {
  const [assignments, setAssignments] = useState<Array<{ id: string; title: string; status?: string; end_date?: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/assignments')
        if (!res.ok) throw new Error('Failed to load assignments')
        const data = await res.json()
        setAssignments(data)
      } catch (e) {
        console.error(e)
        setAssignments([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const { totalAssignments, dueSoonAssignments, recent } = useMemo(() => {
    const now = new Date()
    const soonThreshold = new Date(now)
    soonThreshold.setDate(now.getDate() + 7)
    const dueSoon = assignments.filter((a) => {
      const d = a.end_date ? new Date(a.end_date) : undefined
      return d ? d >= now && d <= soonThreshold : false
    }).length
    const recentSorted = [...assignments].sort((a, b) => {
      const ad = a.end_date ? new Date(a.end_date).getTime() : 0
      const bd = b.end_date ? new Date(b.end_date).getTime() : 0
      return bd - ad
    })
    return {
      totalAssignments: assignments.length,
      dueSoonAssignments: dueSoon,
      recent: recentSorted.slice(0, 3),
    }
  }, [assignments])

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-semibold">Assignments</CardTitle>
          <CardDescription>Overview of your current tasks.</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/assignments">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-3">
            <ListChecks className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalAssignments}</p>
              <p className="text-sm text-muted-foreground">Total Assignments</p>
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-3">
            <Clock className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-2xl font-bold">{dueSoonAssignments}</p>
              <p className="text-sm text-muted-foreground">Due Soon</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-md font-medium text-muted-foreground mb-1">Recent Assignments:</h3>
          {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {!loading && recent.map((assignment) => (
            <Link
              key={assignment.id}
              href={`/assignments/${assignment.id}`}
              className="block p-3 bg-muted/30 rounded-md hover:bg-muted/40 hover:shadow-md hover:-translate-y-px transition-all duration-150 ease-in-out cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-muted-foreground">Due: {assignment.end_date ? new Date(assignment.end_date).toLocaleDateString() : '—'}</p>
                </div>
                <Badge className={`${statusColors[assignment.status || 'Pending'] || "bg-gray-500"} text-white text-xs shrink-0`}>
                  {assignment.status || 'Pending'}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
