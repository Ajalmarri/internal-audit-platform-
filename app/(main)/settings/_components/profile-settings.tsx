"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
import { useMockUser } from "@/hooks/use-mock-user" // Assuming this hook provides the user data

export default function ProfileSettings() {
  // Use the mock user hook, overriding defaults to match the request
  const user = useMockUser({
    name: "John Doe",
    title: "Audit Manager", // Assuming 'title' in MockUser corresponds to 'Role'
    role: "Audit Manager", // Or add a specific 'role' field if 'title' is different
    email: "john.doe@audit-platform.com",
    avatarUrl: "/placeholder.svg?width=200&height=200", // Using placeholder.svg
    fallback: "JD",
  })

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
            <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.fallback}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <Button variant="outline">Upload New Photo</Button>
            <p className="text-sm text-muted-foreground">Recommended size: 200x200px</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={user.name} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={user.title} readOnly /> {/* Using user.title for Role */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={user.email} readOnly />
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
      <CardFooter>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
