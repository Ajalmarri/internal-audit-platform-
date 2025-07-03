"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { X, Users, User, ChevronsUpDown, Share2 } from "lucide-react"
import type {
  GeneratedReport,
  PlatformUserOrGroup,
  SelectedRecipient,
  ReportPermission,
  ShareDetailsPayload,
} from "../_types/report-types"
import { mockUsersAndGroupsForSharing } from "../_types/report-types"

interface ShareReportModalProps {
  isOpen: boolean
  onClose: () => void
  report: GeneratedReport | null
  onShare: (shareDetails: ShareDetailsPayload) => void
}

export function ShareReportModal({ isOpen, onClose, report, onShare }: ShareReportModalProps) {
  const [selectedRecipients, setSelectedRecipients] = useState<SelectedRecipient[]>([])
  const [message, setMessage] = useState("")
  const [availableRecipients, setAvailableRecipients] = useState<PlatformUserOrGroup[]>(mockUsersAndGroupsForSharing)
  const [popoverOpen, setPopoverOpen] = useState(false)

  useEffect(() => {
    // Reset state when modal opens for a new report or closes
    if (isOpen) {
      setSelectedRecipients([])
      setMessage("")
      // Filter out already selected recipients from available list
      setAvailableRecipients(
        mockUsersAndGroupsForSharing.filter((ar) => !selectedRecipients.find((sr) => sr.id === ar.id)),
      )
    }
  }, [isOpen, report]) // report dependency ensures reset if a different report is opened

  const handleAddRecipient = (recipient: PlatformUserOrGroup) => {
    if (!selectedRecipients.find((r) => r.id === recipient.id)) {
      setSelectedRecipients([...selectedRecipients, { ...recipient, permission: "view" }])
      setAvailableRecipients(availableRecipients.filter((r) => r.id !== recipient.id))
    }
    setPopoverOpen(false) // Close popover after selection
  }

  const handleRemoveRecipient = (recipientId: string) => {
    const removedRecipient = selectedRecipients.find((r) => r.id === recipientId)
    setSelectedRecipients(selectedRecipients.filter((r) => r.id !== recipientId))
    if (removedRecipient && !availableRecipients.find((r) => r.id === removedRecipient.id)) {
      // Add back to available list if it's from the mock list
      const originalRecipient = mockUsersAndGroupsForSharing.find((r) => r.id === removedRecipient.id)
      if (originalRecipient) {
        setAvailableRecipients([...availableRecipients, originalRecipient].sort((a, b) => a.name.localeCompare(b.name)))
      }
    }
  }

  const handlePermissionChange = (recipientId: string, permission: ReportPermission) => {
    setSelectedRecipients(selectedRecipients.map((r) => (r.id === recipientId ? { ...r, permission } : r)))
  }

  const handleSubmit = () => {
    if (!report) return
    if (selectedRecipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please add at least one recipient to share the report.",
        variant: "destructive",
      })
      return
    }

    const shareDetails: ShareDetailsPayload = {
      reportId: report.id,
      recipients: selectedRecipients,
      message: message.trim() || undefined,
    }
    onShare(shareDetails)
    onClose() // Close modal after sharing
  }

  if (!report) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="mr-2 h-5 w-5" /> Share Report: {report.title}
          </DialogTitle>
          <DialogDescription>
            Share this report with specific users or groups and set their permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Recipient Input */}
          <div className="space-y-2">
            <Label htmlFor="recipient-search">Add Recipients</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between"
                >
                  Select users or groups...
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search users or groups..." />
                  <CommandList>
                    <CommandEmpty>No recipients found.</CommandEmpty>
                    <CommandGroup>
                      {availableRecipients.map((recipient) => (
                        <CommandItem
                          key={recipient.id}
                          value={recipient.name}
                          onSelect={() => handleAddRecipient(recipient)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            {recipient.type === "User" ? (
                              <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                            )}
                            {recipient.name}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Selected Recipients List */}
          {selectedRecipients.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Recipients</Label>
              <ScrollArea className="h-40 rounded-md border p-2">
                <div className="space-y-2">
                  {selectedRecipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center">
                        {recipient.type === "User" ? (
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">{recipient.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={recipient.permission}
                          onValueChange={(value: ReportPermission) => handlePermissionChange(recipient.id, value)}
                        >
                          <SelectTrigger className="h-8 w-[150px] text-xs">
                            <SelectValue placeholder="Set permission" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">Can view</SelectItem>
                            <SelectItem value="comment">Can view and comment</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleRemoveRecipient(recipient.id)}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="share-message">Optional Message</Label>
            <Textarea
              id="share-message"
              placeholder="Add a brief message for the recipients..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>
            <Share2 className="mr-2 h-4 w-4" /> Share Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
