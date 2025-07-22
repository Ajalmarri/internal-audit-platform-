"use client"

import { MyActionItemsCard } from "./_components/my-action-items-card"
import { DepartmentRiskProfileCard } from "./_components/department-risk-profile-card"
import { KpiSummaryCard } from "./_components/kpi-summary-card"
import { QuickLinksCard } from "./_components/quick-links-card"

export default function BusinessOwnerDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Business Owner Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening in your department.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-2 xl:col-span-2">
          <MyActionItemsCard />
        </div>
        <div className="lg:col-span-2 xl:col-span-2">
          <DepartmentRiskProfileCard />
        </div>
        <div className="col-span-1 lg:col-span-2 xl:col-span-4">
          <KpiSummaryCard />
        </div>
        <div className="col-span-1 lg:col-span-2 xl:col-span-4">
          <QuickLinksCard />
        </div>
      </div>
    </div>
  )
}
