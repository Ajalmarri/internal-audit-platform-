"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Edit3, Trash2, Target } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { type StrategicGoal, mockStrategicGoals } from "../_types/settings-types"

export default function StrategicGoalsSettings() {
  const [goals, setGoals] = useState<StrategicGoal[]>(mockStrategicGoals)
  // const [showAddEditModal, setShowAddEditModal] = useState(false) // For a full modal implementation
  // const [currentGoal, setCurrentGoal] = useState<StrategicGoal | null>(null) // For a full modal implementation
  const [goalToDelete, setGoalToDelete] = useState<StrategicGoal | null>(null)

  const handleAddNewGoal = () => {
    // setCurrentGoal(null)
    // setShowAddEditModal(true);
    // For now, simple alert. In a real app, this would open a modal.
    const newGoalTitle = prompt("Enter new goal title:")
    if (newGoalTitle) {
      const newGoalDescription = prompt("Enter goal description:")
      if (newGoalDescription) {
        const newGoal: StrategicGoal = {
          id: `sg${Math.random().toString(36).substring(2, 7)}`, // simple unique id
          title: newGoalTitle,
          description: newGoalDescription,
        }
        setGoals([...goals, newGoal])
      }
    }
  }

  const handleEditGoal = (goal: StrategicGoal) => {
    // setCurrentGoal(goal)
    // setShowAddEditModal(true);
    // For now, simple alert. In a real app, this would open a modal.
    const updatedTitle = prompt("Enter updated goal title:", goal.title)
    if (updatedTitle !== null) {
      // Check if prompt was cancelled
      const updatedDescription = prompt("Enter updated goal description:", goal.description)
      if (updatedDescription !== null) {
        setGoals(
          goals.map((g) => (g.id === goal.id ? { ...g, title: updatedTitle, description: updatedDescription } : g)),
        )
      }
    }
  }

  const handleDeleteGoal = () => {
    if (goalToDelete) {
      setGoals(goals.filter((g) => g.id !== goalToDelete.id))
      setGoalToDelete(null)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <div>
          <CardTitle className="flex items-center text-xl md:text-2xl">
            <Target className="mr-2 h-5 w-5 md:h-6 md:w-6" />
            Manage Company Strategic Goals
          </CardTitle>
          <CardDescription>
            Add or edit the high-level company objectives that audit plans and action plans can be aligned with.
          </CardDescription>
        </div>
        <Button onClick={handleAddNewGoal}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No strategic goals defined yet. Click "Add New Goal" to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <Card key={goal.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{goal.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEditGoal(goal)}>
                    <Edit3 className="mr-2 h-3 w-3" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => setGoalToDelete(goal)}>
                        <Trash2 className="mr-2 h-3 w-3" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the strategic goal:
                          <br />
                          <strong>{goalToDelete?.title}</strong>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setGoalToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteGoal}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      {/* A full modal implementation for Add/Edit would be better for UX */}
      {/* For example:
        {showAddEditModal && (
          <AddEditStrategicGoalModal
            isOpen={showAddEditModal}
            onClose={() => setShowAddEditModal(false)}
            goal={currentGoal}
            onSave={(updatedGoal) => {
              if (currentGoal) { // Editing
                setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
              } else { // Adding
                setGoals([...goals, { ...updatedGoal, id: `sg${Date.now()}` }]);
              }
              setShowAddEditModal(false);
            }}
          />
        )}
      */}
    </Card>
  )
}
