import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, FileCheck, FileSearch, FileUp, BookHeart } from "lucide-react"

const links = [
  { title: "Manage Action Plans", href: "#", icon: FileCheck },
  { title: "View Department Findings", href: "#", icon: FileSearch },
  { title: "Submit Evidence", href: "#", icon: FileUp },
  { title: "Access Knowledge Center", href: "#", icon: BookHeart },
]

export function QuickLinksWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.title}
              className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex items-center gap-3">
                <link.icon className="h-6 w-6 text-muted-foreground group-hover:text-accent-foreground" />
                <span className="font-medium">{link.title}</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
