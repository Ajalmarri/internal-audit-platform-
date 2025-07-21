import { ActionItemsWidget } from "./_components/action-items-widget"
import { DepartmentRiskProfileWidget } from "./_components/department-risk-profile-widget"
import { QuickLinksWidget } from "./_components/quick-links-widget"

export default function BusinessOwnerDashboard() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <ActionItemsWidget />
      <DepartmentRiskProfileWidget />
      <QuickLinksWidget />
    </div>
  )
}
