import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, ShieldAlert, FileUp, BookOpen } from "lucide-react"

const quickLinks = [
  {
    title: "Manage Action Plans",
    href: "#",
    icon: FileText,
  },
  {
    title: "View Department Findings",
    href: "#",
    icon: ShieldAlert,
  },
  {
    title: "Submit Evidence",
    href: "#",
    icon: FileUp,
  },
  {
    title: "Access Knowledge Center",
    href: "#",
    icon: BookOpen,
  },
]

export function QuickLinksWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Button
              key={link.title}
              asChild
              variant="outline"
              size="lg"
              className="justify-start text-left h-auto py-4 bg-transparent"
            >
              <Link href={link.href}>
                <link.icon className="mr-4 h-6 w-6 flex-shrink-0" />
                <span className="flex-grow">{link.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
