import { ActionItemsWidget } from "./_components/action-items-widget"
import { DepartmentRiskProfileWidget } from "./_components/department-risk-profile-widget"
import { QuickLinksWidget } from "./_components/quick-links-widget"

export default function BusinessOwnerDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <ActionItemsWidget />
      <DepartmentRiskProfileWidget />
      <QuickLinksWidget />
    </div>
  )
}
