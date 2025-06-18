"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AuditableEntity, AuditRecord } from "../_types/audit-universe-types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, FileText } from "lucide-react"
import Link from "next/link"

interface EntityDetailsPanelProps {
  entity: AuditableEntity | null
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

const getRiskLevelBadgeVariant = (riskLevel: AuditableEntity["riskLevel"]) => {
  switch (riskLevel) {
    case "High":
      return "destructive"
    case "Medium":
      return "secondary" // Or 'warning' if you have one
    case "Low":
      return "default" // Or 'success'
    default:
      return "outline"
  }
}

const getAuditStatusBadgeVariant = (status: AuditRecord["status"]) => {
  switch (status) {
    case "Completed":
      return "default"
    case "In Progress":
      return "secondary"
    case "Planned":
      return "outline"
    case "Cancelled":
      return "destructive"
    default:
      return "outline"
  }
}

export function EntityDetailsPanel({ entity, isOpen, onOpenChange }: EntityDetailsPanelProps) {
  if (!entity) {
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw] p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl">{entity.name}</SheetTitle>
              <SheetDescription>
                {entity.description || "Detailed information about this auditable entity."}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-semibold text-sm mb-1">Risk Level</h4>
                <Badge variant={getRiskLevelBadgeVariant(entity.riskLevel)}>{entity.riskLevel}</Badge>
              </div>
              {entity.owner && (
                <div>
                  <h4 className="font-semibold text-sm mb-1">Owner / Department</h4>
                  <p className="text-sm text-muted-foreground">
                    {entity.owner} {entity.department ? `(${entity.department})` : ""}
                  </p>
                </div>
              )}
              {entity.lastAuditDate && (
                <div>
                  <h4 className="font-semibold text-sm mb-1">Last Audit</h4>
                  <p className="text-sm text-muted-foreground">{new Date(entity.lastAuditDate).toLocaleDateString()}</p>
                </div>
              )}
              {entity.nextAuditDate && (
                <div>
                  <h4 className="font-semibold text-sm mb-1">Next Planned Audit</h4>
                  <p className="text-sm text-muted-foreground">{new Date(entity.nextAuditDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Audit History & Schedule</h3>
              {entity.audits && entity.audits.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Report</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entity.audits.map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell className="font-medium">{audit.title}</TableCell>
                        <TableCell>{audit.period}</TableCell>
                        <TableCell>
                          <Badge variant={getAuditStatusBadgeVariant(audit.status)}>{audit.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {audit.reportLink ? (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={audit.reportLink} target="_blank">
                                <FileText className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">No audit records available for this entity.</p>
              )}
            </div>
          </div>
          <SheetFooter className="p-6 pt-0 sticky bottom-0 bg-background border-t">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </SheetClose>
            <Button type="button">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Entity Profile
            </Button>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
