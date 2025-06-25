"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import TaskItem from "./task-item"
import type { AuditTask, UserStub } from "../_types/assignment-types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FulfilmentTasksCardProps {
  initialTasks: AuditTask[]
  teamMembers: UserStub[]
  assignmentId: string
}

const updateTaskRecursive = (
  tasks: AuditTask[],
  targetId: string,
  updateFn: (task: AuditTask) => AuditTask | null | { task?: AuditTask; subTask?: AuditTask },
): AuditTask[] => {
  return tasks
    .map((task) => {
      if (task.id === targetId) {
        const result = updateFn(task)
        if (result === null) return null // For deletion
        if (typeof result === "object" && "subTask" in result && result.subTask) {
          // Adding a sub-task
          return {
            ...task,
            subTasks: [...(task.subTasks || []), result.subTask],
            isExpanded: true,
          }
        }
        return result as AuditTask // For updates
      }
      if (task.subTasks) {
        const updatedSubTasks = updateTaskRecursive(task.subTasks, targetId, updateFn)
        return { ...task, subTasks: updatedSubTasks.filter(Boolean) as AuditTask[] }
      }
      return task
    })
    .filter(Boolean) as AuditTask[]
}

const findTaskByIdRecursive = (tasks: AuditTask[], taskId: string): AuditTask | null => {
  for (const task of tasks) {
    if (task.id === taskId) return task
    if (task.subTasks) {
      const found = findTaskByIdRecursive(task.subTasks, taskId)
      if (found) return found
    }
  }
  return null
}

export default function FulfilmentTasksCard({ initialTasks, teamMembers, assignmentId }: FulfilmentTasksCardProps) {
  const [tasks, setTasks] = useState<AuditTask[]>(() =>
    initialTasks.map((t) => ({ ...t, isExpanded: t.isExpanded ?? true })),
  )

  useEffect(() => {
    setTasks(initialTasks.map((t) => ({ ...t, isExpanded: t.isExpanded ?? true })))
  }, [initialTasks])

  const handleUpdateTask = useCallback(
    (taskId: string, updateFn: (task: AuditTask) => AuditTask | null | { task?: AuditTask; subTask?: AuditTask }) => {
      setTasks((prevTasks) => updateTaskRecursive(prevTasks, taskId, updateFn))
    },
    [],
  )

  const handleToggleComplete = useCallback(
    (taskId: string, status: AuditTask["status"]) => {
      handleUpdateTask(taskId, (task) => ({ ...task, status }))
    },
    [handleUpdateTask],
  )

  const handleUpdateField = useCallback(
    (taskId: string, field: keyof AuditTask, value: any) => {
      handleUpdateTask(taskId, (task) => ({ ...task, [field]: value }))
    },
    [handleUpdateTask],
  )

  const handleAddSubTask = useCallback(
    (parentId: string) => {
      const newSubTask: AuditTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        description: "New Sub-task",
        status: "Pending",
        subTasks: [],
        dependsOn: [],
        isExpanded: true,
      }
      handleUpdateTask(parentId, (task) => ({ task, subTask: newSubTask }))
    },
    [handleUpdateTask],
  )

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      handleUpdateTask(taskId, () => null) // Signal deletion
    },
    [handleUpdateTask],
  )

  const handleToggleExpand = useCallback(
    (taskId: string) => {
      handleUpdateTask(taskId, (task) => ({ ...task, isExpanded: !task.isExpanded }))
    },
    [handleUpdateTask],
  )

  const handleAddTask = () => {
    const newTask: AuditTask = {
      id: `task-${Date.now()}`,
      description: "New Task",
      status: "Pending",
      subTasks: [],
      dependsOn: [],
      isExpanded: true,
    }
    setTasks((prevTasks) => [...prevTasks, newTask])
  }

  const isTaskBlocked = useCallback(
    (task: AuditTask): boolean => {
      if (!task.dependsOn || task.dependsOn.length === 0) return false
      for (const depId of task.dependsOn) {
        const depTask = findTaskByIdRecursive(tasks, depId)
        if (depTask && depTask.status !== "Completed") return true
      }
      return false
    },
    [tasks],
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Fulfilment / Tasks</CardTitle>
          <CardDescription>Track and manage assignment tasks, including sub-tasks and dependencies.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleAddTask}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-3">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                teamMembers={teamMembers}
                onToggleComplete={handleToggleComplete}
                onUpdateField={handleUpdateField}
                onAddSubTask={handleAddSubTask}
                onDeleteTask={handleDeleteTask}
                onToggleExpand={handleToggleExpand}
                isTaskBlocked={isTaskBlocked}
                path={`${index}`}
                level={0}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No tasks added yet. Click "Add Task" to get started.
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
