"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Settings, PlusCircle } from "lucide-react"
import type { DashboardView, AllDashboardViews } from "../_types/dashboard-types"

interface DashboardHeaderProps {
  userName: string
  activeView: DashboardView
  allViews: AllDashboardViews
  onSwitchView: (viewId: string) => void
  onCustomize: () => void
  onCreateNewView: () => void
}

export default function DashboardHeader({
  userName,
  activeView,
  allViews,
  onSwitchView,
  onCustomize,
  onCreateNewView,
}: DashboardHeaderProps) {
  const greeting = `Good morning, ${userName}!`
  const otherViews = Object.values(allViews).filter((v) => v.id !== activeView.id)

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{greeting}</h1>
        <div className="mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 -ml-2 text-left h-auto">
                <span className="text-lg font-medium text-muted-foreground">{activeView.name}</span>
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Switch View</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {otherViews.map((view) => (
                <DropdownMenuItem key={view.id} onSelect={() => onSwitchView(view.id)}>
                  {view.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onCreateNewView}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Create New View</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Button variant="outline" onClick={onCustomize} className="shrink-0">
        <Settings className="mr-2 h-4 w-4" />
        Customize View
      </Button>
    </div>
  )
}
