"use client"

import type React from "react"

import { useState, memo } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DatePicker } from "@/components/ui/date-picker" // Assuming this is your custom date picker
import { ChevronDown, ChevronRight, PlusCircle, Trash2, LinkIcon, CalendarDays, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AuditTask, UserStub } from "../_types/assignment-types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TaskItemProps {
  task: AuditTask
  teamMembers: UserStub[]
  onToggleComplete: (taskId: string, status: AuditTask["status"]) => void
  onUpdateField: (taskId: string, field: keyof AuditTask, value: any) => void
  onAddSubTask: (parentId: string) => void
  onDeleteTask: (taskId: string) => void
  onToggleExpand: (taskId: string) => void
  isTaskBlocked: (task: AuditTask) => boolean
  path: string // e.g., "0" for top-level, "0-1" for sub-task
  level: number
}

const TaskItemComponent = ({
  task,
  teamMembers,
  onToggleComplete,
  onUpdateField,
  onAddSubTask,
  onDeleteTask,
  onToggleExpand,
  isTaskBlocked,
  path,
  level,
}: TaskItemProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const blocked = isTaskBlocked(task)

  const handleCheckboxChange = () => {
    if (blocked) return
    const newStatus = task.status === "Completed" ? "Pending" : "Completed"
    onToggleComplete(task.id, newStatus)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateField(task.id, "description", e.target.value)
  }

  const handleAssigneeChange = (assigneeId: string) => {
    onUpdateField(task.id, "assigneeId", assigneeId)
  }

  const handleDueDateChange = (date?: Date) => {
    onUpdateField(task.id, "dueDate", date)
  }

  const assignedUser = teamMembers.find((tm) => tm.id === task.assigneeId)

  return (
    <div className="flex flex-col group">
      <div
        className={cn(
          "flex items-center gap-2 py-2 pr-2 rounded-md hover:bg-muted/50 transition-colors",
          blocked && "opacity-60 cursor-not-allowed",
        )}
        style={{ paddingLeft: `${level * 1.5 + (task.subTasks && task.subTasks.length > 0 ? 0 : 1.25)}rem` }} // Adjust padding for expand icon space
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {task.subTasks && task.subTasks.length > 0 ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => onToggleExpand(task.id)}
            aria-label={task.isExpanded ? "Collapse sub-tasks" : "Expand sub-tasks"}
          >
            {task.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        ) : (
          <div className="w-6 shrink-0"></div> // Placeholder for alignment
        )}

        <Checkbox
          id={`task-${task.id}`}
          checked={task.status === "Completed"}
          onCheckedChange={handleCheckboxChange}
          disabled={blocked}
          className={cn("shrink-0", blocked && "cursor-not-allowed")}
          aria-label={`Mark task ${task.description} as ${task.status === "Completed" ? "incomplete" : "complete"}`}
        />

        <Input
          value={task.description}
          onChange={handleDescriptionChange}
          className={cn(
            "flex-grow h-8 text-sm border-none focus-visible:ring-1 focus-visible:ring-ring bg-transparent",
            task.status === "Completed" && "line-through text-muted-foreground",
            blocked && "pointer-events-none",
          )}
          placeholder="Task description"
          disabled={blocked}
        />

        <div
          className={cn(
            "flex items-center gap-1.5 shrink-0 transition-opacity",
            isHovered || task.assigneeId || task.dueDate ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Set dependency (coming soon)">
                  <LinkIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Set task dependency (Coming soon)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={blocked} aria-label="Assign user">
                {assignedUser ? (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={assignedUser.avatar || "/placeholder.svg"} alt={assignedUser.name} />
                    <AvatarFallback>{assignedUser.name.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Select onValueChange={handleAssigneeChange} defaultValue={task.assigneeId}>
                <SelectTrigger className="border-none focus:ring-0 w-[180px]">
                  <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PopoverContent>
          </Popover>

          <DatePicker
            value={task.dueDate}
            onChange={handleDueDateChange}
            disabled={blocked}
            buttonProps={{ variant: "ghost", size: "icon", className: "h-7 w-7", "aria-label": "Set due date" }}
            icon={
              task.dueDate ? (
                <CalendarDays className="h-4 w-4 text-primary" />
              ) : (
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              )
            }
          />
        </div>

        <div
          className={cn(
            "flex items-center gap-1 shrink-0 transition-opacity",
            isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onAddSubTask(task.id)}
                  disabled={blocked}
                  aria-label="Add sub-task"
                >
                  <PlusCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add sub-task</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onDeleteTask(task.id)}
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4 text-destructive/80 hover:text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {task.isExpanded && task.subTasks && task.subTasks.length > 0 && (
        <div className="flex flex-col">
          {task.subTasks.map((subTask, index) => (
            <TaskItemComponent
              key={subTask.id}
              task={subTask}
              teamMembers={teamMembers}
              onToggleComplete={onToggleComplete}
              onUpdateField={onUpdateField}
              onAddSubTask={onAddSubTask}
              onDeleteTask={onDeleteTask}
              onToggleExpand={onToggleExpand}
              isTaskBlocked={isTaskBlocked}
              path={`${path}-${index}`}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
export default memo(TaskItemComponent)
