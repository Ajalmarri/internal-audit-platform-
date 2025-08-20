import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params

    if (!assignmentId) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 })
    }

    // Fetch tasks for the specific assignment using the correct table names
    const rows = await query(
      `SELECT 
         CAST(t.TaskID AS CHAR) AS id,
         t.AuditTaskDescription AS description,
         ats.StatusName AS status,
         CAST(t.AssigneeID AS CHAR) AS assigneeId,
         t.DueDate AS dueDate,
         t.CreatedDate AS createdDate,
         t.ModifiedDate AS modifiedDate,
         t.IsDeleted AS isDeleted
       FROM audittasks t
       LEFT JOIN audittaskstatuses ats ON ats.StatusID = t.StatusID
       WHERE t.AssignmentID = ? AND IFNULL(t.IsDeleted, 0) = 0
       ORDER BY t.CreatedDate ASC`,
      [assignmentId]
    ) as any[]

    // Transform the data to match the frontend interface
    const tasks = rows.map((task: any) => ({
      id: task.id,
      description: task.description || "No description",
      status: task.status || "Pending",
      assigneeId: task.assigneeId || undefined,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      createdDate: task.createdDate,
      modifiedDate: task.modifiedDate,
      isExpanded: false,
      subTasks: [] // For now, we'll handle sub-tasks separately if needed
    }))

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params
    const body = await request.json()

    if (!assignmentId) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 })
    }

    if (!body.description) {
      return NextResponse.json({ error: "Task description is required" }, { status: 400 })
    }

    // Get the default status ID (assuming "Pending" is the first status)
    const statusResult = await query(
      `SELECT StatusID FROM audittaskstatuses WHERE StatusName = ? LIMIT 1`,
      [body.status || "Pending"]
    ) as any[]

    const statusId = statusResult?.[0]?.StatusID || 1 // Default to first status if not found

    // Insert new task using the correct table structure
    const result = await query(
      `INSERT INTO audittasks (
         AuditTaskDescription,
         StatusID,
         AssigneeID,
         AssignmentID,
         DueDate,
         CreatedDate,
         ModifiedDate,
         CreatedBy,
         ModifiedBy,
         IsDeleted
       ) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 1, 1, 0)`,
      [
        body.description,
        statusId,
        body.assigneeId || 1, // Default to user ID 1 if not specified
        assignmentId,
        body.dueDate ? new Date(body.dueDate).toISOString().slice(0, 19).replace('T', ' ') : null
      ]
    ) as any

    // Fetch the newly created task
    const newTaskResult = await query(
      `SELECT 
         CAST(t.TaskID AS CHAR) AS id,
         t.AuditTaskDescription AS description,
         ats.StatusName AS status,
         CAST(t.AssigneeID AS CHAR) AS assigneeId,
         t.DueDate AS dueDate,
         t.CreatedDate AS createdDate,
         t.ModifiedDate AS modifiedDate
       FROM audittasks t
       LEFT JOIN audittaskstatuses ats ON ats.StatusID = t.StatusID
       WHERE t.TaskID = ?`,
      [result.insertId]
    ) as any[]

    const newTask = newTaskResult[0]

    return NextResponse.json({
      ...newTask,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
      isExpanded: false,
      subTasks: []
    })
  } catch (error) {
    console.error("Failed to create task:", error)
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!assignmentId) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 })
    }

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    // Soft delete the task by setting IsDeleted = 1
    await query(
      `UPDATE audittasks 
       SET IsDeleted = 1, ModifiedDate = NOW(), ModifiedBy = 1
       WHERE TaskID = ? AND AssignmentID = ?`,
      [taskId, assignmentId]
    )

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Failed to delete task:", error)
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!assignmentId) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 })
    }

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    if (!body.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Get the status ID for the new status
    const statusResult = await query(
      `SELECT StatusID FROM audittaskstatuses WHERE StatusName = ? LIMIT 1`,
      [body.status]
    ) as any[]

    const statusId = statusResult?.[0]?.StatusID || 1

    // Update the task status
    await query(
      `UPDATE audittasks 
       SET StatusID = ?, ModifiedDate = NOW(), ModifiedBy = 1
       WHERE TaskID = ? AND AssignmentID = ?`,
      [statusId, taskId, assignmentId]
    )

    // Fetch the updated task
    const updatedTaskResult = await query(
      `SELECT 
         CAST(t.TaskID AS CHAR) AS id,
         t.AuditTaskDescription AS description,
         ats.StatusName AS status,
         CAST(t.AssigneeID AS CHAR) AS assigneeId,
         t.DueDate AS dueDate,
         t.CreatedDate AS createdDate,
         t.ModifiedDate AS modifiedDate
       FROM audittasks t
       LEFT JOIN audittaskstatuses ats ON ats.StatusID = t.StatusID
       WHERE t.TaskID = ?`,
      [taskId]
    ) as any[]

    const updatedTask = updatedTaskResult[0]

    return NextResponse.json({
      ...updatedTask,
      dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : null,
      isExpanded: false,
      subTasks: []
    })
  } catch (error) {
    console.error("Failed to update task:", error)
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    )
  }
}
