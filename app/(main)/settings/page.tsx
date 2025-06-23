"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, SettingsIcon as SystemSettingsIcon, Target } from "lucide-react" // Renamed SettingsIcon to avoid conflict
import ProfileSettings from "./_components/profile-settings"
import NotificationSettings from "./_components/notification-settings"
import SystemSettings from "./_components/system-settings"
import StrategicGoalsSettings from "./_components/strategic-goals-settings" // Import the new component
import { useMockUser } from "@/hooks/use-mock-user"

export default function SettingsPage() {
  const { user } = useMockUser()
  const isAdmin = user.role === "Audit Manager" // Or a more specific admin role

  // Determine the number of tabs for grid layout
  const tabCount = isAdmin ? 4 : 2 // Profile, Notifications always visible. System, Strategic Goals for admin.

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, notifications, system settings, and strategic goals.
        </p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList
          className={`grid w-full mb-6 ${
            tabCount === 4 ? "sm:grid-cols-4" : tabCount === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
          } sm:w-auto`}
          style={{ gridTemplateColumns: `repeat(${tabCount}, minmax(0, 1fr))` }}
        >
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="system">
                <SystemSettingsIcon className="mr-2 h-4 w-4" />
                System
              </TabsTrigger>
              <TabsTrigger value="strategic-goals">
                <Target className="mr-2 h-4 w-4" />
                Strategic Goals
              </TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        {isAdmin && (
          <>
            <TabsContent value="system">
              <SystemSettings />
            </TabsContent>
            <TabsContent value="strategic-goals">
              <StrategicGoalsSettings />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
