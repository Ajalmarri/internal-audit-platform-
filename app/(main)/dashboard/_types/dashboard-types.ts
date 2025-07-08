import type React from "react"

export interface DashboardWidget {
  id: string
  title: string
  isVisible: boolean
  component: React.ComponentType<any>
  defaultOrder: number
  columnSpan?: 1 | 2 | 3
}

export type DashboardWidgetConfig = Omit<DashboardWidget, "component" | "defaultOrder"> & { order: number }

export interface DashboardView {
  id: string
  name: string
  config: DashboardWidgetConfig[]
}

export interface AllDashboardViews {
  [viewId: string]: DashboardView
}

export interface DashboardState {
  activeViewId: string
  views: AllDashboardViews
}
