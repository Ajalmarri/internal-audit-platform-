"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, SettingsIcon } from "lucide-react"
import ProfileSettings from "./_components/profile-settings"
import NotificationSettings from "./_components/notification-settings"
import SystemSettings from "./_components/system-settings"
import { useMockUser } from "@/hooks/use-mock-user"

export default function SettingsPage() {
  const { user } = useMockUser()
  const isAdmin = user.role === "Audit Manager" // Or a more specific admin role

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile, notifications, and system settings.</p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-[400px] sm:grid-cols-3 mb-6">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="system">
              <SettingsIcon className="mr-2 h-4 w-4" />
              System
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        {isAdmin && (
          <TabsContent value="system">
            <SystemSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
