"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { SampledAuditItem } from "../_types/qa-review-types"
import { Search } from "lucide-react"

interface SampledItemPickerModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  availableItems: SampledAuditItem[]
  initialSelectedIds: string[]
  onConfirmSelection: (selectedIds: string[]) => void
}

export function SampledItemPickerModal({
  isOpen,
  onOpenChange,
  availableItems,
  initialSelectedIds,
  onConfirmSelection,
}: SampledItemPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentSelectedIds, setCurrentSelectedIds] = useState<string[]>(initialSelectedIds)

  useEffect(() => {
    // Reset current selection when modal opens with new initialSelectedIds
    if (isOpen) {
      setCurrentSelectedIds(initialSelectedIds)
    }
  }, [isOpen, initialSelectedIds])

  const filteredItems = useMemo(() => {
    if (!searchTerm) return availableItems
    return availableItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [availableItems, searchTerm])

  const handleToggleItem = (itemId: string) => {
    setCurrentSelectedIds((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleConfirm = () => {
    onConfirmSelection(currentSelectedIds)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
    // Optionally reset currentSelectedIds to initialSelectedIds if desired on cancel
    // setCurrentSelectedIds(initialSelectedIds);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Select Sampled Items for Review</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, type, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full mb-4"
          />
        </div>
        <ScrollArea className="flex-grow border rounded-md">
          <div className="p-4 space-y-2">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => handleToggleItem(item.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={currentSelectedIds.includes(item.id)}
                      onCheckedChange={() => handleToggleItem(item.id)}
                      onClick={(e) => e.stopPropagation()} // Prevent row click from double toggling
                    />
                    <label htmlFor={`item-${item.id}`} className="font-medium cursor-pointer">
                      {item.name}
                    </label>
                  </div>
                  <Badge variant="outline">{item.type}</Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No items match your search.</p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Confirm ({currentSelectedIds.length} selected)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
