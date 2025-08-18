"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"

export default function ProfileSettings() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [currentLanguage, setCurrentLanguage] = useState("en") // Default language

  // Handler for language change
  const handleLanguageChange = (value: string) => {
    setCurrentLanguage(value)
    // Add logic here to actually change the application's language if i18n is set up
    console.log("Language changed to:", value)
  }

  // Handler for theme change
  const handleThemeChange = (value: string) => {
    setTheme(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your personal information and application preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg?width=200&height=200" alt={user?.firstName || "User"} />
            <AvatarFallback>
              {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : "UA"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <Button variant="outline">Upload New Photo</Button>
            <p className="text-sm text-muted-foreground">Recommended size: 200x200px</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={user ? `${user.firstName} ${user.lastName}` : "User"} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={user?.roleName || "Unknown Role"} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={user?.email || "user@example.com"} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={currentLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Theme</Label>
          <RadioGroup
            defaultValue={theme}
            onValueChange={handleThemeChange}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="font-normal">
                Light Mode
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="font-normal">
                Dark Mode
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="font-normal">
                System Default
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
