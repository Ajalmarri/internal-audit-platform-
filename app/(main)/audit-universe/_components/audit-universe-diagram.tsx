"use client"

import type React from "react"
import { ResponsiveContainer, Treemap, Tooltip } from "recharts"
import type { TreemapNode, AuditableEntity } from "../_types/audit-universe-types"

interface AuditUniverseDiagramProps {
  data: TreemapNode[]
  onEntityClick: (entity: AuditableEntity) => void
}

const COLORS = ["#8889DD", "#9597E4", "#8DC77B", "#A5D297", "#E2CF45", "#F8C12D"]

const getRiskColor = (riskLevel: AuditableEntity["riskLevel"]): string => {
  switch (riskLevel) {
    case "High":
      return "hsl(var(--destructive))" // Red
    case "Medium":
      return "hsl(var(--warning))" // Yellow/Orange - assuming you have a warning color
    case "Low":
      return "hsl(var(--success))" // Green - assuming you have a success color
    default:
      return "hsl(var(--muted-foreground))" // Grey
  }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

const CustomTooltipContent: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload // The node data is in payload[0].payload
    return (
      <div className="bg-background border p-3 shadow-lg rounded-md text-sm">
        <p className="font-bold text-base mb-1">{data.name}</p>
        <p>
          <strong>Risk Level:</strong> <span style={{ color: getRiskColor(data.riskLevel) }}>{data.riskLevel}</span>
        </p>
        {data.lastAuditDate && (
          <p>
            <strong>Last Audit:</strong> {new Date(data.lastAuditDate).toLocaleDateString()}
          </p>
        )}
        {data.nextAuditDate && (
          <p>
            <strong>Next Audit:</strong> {new Date(data.nextAuditDate).toLocaleDateString()}
          </p>
        )}
        {data.value && (
          <p>
            <strong>Relative Size:</strong> {data.value}
          </p>
        )}
      </div>
    )
  }
  return null
}

interface CustomizedContentProps {
  root?: any
  depth?: number
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  payload?: any
  colors?: string[]
  rank?: number
  name?: string
  onClick?: (entity: AuditableEntity) => void
}

const CustomizedContent: React.FC<CustomizedContentProps> = (props) => {
  const { root, depth, x, y, width, height, index, name, onClick, payload } = props

  if (!width || !height || !payload) return null

  const entityData = payload as AuditableEntity

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: getRiskColor(entityData.riskLevel),
          stroke: "hsl(var(--background))",
          strokeWidth: 2 / (depth || 1) + 1,
          strokeOpacity: 1 / (depth || 1) + 0.5,
          cursor: "pointer",
        }}
        onClick={() => onClick && onClick(entityData)}
      />
      {width * height > 2000 && width > 80 && height > 20 ? ( // Only show text if block is large enough
        <text
          x={(x || 0) + (width || 0) / 2}
          y={(y || 0) + (height || 0) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="hsl(var(--primary-foreground))"
          fontSize={14}
          fontWeight="bold"
          style={{ pointerEvents: "none" }}
        >
          {name}
        </text>
      ) : null}
    </g>
  )
}

export function AuditUniverseDiagram({ data, onEntityClick }: AuditUniverseDiagramProps) {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <Treemap
        data={data}
        dataKey="value" // Key for determining rect size
        ratio={4 / 3}
        stroke="hsl(var(--background))"
        fill="hsl(var(--muted))"
        content={<CustomizedContent onClick={onEntityClick} />}
        isAnimationActive={true}
        animationDuration={500}
      >
        <Tooltip content={<CustomTooltipContent />} />
      </Treemap>
    </ResponsiveContainer>
  )
}
