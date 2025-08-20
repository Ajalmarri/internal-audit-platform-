"use client"

import { useState, useEffect, useMemo } from "react"
import AssignmentsCard from "./_components/assignments-card"
import CalendarCard from "./_components/calendar-card"
import InsightHubCard from "./_components/insight-hub-card"
import TeamAvailabilityCard from "./_components/team-availability-card"
import DashboardHeader from "./_components/dashboard-header"
import CustomizeDashboardModal from "./_components/customize-dashboard-modal"
import type { DashboardWidget, DashboardWidgetConfig, DashboardState, DashboardView } from "./_types/dashboard-types"
import ProtectedRoute from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"

const ALL_AVAILABLE_WIDGETS_MASTER_LIST: DashboardWidget[] = [
  {
    id: "assignments",
    title: "Assignments",
    component: AssignmentsCard,
    defaultOrder: 0,
    isVisible: true,
    columnSpan: 2,
  },
  { id: "calendar", title: "Calendar", component: CalendarCard, defaultOrder: 1, isVisible: true, columnSpan: 1 },
  {
    id: "insightHub",
    title: "Insight Hub",
    component: InsightHubCard,
    defaultOrder: 2,
    isVisible: true,
    columnSpan: 2,
  },
  {
    id: "teamAvailability",
    title: "Team & Availability",
    component: TeamAvailabilityCard,
    defaultOrder: 3,
    isVisible: true,
    columnSpan: 1,
  },
]

const getDefaultWidgetConfig = (): DashboardWidgetConfig[] => {
  return ALL_AVAILABLE_WIDGETS_MASTER_LIST.map((widget) => ({
    id: widget.id,
    title: widget.title,
    isVisible: widget.isVisible,
    order: widget.defaultOrder,
    columnSpan: widget.columnSpan,
  })).sort((a, b) => a.order - b.order)
}

const LOCAL_STORAGE_KEY = "dashboardState_v1"

const getInitialState = (): DashboardState => {
  const defaultConfig = getDefaultWidgetConfig()
  return {
    activeViewId: "default",
    views: {
      default: {
        id: "default",
        name: "Default Dashboard",
        config: defaultConfig,
      },
      financial: {
        id: "financial",
        name: "Financial Audit View",
        config: defaultConfig.map((w) => ({
          ...w,
          isVisible: ["assignments", "calendar", "teamAvailability"].includes(w.id),
        })),
      },
      risk: {
        id: "risk",
        name: "Risk Committee View",
        config: defaultConfig.map((w) => ({
          ...w,
          isVisible: ["insightHub", "assignments"].includes(w.id),
        })),
      },
    },
  }
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [dashboardState, setDashboardState] = useState<DashboardState | null>(null)
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Get the real user's first name for the greeting
  const userName = user?.firstName || "User"

  useEffect(() => {
    console.log("Dashboard: useEffect running")
    setIsClient(true)
    try {
      const savedStateRaw = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (savedStateRaw) {
        const savedState = JSON.parse(savedStateRaw) as DashboardState
        console.log("Dashboard: Loading saved state", savedState)
        setDashboardState(savedState)
      } else {
        const initialState = getInitialState()
        console.log("Dashboard: Setting initial state", initialState)
        setDashboardState(initialState)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialState))
      }
    } catch (error) {
      console.error("Dashboard: Error loading state", error)
      const initialState = getInitialState()
      setDashboardState(initialState)
    }
  }, [])

  console.log("Dashboard: Render state", { isClient, dashboardState: !!dashboardState })

  const updateStateAndLocalStorage = (newState: DashboardState) => {
    setDashboardState(newState)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState))
  }

  const handleSwitchView = (viewId: string) => {
    if (!dashboardState) return
    const newState = { ...dashboardState, activeViewId: viewId }
    updateStateAndLocalStorage(newState)
  }

  const handleSave = (viewId: string, viewName: string, updatedConfig: DashboardWidgetConfig[]) => {
    if (!dashboardState) return
    const newViews = { ...dashboardState.views }
    newViews[viewId] = { ...newViews[viewId], name: viewName, config: updatedConfig.sort((a, b) => a.order - b.order) }
    const newState = { ...dashboardState, views: newViews }
    updateStateAndLocalStorage(newState)
  }

  const handleSaveAsNew = (viewName: string, updatedConfig: DashboardWidgetConfig[]) => {
    if (!dashboardState) return
    const newViewId = `view_${Date.now()}`
    const newView: DashboardView = {
      id: newViewId,
      name: viewName,
      config: updatedConfig.sort((a, b) => a.order - b.order),
    }
    const newViews = { ...dashboardState.views, [newViewId]: newView }
    const newState = { ...dashboardState, views: newViews, activeViewId: newViewId }
    updateStateAndLocalStorage(newState)
  }

  const handleCreateNewView = () => {
    setIsCustomizeModalOpen(true)
  }

  const activeView = useMemo(() => {
    if (!dashboardState) return null
    return dashboardState.views[dashboardState.activeViewId]
  }, [dashboardState])

  const renderedWidgets = useMemo(() => {
    if (!isClient || !activeView) return []

    return activeView.config
      .filter((widget) => widget.isVisible)
      .map((widgetConfig) => {
        const WidgetComponent = ALL_AVAILABLE_WIDGETS_MASTER_LIST.find((w) => w.id === widgetConfig.id)?.component
        if (!WidgetComponent) return null

        const gridColumnClass = widgetConfig.columnSpan === 2 ? "lg:col-span-2" : "lg:col-span-1"
        return (
          <div key={widgetConfig.id} className={gridColumnClass}>
            <WidgetComponent />
          </div>
        )
      })
  }, [isClient, activeView])

  if (!isClient || !dashboardState || !activeView) {
    console.log("Dashboard: Showing loading state", { isClient, dashboardState: !!dashboardState, activeView: !!activeView })
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
            <div className="h-7 w-48 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-36 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 h-64 bg-muted rounded-lg animate-pulse"></div>
          <div className="lg:col-span-1 h-64 bg-muted rounded-lg animate-pulse"></div>
          <div className="lg:col-span-2 h-64 bg-muted rounded-lg animate-pulse"></div>
          <div className="lg:col-span-1 h-64 bg-muted rounded-lg animate-pulse"></div>
        </div>
      </div>
    )
  }

  console.log("Dashboard: Rendering full dashboard", { activeView, renderedWidgets: renderedWidgets.length })

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6">
        <DashboardHeader
          userName={userName}
          activeView={activeView}
          allViews={dashboardState.views}
          onSwitchView={handleSwitchView}
          onCustomize={() => setIsCustomizeModalOpen(true)}
          onCreateNewView={handleCreateNewView}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">{renderedWidgets}</div>

        {isClient && (
          <CustomizeDashboardModal
            isOpen={isCustomizeModalOpen}
            onClose={() => setIsCustomizeModalOpen(false)}
            activeView={activeView}
            onSave={handleSave}
            onSaveAsNew={handleSaveAsNew}
            allAvailableWidgetsMasterList={ALL_AVAILABLE_WIDGETS_MASTER_LIST.map(
              ({ component, defaultOrder, isVisible, ...rest }) => rest,
            )}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
