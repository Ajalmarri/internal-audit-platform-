"use client"

import type React from "react"
import { memo } from "react"
import type { NodeProps } from "reactflow"
import { Handle, Position } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import type { AuditableEntity, RiskLevel } from "../_types/audit-universe-types"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle2, ShieldQuestion } from "lucide-react"

const riskStyles: Record<RiskLevel, { icon: React.ElementType; colorClasses: string; borderClasses: string }> = {
  High: {
    icon: AlertTriangle,
    colorClasses: "bg-red-100 text-red-700",
    borderClasses: "border-red-500 hover:border-red-700",
  },
  Medium: {
    icon: ShieldQuestion,
    colorClasses: "bg-yellow-100 text-yellow-700",
    borderClasses: "border-yellow-500 hover:border-yellow-700",
  },
  Low: {
    icon: CheckCircle2,
    colorClasses: "bg-green-100 text-green-700",
    borderClasses: "border-green-500 hover:border-green-700",
  },
}

// data prop will contain our AuditableEntity and the onNodeClick callback
interface EntityNodeData {
  entity: AuditableEntity
  onNodeClick: (entity: AuditableEntity) => void
}

const EntityNode: React.FC<NodeProps<EntityNodeData>> = ({ data }) => {
  const { entity, onNodeClick } = data
  const RiskIcon = riskStyles[entity.riskLevel].icon

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Card
            onClick={() => onNodeClick(entity)}
            className={cn(
              "cursor-pointer transition-all duration-200 ease-in-out hover:shadow-xl transform hover:scale-105 w-64", // Fixed width for nodes
              riskStyles[entity.riskLevel].borderClasses,
              "border-2",
            )}
          >
            <CardHeader
              className={cn(
                "p-3 flex flex-row items-center justify-between space-y-0",
                riskStyles[entity.riskLevel].colorClasses,
              )}
            >
              <CardTitle className="text-base font-semibold">{entity.name}</CardTitle>
              <RiskIcon className="h-5 w-5" />
            </CardHeader>
            <CardContent className="p-3 space-y-1 text-xs">
              <p className="text-muted-foreground truncate">{entity.description}</p>
              <Badge
                variant="outline"
                className={cn(
                  riskStyles[entity.riskLevel].colorClasses,
                  riskStyles[entity.riskLevel].borderClasses,
                  "font-semibold text-xs px-1.5 py-0.5",
                )}
              >
                Risk: {entity.riskLevel}
              </Badge>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="bg-gray-800 text-white rounded-md p-2 text-sm">
          <p className="font-semibold">{entity.name}</p>
          <p>Risk Level: {entity.riskLevel}</p>
          <p>Last Audit: {entity.lastAudit}</p>
          <p>Next Audit: {entity.nextAudit}</p>
          <p className="mt-1 text-xs text-gray-300">Click for more details</p>
        </TooltipContent>
      </Tooltip>
      {/* Add Handles if you want to connect nodes manually or show connection points */}
      <Handle type="target" position={Position.Top} className="!bg-slate-500" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-500" />
    </TooltipProvider>
  )
}

export default memo(EntityNode)
