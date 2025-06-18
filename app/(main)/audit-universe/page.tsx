"use client"

import { useState, useEffect } from "react"
import { AuditUniverseDiagram } from "./_components/audit-universe-diagram"
import { EntityDetailsPanel } from "./_components/entity-details-panel"
import type { AuditableEntity, TreemapNode } from "./_types/audit-universe-types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

// Mock Data - Replace with API call
const mockAuditUniverseData: TreemapNode[] = [
  {
    id: "finance_dept",
    name: "Finance",
    value: 120,
    riskLevel: "High",
    lastAuditDate: "2025-01-15",
    nextAuditDate: "2026-01-15",
    description: "Handles all financial operations, reporting, and compliance for the organization.",
    owner: "Jane Doe",
    department: "Finance",
    audits: [
      {
        id: "FA001",
        title: "FY2024 Financial Statement Audit",
        period: "Q1 2025",
        status: "Completed",
        reportLink: "/reports/FA001",
      },
      {
        id: "FA002",
        title: "Internal Controls Over Financial Reporting (ICFR)",
        period: "Q3 2025",
        status: "In Progress",
      },
      { id: "FA003", title: "FY2025 Financial Statement Audit", period: "Q1 2026", status: "Planned" },
    ],
    children: [
      {
        id: "acc_payable",
        name: "Accounts Payable",
        value: 40,
        riskLevel: "Medium",
        lastAuditDate: "2024-11-01",
        nextAuditDate: "2025-11-01",
        audits: [],
      },
      {
        id: "acc_receivable",
        name: "Accounts Receivable",
        value: 50,
        riskLevel: "Medium",
        lastAuditDate: "2025-02-01",
        nextAuditDate: "2026-02-01",
        audits: [],
      },
      {
        id: "treasury",
        name: "Treasury",
        value: 30,
        riskLevel: "High",
        lastAuditDate: "2025-04-01",
        nextAuditDate: "2026-04-01",
        audits: [],
      },
    ],
  },
  {
    id: "it_dept",
    name: "IT",
    value: 150,
    riskLevel: "High",
    lastAuditDate: "2024-11-20",
    nextAuditDate: "2025-11-20",
    description: "Manages all information technology infrastructure, systems, and security.",
    owner: "John Smith",
    department: "Information Technology",
    audits: [
      {
        id: "IT001",
        title: "Cybersecurity Assessment",
        period: "Q4 2024",
        status: "Completed",
        reportLink: "/reports/IT001",
      },
      { id: "IT002", title: "IT General Controls (ITGC) Review", period: "Q2 2025", status: "In Progress" },
      { id: "IT003", title: "Data Privacy Audit (GDPR/CCPA)", period: "Q4 2025", status: "Planned" },
    ],
    children: [
      {
        id: "infra",
        name: "Infrastructure",
        value: 60,
        riskLevel: "High",
        lastAuditDate: "2024-10-01",
        nextAuditDate: "2025-10-01",
        audits: [],
      },
      {
        id: "apps",
        name: "Applications",
        value: 50,
        riskLevel: "Medium",
        lastAuditDate: "2025-03-01",
        nextAuditDate: "2026-03-01",
        audits: [],
      },
      {
        id: "security_ops",
        name: "Security Operations",
        value: 40,
        riskLevel: "High",
        lastAuditDate: "2025-05-01",
        nextAuditDate: "2026-05-01",
        audits: [],
      },
    ],
  },
  {
    id: "operations_dept",
    name: "Operations",
    value: 200,
    riskLevel: "Medium",
    lastAuditDate: "2025-03-10",
    nextAuditDate: "2026-03-10",
    description: "Oversees the core business operations and production processes.",
    owner: "Alice Brown",
    department: "Operations",
    audits: [
      {
        id: "OP001",
        title: "Supply Chain Process Review",
        period: "Q1 2025",
        status: "Completed",
        reportLink: "/reports/OP001",
      },
      { id: "OP002", title: "Quality Management System Audit", period: "Q3 2025", status: "Planned" },
    ],
    children: [
      {
        id: "manufacturing",
        name: "Manufacturing",
        value: 100,
        riskLevel: "Medium",
        lastAuditDate: "2025-02-15",
        nextAuditDate: "2026-02-15",
        audits: [],
      },
      {
        id: "logistics",
        name: "Logistics",
        value: 60,
        riskLevel: "Low",
        lastAuditDate: "2024-09-01",
        nextAuditDate: "2025-09-01",
        audits: [],
      },
      {
        id: "customer_service",
        name: "Customer Service",
        value: 40,
        riskLevel: "Low",
        lastAuditDate: "2025-04-10",
        nextAuditDate: "2026-04-10",
        audits: [],
      },
    ],
  },
  {
    id: "hr_dept",
    name: "Human Resources",
    value: 80,
    riskLevel: "Low",
    lastAuditDate: "2024-08-01",
    nextAuditDate: "2025-08-01",
    description: "Manages employee relations, payroll, recruitment, and HR compliance.",
    owner: "Robert Green",
    department: "Human Resources",
    audits: [
      {
        id: "HR001",
        title: "Payroll Process Audit",
        period: "Q3 2024",
        status: "Completed",
        reportLink: "/reports/HR001",
      },
      { id: "HR002", title: "Hiring Practices Review", period: "Q2 2025", status: "Planned" },
    ],
  },
  {
    id: "procurement_dept",
    name: "Procurement",
    value: 90,
    riskLevel: "Medium",
    lastAuditDate: "2025-05-01",
    nextAuditDate: "2026-05-01",
    description: "Responsible for sourcing and purchasing goods and services.",
    owner: "Emily White",
    department: "Procurement",
    audits: [{ id: "PR001", title: "Vendor Management Audit", period: "Q2 2025", status: "In Progress" }],
  },
]

export default function AuditUniversePage() {
  const [selectedEntity, setSelectedEntity] = useState<AuditableEntity | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [universeData, setUniverseData] = useState<TreemapNode[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      setUniverseData(mockAuditUniverseData)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleEntityClick = (entity: AuditableEntity) => {
    setSelectedEntity(entity)
    setIsPanelOpen(true)
  }

  const handlePanelOpenChange = (open: boolean) => {
    setIsPanelOpen(open)
    if (!open) {
      setSelectedEntity(null)
    }
  }

  if (isLoading) {
    // Basic loading state, you can replace this with the loading.tsx skeleton
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="h-[600px] bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Audit Universe</h1>
        <p className="text-muted-foreground mt-1">
          An interactive overview of all auditable entities, their risk profiles, and audit cycles.
        </p>
      </header>

      <Alert className="mb-6">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Interactive Diagram</AlertTitle>
        <AlertDescription>
          Hover over an entity for a quick summary. Click on an entity to view detailed information in a side panel.
          Colors indicate risk level: <span className="font-semibold text-red-500">Red (High)</span>,{" "}
          <span className="font-semibold text-yellow-500">Yellow (Medium)</span>,{" "}
          <span className="font-semibold text-green-500">Green (Low)</span>.
        </AlertDescription>
      </Alert>

      <div className="bg-card p-4 rounded-lg shadow">
        <AuditUniverseDiagram data={universeData} onEntityClick={handleEntityClick} />
      </div>

      <EntityDetailsPanel entity={selectedEntity} isOpen={isPanelOpen} onOpenChange={handlePanelOpenChange} />
    </div>
  )
}
