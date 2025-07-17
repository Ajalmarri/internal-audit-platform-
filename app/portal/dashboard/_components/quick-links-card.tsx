import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const links = [
  { title: "Manage Action Plans", href: "#" },
  { title: "View Department Findings", href: "#" },
  { title: "Submit Evidence Request", href: "#" },
  { title: "Access Knowledge Center", href: "#" },
]

export function QuickLinksCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
        <CardDescription>Navigate to key areas of the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.title}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <span className="font-medium">{link.title}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
