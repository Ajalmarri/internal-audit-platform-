"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Edit3, Trash2, TargetIcon } from "lucide-react" // Renamed Target to TargetIcon
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
// It's good practice to have a proper modal for add/edit forms.
// For this example, we'll use prompts for simplicity, but a modal component would be better.
// import AddEditStrategicGoalModal from './add-edit-strategic-goal-modal';

export default function StrategicGoalsSettings() {
  const [goals, setGoals] = useState<StrategicGoal[]>(mockStrategicGoals)
  // const [showAddEditModal, setShowAddEditModal] = useState(false);
  // const [currentGoalToEdit, setCurrentGoalToEdit] = useState<StrategicGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<StrategicGoal | null>(null)

  const handleAddNewGoal = () => {
    // setCurrentGoalToEdit(null);
    // setShowAddEditModal(true);
    // Simplified version using prompt:
    const title = prompt("Enter new goal title:")
    if (title) {
      const description = prompt("Enter goal description:")
      if (description) {
        const newGoal: StrategicGoal = {
          id: `sg${Date.now()}${Math.random().toString(16).slice(2)}`, // More unique ID
          title,
          description,
        }
        setGoals((prevGoals) => [...prevGoals, newGoal])
      }
    }
  }

  const handleEditGoal = (goal: StrategicGoal) => {
    // setCurrentGoalToEdit(goal);
    // setShowAddEditModal(true);
    // Simplified version using prompt:
    const newTitle = prompt("Edit goal title:", goal.title)
    if (newTitle !== null) {
      // Check if prompt was cancelled
      const newDescription = prompt("Edit goal description:", goal.description)
      if (newDescription !== null) {
        setGoals((prevGoals) =>
          prevGoals.map((g) => (g.id === goal.id ? { ...g, title: newTitle, description: newDescription } : g)),
        )
      }
    }
  }

  const confirmDeleteGoal = () => {
    if (goalToDelete) {
      setGoals((prevGoals) => prevGoals.filter((g) => g.id !== goalToDelete.id))
      setGoalToDelete(null) // Close the dialog
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
        <div>
          <CardTitle className="flex items-center text-xl md:text-2xl">
            <TargetIcon className="mr-2 h-5 w-5 md:h-6 md:w-6" />
            Manage Company Strategic Goals
          </CardTitle>
          <CardDescription className="mt-1">
            Add or edit the high-level company objectives that audit plans and action plans can be aligned with.
          </CardDescription>
        </div>
        <Button onClick={handleAddNewGoal} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
        </Button>
      </CardHeader>
      <CardContent className="mt-2">
        {goals.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <TargetIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium">No strategic goals defined yet.</p>
            <p className="text-sm">Click "Add New Goal" to get started.</p>
          </div>
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
                <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-4">
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
                        <AlertDialogTitle>Are you sure you want to delete this goal?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the strategic goal:
                          <br />
                          <strong className="mt-2 block">{goalToDelete?.title}</strong>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setGoalToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={confirmDeleteGoal}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete Goal
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
      {/* 
        Placeholder for a proper modal:
        {showAddEditModal && (
          <AddEditStrategicGoalModal
            isOpen={showAddEditModal}
            onClose={() => setShowAddEditModal(false)}
            goal={currentGoalToEdit}
            onSave={(savedGoal) => {
              if (currentGoalToEdit) {
                setGoals(goals.map(g => g.id === savedGoal.id ? savedGoal : g));
              } else {
                setGoals([...goals, savedGoal]);
              }
              setShowAddEditModal(false);
            }}
          />
        )}
      */}
    </Card>
  )
}
