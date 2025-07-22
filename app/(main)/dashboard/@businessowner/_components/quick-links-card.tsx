import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Search, Upload, BookOpen } from "lucide-react"

const quickLinks = [
  {
    title: "Manage Action Plans",
    description: "Review and update action plans",
    icon: FileText,
    href: "/action-plans",
  },
  {
    title: "View Department Findings",
    description: "See audit findings for your department",
    icon: Search,
    href: "/findings",
  },
  {
    title: "Submit Evidence",
    description: "Upload required documentation",
    icon: Upload,
    href: "/evidence-locker",
  },
  {
    title: "Access Knowledge Center",
    description: "Browse policies and procedures",
    icon: BookOpen,
    href: "/knowledge-center",
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
              className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-muted/50 bg-transparent"
              asChild
            >
              <a href={link.href}>
                <link.icon className="h-8 w-8" />
                <div className="text-center">
                  <p className="font-medium">{link.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
