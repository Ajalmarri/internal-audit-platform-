"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, AlertCircle, Upload, BookOpen } from "lucide-react"

const quickLinks = [
  {
    title: "Manage Action Plans",
    description: "Review and update action plans",
    icon: FileText,
    href: "/action-plans",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "View Department Findings",
    description: "See audit findings for your department",
    icon: AlertCircle,
    href: "/findings",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    title: "Submit Evidence",
    description: "Upload supporting documentation",
    icon: Upload,
    href: "/evidence-locker",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "Access Knowledge Center",
    description: "Browse policies and procedures",
    icon: BookOpen,
    href: "/knowledge-center",
    color: "bg-purple-500 hover:bg-purple-600",
  },
]

export function QuickLinksCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Button
              key={link.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-md transition-all bg-transparent"
              onClick={() => (window.location.href = link.href)}
            >
              <div className={`p-3 rounded-full text-white ${link.color}`}>
                <link.icon className="h-6 w-6" />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{link.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{link.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
