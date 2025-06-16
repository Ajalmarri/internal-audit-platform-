"use client"

import { CardContent } from "@/components/ui/card"

import { CardDescription } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import type React from "react"
import { useMemo, useRef, useEffect, useState } from "react"
import type { AuditPlan, Assignment } from "../page" // Import types from parent
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface AuditPlansTimelineViewProps {
  auditPlans: AuditPlan[]
  assignments: Assignment[]
  timelineStartDate: Date
  timelineEndDate: Date
}

const PIXELS_PER_DAY = 6 // Increased for better visibility of shorter tasks
const ROW_HEIGHT_PX = 48 // Height of each plan row in pixels (includes padding)
const PLAN_TITLE_WIDTH_PX = 200 // Width of the sticky plan title column
const TIMELINE_HEADER_HEIGHT_PX = 60 // Height for month/week headers

const assignmentStatusColors: Record<Assignment["status"], string> = {
  "Not Started": "bg-gray-300 border-gray-400",
  "In Progress": "bg-sky-400 border-sky-500",
  Completed: "bg-green-400 border-green-500",
  Overdue: "bg-red-400 border-red-500",
  Blocked: "bg-orange-400 border-orange-500",
}

// Helper function to calculate difference in days (inclusive of start, exclusive of end for duration)
const differenceInDays = (d1: Date, d2: Date): number => {
  const t1 = d1.getTime()
  const t2 = d2.getTime()
  return Math.floor((t1 - t2) / (1000 * 60 * 60 * 24))
}

const AuditPlansTimelineView: React.FC<AuditPlansTimelineViewProps> = ({
  auditPlans,
  assignments,
  timelineStartDate,
  timelineEndDate,
}) => {
  const [svgRendered, setSvgRendered] = useState(false)
  const timelineBodyRef = useRef<HTMLDivElement>(null)

  const { months, weeks, totalDaysInView, timelineGridWidth } = useMemo(() => {
    const m: { name: string; year: number; days: number; startDayOffset: number; width: number }[] = []
    const w: { month: string; year: number; week: number; startDayOffset: number; width: number; startDate: Date }[] =
      []

    const current = new Date(timelineStartDate)
    current.setUTCHours(0, 0, 0, 0) // Normalize to UTC start of day

    let dayOffset = 0
    let totalDays = 0

    const endDatePlusOne = new Date(timelineEndDate)
    endDatePlusOne.setUTCDate(endDatePlusOne.getUTCDate() + 1) // Iterate up to the end of the timelineEndDate

    while (current < endDatePlusOne) {
      const month = current.getUTCMonth()
      const year = current.getUTCFullYear()
      const monthName = current.toLocaleString("default", { month: "short" })

      if (!m.find((mx) => mx.name === monthName && mx.year === year)) {
        m.push({ name: monthName, year, days: 0, startDayOffset: dayOffset, width: 0 })
      }
      const currentMonthObj = m.find((mx) => mx.name === monthName && mx.year === year)!
      currentMonthObj.days += 1

      // Weeks
      const weekStartDate = new Date(current)
      const weekDayCount = 0
      const weekNumber = Math.ceil(current.getUTCDate() / 7) // Simple week number

      const existingWeek = w.find((wx) => wx.month === monthName && wx.year === year && wx.week === weekNumber)
      if (!existingWeek) {
        w.push({
          month: monthName,
          year,
          week: weekNumber,
          startDayOffset: dayOffset,
          width: 0,
          startDate: new Date(weekStartDate),
        })
      }
      const currentWeekObj = w.find((wx) => wx.month === monthName && wx.year === year && wx.week === weekNumber)!
      currentWeekObj.width += PIXELS_PER_DAY

      dayOffset += 1
      totalDays += 1
      current.setUTCDate(current.getUTCDate() + 1)
    }

    m.forEach((mx) => (mx.width = mx.days * PIXELS_PER_DAY))

    return { months: m, weeks: w, totalDaysInView: totalDays, timelineGridWidth: totalDays * PIXELS_PER_DAY }
  }, [timelineStartDate, timelineEndDate])

  const getDateOffset = (date: Date): number => {
    const normalizedDate = new Date(date)
    normalizedDate.setUTCHours(0, 0, 0, 0)
    const normalizedStartDate = new Date(timelineStartDate)
    normalizedStartDate.setUTCHours(0, 0, 0, 0)

    if (normalizedDate < normalizedStartDate) return 0 // Clamp to start
    const diff = differenceInDays(normalizedDate, normalizedStartDate)
    return diff * PIXELS_PER_DAY
  }

  const getAssignmentWidth = (startDate: Date, endDate: Date): number => {
    const sDate = new Date(startDate < timelineStartDate ? timelineStartDate : startDate)
    sDate.setUTCHours(0, 0, 0, 0)
    const eDate = new Date(endDate > timelineEndDate ? timelineEndDate : endDate)
    eDate.setUTCHours(0, 0, 0, 0) // Use end of day for end date for inclusive duration
    eDate.setUTCDate(eDate.getUTCDate() + 1)

    if (eDate <= sDate) return PIXELS_PER_DAY // Min width for single day task
    const diff = differenceInDays(eDate, sDate)
    return diff * PIXELS_PER_DAY
  }

  // This effect is to ensure SVGs render after the DOM elements for assignments are available.
  useEffect(() => {
    if (timelineBodyRef.current) {
      setSvgRendered(false) // Reset to trigger re-render of SVG if dependencies change
      const timer = setTimeout(() => setSvgRendered(true), 50) // Small delay for DOM to update
      return () => clearTimeout(timer)
    }
  }, [auditPlans, assignments, timelineGridWidth])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Plan Timeline</CardTitle>
        <CardDescription>Visual overview of audit plans and their assignments.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <ScrollArea className="w-full border rounded-md">
            <div className="relative" style={{ minWidth: `${PLAN_TITLE_WIDTH_PX + timelineGridWidth}px` }}>
              {/* Timeline Header (Months & Weeks) */}
              <div
                className="sticky top-0 z-20 bg-background border-b"
                style={{
                  height: `${TIMELINE_HEADER_HEIGHT_PX}px`,
                  width: `${PLAN_TITLE_WIDTH_PX + timelineGridWidth}px`,
                }}
              >
                <div className="flex h-full">
                  <div
                    className="sticky left-0 bg-background border-r z-10 flex items-center justify-center"
                    style={{ width: `${PLAN_TITLE_WIDTH_PX}px` }}
                  >
                    <span className="font-semibold text-sm">Audit Plan</span>
                  </div>
                  <div className="flex-grow relative">
                    {/* Months */}
                    <div className="flex h-1/2 border-b">
                      {months.map((month, index) => (
                        <div
                          key={`${month.name}-${month.year}`}
                          className="flex items-center justify-center text-xs font-medium border-r last:border-r-0"
                          style={{ width: `${month.width}px` }}
                        >
                          {month.name} {month.year}
                        </div>
                      ))}
                    </div>
                    {/* Weeks */}
                    <div className="flex h-1/2">
                      {weeks.map((week, index) => (
                        <Tooltip key={`week-${week.month}-${week.year}-${week.week}`}>
                          <TooltipTrigger asChild>
                            <div
                              className="flex items-center justify-center text-xs text-muted-foreground border-r last:border-r-0 overflow-hidden"
                              style={{ width: `${week.width}px` }}
                            >
                              W{week.week}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            Week {week.week} (
                            {week.startDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} -{" "}
                            {new Date(
                              new Date(week.startDate).setDate(
                                week.startDate.getDate() + Math.floor(week.width / PIXELS_PER_DAY) - 1,
                              ),
                            ).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                            )
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Body */}
              <div ref={timelineBodyRef} className="relative" style={{ paddingBottom: "1px" }}>
                {" "}
                {/* Padding for last border */}
                {auditPlans.map((plan, planIndex) => {
                  const planAssignments = assignments.filter((a) => a.auditPlanId === plan.id)
                  const planRowTop = planIndex * ROW_HEIGHT_PX

                  return (
                    <div
                      key={plan.id}
                      className="flex border-b h-12" // ROW_HEIGHT_PX equivalent with Tailwind
                      style={{ height: `${ROW_HEIGHT_PX}px` }}
                    >
                      {/* Plan Title Column */}
                      <div
                        className="sticky left-0 bg-background border-r z-10 p-2 flex items-center"
                        style={{ width: `${PLAN_TITLE_WIDTH_PX}px`, height: `${ROW_HEIGHT_PX}px` }}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-sm font-medium truncate" title={plan.title}>
                              {plan.title}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>{plan.title}</TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Assignments Timeline Area */}
                      <div className="relative flex-grow bg-muted/20">
                        {/* Vertical day lines for grid */}
                        {Array.from({ length: totalDaysInView }).map((_, dayIndex) => (
                          <div
                            key={`day-line-${plan.id}-${dayIndex}`}
                            className="absolute top-0 bottom-0 border-r border-border/30"
                            style={{ left: `${dayIndex * PIXELS_PER_DAY}px`, width: `${PIXELS_PER_DAY}px` }}
                          />
                        ))}
                        {planAssignments.map((assignment) => {
                          if (assignment.endDate < timelineStartDate || assignment.startDate > timelineEndDate) {
                            return null // Skip assignments outside the view
                          }
                          const left = getDateOffset(assignment.startDate)
                          const width = getAssignmentWidth(assignment.startDate, assignment.endDate)

                          if (width <= 0) return null // Skip if width is zero or negative

                          return (
                            <Tooltip key={assignment.id}>
                              <TooltipTrigger asChild>
                                <div
                                  id={`assignment-${assignment.id}`}
                                  className={cn(
                                    "absolute top-1/2 -translate-y-1/2 h-6 rounded-sm flex items-center px-2 text-xs text-white font-medium overflow-hidden border",
                                    assignmentStatusColors[assignment.status],
                                  )}
                                  style={{
                                    left: `${left}px`,
                                    width: `${width}px`,
                                  }}
                                >
                                  <p className="truncate" title={assignment.name}>
                                    {assignment.name}
                                  </p>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-semibold">{assignment.name}</p>
                                <p>Plan: {auditPlans.find((p) => p.id === assignment.auditPlanId)?.title}</p>
                                <p>Status: {assignment.status}</p>
                                <p>
                                  Dates: {assignment.startDate.toLocaleDateString()} -{" "}
                                  {assignment.endDate.toLocaleDateString()}
                                </p>
                                {assignment.assignees && <p>Assignees: {assignment.assignees.join(", ")}</p>}
                                {assignment.dependencies && assignment.dependencies.length > 0 && (
                                  <p>
                                    Depends on:{" "}
                                    {assignment.dependencies
                                      .map((depId) => assignments.find((a) => a.id === depId)?.name || depId)
                                      .join(", ")}
                                  </p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                {/* SVG for Dependency Lines - Renders after DOM elements are available */}
                {svgRendered && timelineBodyRef.current && (
                  <svg
                    className="absolute top-0 left-0 pointer-events-none z-0"
                    width={PLAN_TITLE_WIDTH_PX + timelineGridWidth}
                    height={auditPlans.length * ROW_HEIGHT_PX}
                    style={{ marginLeft: `${PLAN_TITLE_WIDTH_PX}px` }} // Offset by plan title width
                  >
                    {auditPlans.flatMap((plan, planIndex) => {
                      const planAssignments = assignments.filter((a) => a.auditPlanId === plan.id)
                      const planRowYOffset = planIndex * ROW_HEIGHT_PX + ROW_HEIGHT_PX / 2 // Middle of the row

                      return planAssignments.flatMap((assignment) => {
                        if (!assignment.dependencies || assignment.dependencies.length === 0) return []

                        const dependentElement = timelineBodyRef.current?.querySelector(
                          `#assignment-${assignment.id}`,
                        ) as HTMLElement
                        if (!dependentElement) return []

                        const dependentStartX = Number.parseFloat(dependentElement.style.left || "0")

                        return assignment.dependencies.flatMap((depId) => {
                          const prerequisiteAssignment = assignments.find((a) => a.id === depId)
                          if (!prerequisiteAssignment) return []

                          const prerequisiteElement = timelineBodyRef.current?.querySelector(
                            `#assignment-${prerequisiteAssignment.id}`,
                          ) as HTMLElement
                          if (!prerequisiteElement) return []

                          const prerequisitePlanIndex = auditPlans.findIndex(
                            (p) => p.id === prerequisiteAssignment.auditPlanId,
                          )
                          if (prerequisitePlanIndex === -1) return []

                          const prerequisiteEndX =
                            Number.parseFloat(prerequisiteElement.style.left || "0") +
                            Number.parseFloat(prerequisiteElement.style.width || "0")
                          const prerequisiteYOffset = prerequisitePlanIndex * ROW_HEIGHT_PX + ROW_HEIGHT_PX / 2

                          // Draw line from end of prerequisite to start of dependent
                          return (
                            <line
                              key={`dep-${prerequisiteAssignment.id}-to-${assignment.id}`}
                              x1={prerequisiteEndX}
                              y1={prerequisiteYOffset}
                              x2={dependentStartX}
                              y2={planRowYOffset}
                              stroke="hsl(var(--muted-foreground))"
                              strokeWidth="1.5"
                              markerEnd="url(#arrowhead)"
                            />
                          )
                        })
                      })
                    })}
                    <defs>
                      <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                        <polygon points="0 0, 6 2, 0 4" fill="hsl(var(--muted-foreground))" />
                      </marker>
                    </defs>
                  </svg>
                )}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}

export default AuditPlansTimelineView
