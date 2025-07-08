"use client"

import { useState, useMemo, useCallback } from "react"
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  type Node,
  type Edge,
  type Connection,
  type Viewport,
} from "reactflow"
import "reactflow/dist/style.css"

import EntityDetailsSheet from "./_components/entity-details-sheet"
import EntityNode from "./_components/entity-node" // Import the custom node
import type { AuditableEntity } from "./_types/audit-universe-types"

// Mock Data - ensure positions are defined and add parentId for edges
const mockEntities: AuditableEntity[] = [
  {
    id: "corporate_hq",
    name: "Corporate HQ",
    description: "Central governing body of the organization.",
    riskLevel: "Medium",
    lastAudit: "Q4 2024",
    nextAudit: "Q4 2026",
    category: "Business Unit",
    relatedAudits: [],
    position: { x: 500, y: 50 },
  },
  {
    id: "finance_dept",
    name: "Finance Department",
    description: "Handles all financial planning, reporting, and compliance.",
    riskLevel: "High",
    lastAudit: "Q1 2025",
    nextAudit: "Q1 2026",
    category: "Department",
    parentId: "corporate_hq",
    relatedAudits: [
      {
        id: "fin-audit-001",
        name: "Annual Financial Statement Audit 2024",
        status: "Past",
        date: "2025-03-15",
        auditor: "PwC",
      },
      { id: "fin-audit-002", name: "ICFR Review", status: "Present", date: "Ongoing", auditor: "Internal Audit" },
    ],
    position: { x: 200, y: 200 },
  },
  {
    id: "it_dept",
    name: "IT Department",
    description: "Manages IT infrastructure, systems, and security.",
    riskLevel: "High",
    lastAudit: "Q4 2024",
    nextAudit: "Q4 2025",
    category: "Department",
    parentId: "corporate_hq",
    relatedAudits: [
      { id: "it-audit-001", name: "Cybersecurity Posture Review", status: "Past", date: "2024-12-10", auditor: "EY" },
    ],
    position: { x: 500, y: 200 },
  },
  {
    id: "hr_dept",
    name: "Human Resources",
    description: "Manages employee relations, recruitment, payroll.",
    riskLevel: "Medium",
    lastAudit: "Q3 2024",
    nextAudit: "Q3 2026",
    category: "Department",
    parentId: "corporate_hq",
    relatedAudits: [],
    position: { x: 800, y: 200 },
  },
  {
    id: "operations_bu",
    name: "Operations Business Unit",
    description: "Oversees core business operations and production.",
    riskLevel: "Medium",
    lastAudit: "Q2 2025",
    nextAudit: "Q2 2027",
    category: "Business Unit",
    relatedAudits: [],
    position: { x: 500, y: 400 },
  },
  {
    id: "procurement_process",
    name: "Procurement Process",
    description: "Handles sourcing, purchasing, and vendor management.",
    riskLevel: "Low",
    lastAudit: "Q1 2024",
    nextAudit: "Q1 2027",
    category: "Key Process",
    parentId: "operations_bu",
    relatedAudits: [],
    position: { x: 350, y: 550 },
  },
  {
    id: "manufacturing_process",
    name: "Manufacturing Process",
    description: "Core production activities.",
    riskLevel: "High",
    lastAudit: "Q3 2025",
    nextAudit: "Q3 2026",
    category: "Key Process",
    parentId: "operations_bu",
    relatedAudits: [],
    position: { x: 650, y: 550 },
  },
]

const nodeTypes = {
  entityNode: EntityNode,
}

const initialViewport: Viewport = { x: 0, y: 0, zoom: 0.8 }

export default function AuditUniversePageReactFlow() {
  const [selectedEntity, setSelectedEntity] = useState<AuditableEntity | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleNodeClick = useCallback((entity: AuditableEntity) => {
    setSelectedEntity(entity)
    setIsSheetOpen(true)
  }, [])

  const initialNodes: Node<any>[] = useMemo(
    () =>
      mockEntities.map((entity) => ({
        id: entity.id,
        type: "entityNode", // Custom node type
        position: entity.position,
        data: { entity, onNodeClick: handleNodeClick }, // Pass entity and callback
      })),
    [handleNodeClick],
  )

  const initialEdges: Edge[] = useMemo(
    () =>
      mockEntities
        .filter((entity) => entity.parentId)
        .map((entity) => ({
          id: `e-${entity.parentId}-${entity.id}`,
          source: entity.parentId!,
          target: entity.id,
          animated: entity.riskLevel === "High", // Animate edges for high-risk connections
          style: {
            strokeWidth: 2,
            stroke: entity.riskLevel === "High" ? "#ef4444" : entity.riskLevel === "Medium" ? "#f59e0b" : "#22c55e",
          },
        })),
    [],
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  return (
    <div className="h-[calc(100vh-var(--header-height,80px))] w-full flex flex-col">
      {" "}
      {/* Adjust header height as needed */}
      <header className="p-4 border-b bg-background">
        <h1 className="text-2xl font-bold tracking-tight">Audit Universe</h1>
        <p className="text-sm text-muted-foreground">
          An interactive overview of all auditable entities, their risk profiles, and audit cycles.
        </p>
      </header>
      <div className="flex-grow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes} // Register custom node types
          fitView
          defaultViewport={initialViewport}
          className="bg-muted/30"
        >
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <Background gap={16} color="#e0e0e0" />
        </ReactFlow>
      </div>
      <EntityDetailsSheet entity={selectedEntity} isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  )
}
