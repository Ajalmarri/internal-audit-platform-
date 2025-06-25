"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AuditableEntity, AuditRecord, RiskLevel } from "../_types/audit-universe-types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface EntityDetailsSheetProps {
  entity: AuditableEntity | null
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

const riskLevelColors: Record<RiskLevel, string> = {
  High: "bg-red-500 text-white",
  Medium: "bg-yellow-500 text-black",
  Low: "bg-green-500 text-white",
}

const auditStatusColors: Record<AuditRecord["status"], string> = {
  Past: "bg-gray-200 text-gray-700",
  Present: "bg-blue-200 text-blue-700",
  Planned: "bg-purple-200 text-purple-700",
}

export default function EntityDetailsSheet({ entity, isOpen, onOpenChange }: EntityDetailsSheetProps) {
  if (!entity) return null

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full">
        <SheetHeader>
          <SheetTitle className="text-2xl">{entity.name}</SheetTitle>
          <SheetDescription>{entity.description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-150px)] pr-4 mt-4">
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Risk Profile</h3>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Risk Level:</span>
                <Badge className={cn(riskLevelColors[entity.riskLevel])}>{entity.riskLevel}</Badge>
              </div>
              <p className="text-sm">
                <span className="font-semibold">Last Audit:</span> {entity.lastAudit}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Next Audit:</span> {entity.nextAudit}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Related Audits</h3>
              {entity.relatedAudits.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audit Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Auditor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entity.relatedAudits.map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell>{audit.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("border-transparent", auditStatusColors[audit.status])}
                          >
                            {audit.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{audit.date}</TableCell>
                        <TableCell>{audit.auditor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">No related audits found for this entity.</p>
              )}
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
