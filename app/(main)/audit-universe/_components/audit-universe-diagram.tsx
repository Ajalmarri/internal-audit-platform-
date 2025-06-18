"use client"

import type React from "react"
import { ResponsiveContainer, Treemap, Tooltip } from "recharts"
import type { TreemapNode, AuditableEntity, RiskLevel } from "../_types/audit-universe-types"

interface AuditUniverseDiagramProps {
  data: TreemapNode[]
  onEntityClick: (entity: AuditableEntity) => void
}

const getRiskColor = (riskLevel: RiskLevel): string => {
  // These HSL variables should be defined in your Tailwind CSS theme (globals.css or tailwind.config.js)
  // Fallbacks are provided if not perfectly themed.
  switch (riskLevel) {
    case "High":
      return "hsl(var(--destructive))" // Typically Red
    case "Medium":
      return "hsl(var(--primary))" // Typically Blue/Indigo (Consider theming for Yellow/Orange)
    case "Low":
      return "hsl(var(--secondary))" // Typically Gray (Consider theming for Green)
    default:
      return "hsl(var(--muted-foreground))"
  }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
}

const CustomTooltipContent: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as AuditableEntity // The node data
    return (
      <div className="bg-popover text-popover-foreground border p-3 shadow-lg rounded-md text-sm">
        <p className="font-bold text-base mb-1">{data.name}</p>
        <p>
          <strong>Risk Level:</strong>{" "}
          <span style={{ color: getRiskColor(data.riskLevel), fontWeight: "bold" }}>{data.riskLevel}</span>
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
  payload?: any // This will contain the original node data
  name?: string // This is the 'name' key from the data
  onClick?: (entity: AuditableEntity) => void
}

const CustomizedContentComponent: React.FC<CustomizedContentProps> = (props) => {
  const { depth, x, y, width, height, name, onClick, payload } = props

  if (!width || !height || !payload) return null

  const entityData = payload as AuditableEntity // Cast payload to your entity type

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: getRiskColor(entityData.riskLevel),
          stroke: "hsl(var(--background))", // Use background for stroke for better theme adaptability
          strokeWidth: 2 / (depth || 1) + 1,
          strokeOpacity: 0.8,
          cursor: "pointer",
        }}
        onClick={() => onClick && onClick(entityData)}
        aria-label={`Entity: ${entityData.name}, Risk: ${entityData.riskLevel}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick && onClick(entityData)
        }}
      />
      {/* Adjust text visibility based on size */}
      {width * height > 2500 && width > 100 && height > 25 ? (
        <text
          x={(x || 0) + (width || 0) / 2}
          y={(y || 0) + (height || 0) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={depth === 1 ? "hsl(var(--primary-foreground))" : "hsl(var(--secondary-foreground))"} // Different color for deeper levels if needed
          fontSize={Math.max(10, Math.min(16, width / 8, height / 3))} // Dynamic font size
          fontWeight="bold"
          style={{ pointerEvents: "none", userSelect: "none" }}
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
        aspectRatio={16 / 9} // Or 4/3, experiment for best look
        stroke="hsl(var(--background))"
        content={<CustomizedContentComponent onClick={onEntityClick} />}
        isAnimationActive={true}
        animationDuration={500}
        animationEasing="ease-in-out"
      >
        <Tooltip content={<CustomTooltipContent />} />
      </Treemap>
    </ResponsiveContainer>
  )
}
