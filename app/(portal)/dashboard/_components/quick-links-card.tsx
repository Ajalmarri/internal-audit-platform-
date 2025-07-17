import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, ShieldAlert, Users, BarChart } from "lucide-react"

const links = [
  { title: "My Department Reports", href: "#", icon: FileText },
  { title: "Open Findings", href: "#", icon: ShieldAlert },
  { title: "Team Management", href: "#", icon: Users },
  { title: "Performance Analytics", href: "#", icon: BarChart },
]

export function QuickLinksCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {links.map((link) => (
          <Button key={link.title} asChild variant="outline" className="h-24 flex-col gap-2 bg-transparent">
            <Link href={link.href}>
              <link.icon className="h-6 w-6 text-muted-foreground" />
              <span className="text-center">{link.title}</span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
