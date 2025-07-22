"use client"

import { useMockBusinessOwner } from "@/hooks/use-mock-user"
import { MyActionItemsCard } from "@/app/(portal)/dashboard/_components/my-action-items-card"
import { DepartmentRiskProfileCard } from "@/app/(portal)/dashboard/_components/department-risk-profile-card"
import { KpiSummaryCard } from "@/app/(portal)/dashboard/_components/kpi-summary-card"
import { QuickLinksCard } from "@/app/(portal)/dashboard/_components/quick-links-card"

export default function BusinessOwnerDashboardPage() {
  const user = useMockBusinessOwner()

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Welcome back, {user.name.split(" ")[0]}!</h1>
        <p className="text-muted-foreground">
          Here's your personalized dashboard for the {user.department} department.
        </p>
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
