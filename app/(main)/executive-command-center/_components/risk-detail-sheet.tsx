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
import { Separator } from "@/components/ui/separator"
import { LinkIcon, ExternalLink } from "lucide-react"
import type { SelectedRiskData } from "./risk-trend-widget" // Assuming SelectedRiskData is exported or moved

// If SelectedRiskData is not exported from risk-trend-widget.tsx,
// you might need to move its definition to _types/command-center-types.ts
// For now, let's assume it's accessible or we'll define it locally for clarity.
// If it's not exported from risk-trend-widget, you'd define it here or in types:
/*
interface SelectedRiskData {
  riskId: string;
  riskName: string;
  date: string;
  details: {
    score: number;
    description: string;
    context?: string;
    links?: Array<{ title: string; url: string }>;
    additionalMetrics?: Array<{ label: string; value: string }>;
  };
}
*/

interface RiskDetailSheetProps {
  selectedRisk: SelectedRiskData | null
  onOpenChange: (open: boolean) => void
}

export function RiskDetailSheet({ selectedRisk, onOpenChange }: RiskDetailSheetProps) {
  if (!selectedRisk) {
    return null
  }

  const { riskName, date, details } = selectedRisk
  const { score, description, context, links, additionalMetrics } = details

  return (
    <Sheet open={!!selectedRisk} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw] p-6">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-2xl font-semibold text-foreground">{riskName}</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Details for {date} - Score: <span className="font-bold text-primary">{score.toFixed(1)}</span>
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />

        <div className="space-y-4 mb-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
          <div>
            <h4 className="text-md font-semibold mb-1 text-foreground">Description</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {context && (
            <div>
              <h4 className="text-md font-semibold mb-1 text-foreground">Context</h4>
              <p className="text-sm text-muted-foreground">{context}</p>
            </div>
          )}

          {additionalMetrics && additionalMetrics.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2 text-foreground">Additional Metrics</h4>
              <ul className="space-y-1 list-disc list-inside pl-1">
                {additionalMetrics.map((metric, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{metric.label}:</span> {metric.value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {links && links.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2 text-foreground">Relevant Links</h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      {link.title}
                      <ExternalLink className="ml-1 h-3 w-3 text-muted-foreground" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <SheetFooter className="mt-auto pt-4 border-t">
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
