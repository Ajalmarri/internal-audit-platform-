"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, SettingsIcon as SettingsIconLucide } from "lucide-react" // Renamed to avoid conflict
import ProfileSettings from "./_components/profile-settings"
import NotificationSettings from "./_components/notification-settings"
import SystemSettings from "./_components/system-settings"
import { useMockUser } from "@/hooks/use-mock-user"

export default function SettingsPage() {
  const user = useMockUser() // Get the user data
  // Determine if the user is an admin based on their role
  // For this example, "Audit Manager" is considered an admin.
  // You might have a more specific role like "System Administrator".
  const isAdmin = user.role === "Audit Manager" || user.role === "System Administrator"

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile, notifications, and system settings.</p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className={`grid w-full mb-6 ${isAdmin ? "sm:grid-cols-3" : "sm:grid-cols-2"} sm:w-auto`}>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          {/* Conditionally render the System Settings tab if the user is an admin */}
          {isAdmin && (
            <TabsTrigger value="system">
              <SettingsIconLucide className="mr-2 h-4 w-4" />
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
        {/* Conditionally render the System Settings content if the user is an admin */}
        {isAdmin && (
          <TabsContent value="system">
            <SystemSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
