// This is a new file to centralize types for the Kanban feature.
// In a real project, you might merge this with existing assignment types.

export type Priority = "High" | "Medium" | "Low"
export type KanbanWorkflowStatus = "Planning" | "Fieldwork" | "In Review" | "Completed"

export interface Assignee {
  id: string
  name: string
  avatar?: string
}

// Assuming AssignmentDisplayStatus is defined elsewhere or we define a base here
export type AssignmentDisplayStatus =
  | "Planning"
  | "In Progress"
  | "Fieldwork"
  | "Reporting"
  | "Follow-up"
  | "Completed"
  | "Cancelled"
  | "Due Soon"
  | "Overdue"

export interface DisplayableAssignment {
  id: string
  name: string
  status: AssignmentDisplayStatus // Original status
  dueDate: Date
  assignees: Assignee[]
}

export interface DisplayableAssignmentWithKanban extends DisplayableAssignment {
  priority: Priority
  kanbanStatus: KanbanWorkflowStatus // Status specifically for Kanban columns
}
