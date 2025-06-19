"use client"

import { Badge } from "@/components/ui/badge"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { DisplayableAssignmentWithKanban, KanbanWorkflowStatus } from "../_types/assignment-kanban-types" // Assuming types are centralized
import { AssignmentKanbanCard } from "./assignment-kanban-card"

const KANBAN_COLUMNS: { id: KanbanWorkflowStatus; title: string }[] = [
  { id: "Planning", title: "Planning" },
  { id: "Fieldwork", title: "Fieldwork" },
  { id: "In Review", title: "In Review" },
  { id: "Completed", title: "Completed" },
]

interface AssignmentKanbanBoardProps {
  assignments: DisplayableAssignmentWithKanban[]
}

export function AssignmentKanbanBoard({ assignments }: AssignmentKanbanBoardProps) {
  if (!assignments) {
    return <div className="p-4 text-center text-muted-foreground">Loading assignments...</div>
  }
  if (assignments.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No assignments to display on the board.</div>
  }

  return (
    <div className="p-1">
      {" "}
      {/* Added small padding to parent */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4">
          {KANBAN_COLUMNS.map((column) => {
            const columnAssignments = assignments.filter((assignment) => assignment.kanbanStatus === column.id)
            return (
              <div
                key={column.id}
                className="w-80 flex-shrink-0 rounded-lg bg-muted/60 p-3 flex flex-col" // Increased width slightly
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-md text-foreground">{column.title}</h3>
                  <Badge variant="secondary" className="text-sm">
                    {columnAssignments.length}
                  </Badge>
                </div>
                {/* This ScrollArea handles vertical scrolling for cards within a column */}
                <ScrollArea className="flex-grow" style={{ maxHeight: "calc(100vh - 18rem)" }}>
                  {" "}
                  {/* Adjusted maxHeight */}
                  <div className="space-y-3 pr-2">
                    {" "}
                    {/* Added pr-2 for scrollbar visibility */}
                    {columnAssignments.length > 0 ? (
                      columnAssignments.map((assignment) => (
                        <AssignmentKanbanCard key={assignment.id} assignment={assignment} />
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-24 rounded-md border border-dashed">
                        <p className="text-sm text-muted-foreground">No assignments here.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
