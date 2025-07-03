"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { GripVertical, XIcon } from "lucide-react"
import type { DashboardWidgetConfig, DashboardWidget, DashboardView } from "../_types/dashboard-types"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers"

interface SortableWidgetProps {
  widget: DashboardWidgetConfig
  onVisibilityChange: (id: string, isVisible: boolean) => void
}

function SortableWidgetItem({ widget, onVisibilityChange }: SortableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 bg-muted/50 rounded-md mb-2 border ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <button {...attributes} {...listeners} className="cursor-grab p-1 touch-none">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
        <Label htmlFor={`switch-${widget.id}`} className="text-sm font-medium">
          {widget.title}
        </Label>
      </div>
      <Switch
        id={`switch-${widget.id}`}
        checked={widget.isVisible}
        onCheckedChange={(checked) => onVisibilityChange(widget.id, checked)}
      />
    </div>
  )
}

interface CustomizeDashboardModalProps {
  isOpen: boolean
  onClose: () => void
  activeView: DashboardView
  onSave: (viewId: string, viewName: string, updatedConfig: DashboardWidgetConfig[]) => void
  onSaveAsNew: (viewName: string, updatedConfig: DashboardWidgetConfig[]) => void
  allAvailableWidgetsMasterList: Omit<DashboardWidget, "component" | "defaultOrder" | "isVisible">[]
}

export default function CustomizeDashboardModal({
  isOpen,
  onClose,
  activeView,
  onSave,
  onSaveAsNew,
  allAvailableWidgetsMasterList,
}: CustomizeDashboardModalProps) {
  const [editableWidgets, setEditableWidgets] = useState<DashboardWidgetConfig[]>([])
  const [viewName, setViewName] = useState("")

  useEffect(() => {
    if (isOpen && activeView) {
      setViewName(activeView.name)
      const currentWidgetMap = new Map(activeView.config.map((w) => [w.id, w]))
      const initialEditableWidgets = allAvailableWidgetsMasterList
        .map((availableWidget) => {
          const current = currentWidgetMap.get(availableWidget.id)
          return {
            id: availableWidget.id,
            title: availableWidget.title,
            isVisible: current ? current.isVisible : false,
            order:
              current?.order ??
              allAvailableWidgetsMasterList.length +
                allAvailableWidgetsMasterList.findIndex((aw) => aw.id === availableWidget.id),
            columnSpan: current?.columnSpan ?? availableWidget.columnSpan,
          }
        })
        .sort((a, b) => a.order - b.order)
      setEditableWidgets(initialEditableWidgets)
    }
  }, [isOpen, activeView, allAvailableWidgetsMasterList])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setEditableWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const reorderedItems = arrayMove(items, oldIndex, newIndex)
        return reorderedItems.map((item, index) => ({ ...item, order: index }))
      })
    }
  }

  const handleVisibilityChange = (id: string, isVisible: boolean) => {
    setEditableWidgets((prev) => prev.map((widget) => (widget.id === id ? { ...widget, isVisible } : widget)))
  }

  const handleSaveChanges = () => {
    onSave(activeView.id, viewName, editableWidgets)
    onClose()
  }

  const handleSaveAsNewView = () => {
    onSaveAsNew(viewName, editableWidgets)
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px] flex flex-col max-h-[90vh]">
        <DialogHeader className="pr-10">
          <DialogTitle>Customize Dashboard View</DialogTitle>
          <DialogDescription>Change the name, toggle visibility, and drag to reorder widgets.</DialogDescription>
        </DialogHeader>
        <DialogClose
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="space-y-2 pt-4">
          <Label htmlFor="view-name" className="text-sm font-medium">
            View Name
          </Label>
          <Input
            id="view-name"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            placeholder="e.g., Financial Audit View"
          />
        </div>

        <div className="flex-grow overflow-y-auto pr-2 mt-4 border-t pt-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            <SortableContext items={editableWidgets.map((w) => w.id)} strategy={verticalListSortingStrategy}>
              {editableWidgets.map((widget) => (
                <SortableWidgetItem key={widget.id} widget={widget} onVisibilityChange={handleVisibilityChange} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between w-full pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={handleSaveChanges} disabled={!viewName.trim()} className="w-full sm:w-auto">
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={handleSaveAsNewView}
              disabled={!viewName.trim()}
              className="w-full sm:w-auto"
            >
              Save as New View
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
