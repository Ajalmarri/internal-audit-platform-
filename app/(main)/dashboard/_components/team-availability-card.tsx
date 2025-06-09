"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const teamMembers = [
  {
    id: "1",
    name: "Khaled M.",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    status: "Available",
    role: "Lead Auditor",
  },
  {
    id: "2",
    name: "Yema al Olman",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    status: "Busy",
    role: "Senior Auditor",
  },
  {
    id: "3",
    name: "Fatima H.",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    status: "Available",
    role: "Auditor",
  },
  {
    id: "4",
    name: "Omar S.",
    avatarUrl: "/placeholder.svg?width=40&height=40",
    status: "On Leave",
    role: "Junior Auditor",
  },
]

const statusIndicatorColors: { [key: string]: string } = {
  Available: "bg-green-500",
  Busy: "bg-yellow-500",
  "On Leave": "bg-gray-400",
}

export default function TeamAvailabilityCard() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Team & Availability</CardTitle>
        <CardDescription>Current status of your team members.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatarUrl || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${statusIndicatorColors[member.status] || "bg-gray-300"}`} />
              <Badge variant="outline" className="text-xs">
                {member.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
