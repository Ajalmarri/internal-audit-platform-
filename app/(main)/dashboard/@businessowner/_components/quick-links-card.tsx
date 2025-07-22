import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, ShieldAlert, ListChecks, Users } from "lucide-react"

const links = [
  { href: "/reports", label: "My Department Reports", icon: FileText },
  { href: "/risks", label: "Department Risk Register", icon: ShieldAlert },
  { href: "/action-plans", label: "Track Action Plans", icon: ListChecks },
  { href: "/stakeholders", label: "Manage Team Access", icon: Users },
]

export function QuickLinksCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {links.map((link) => (
          <Button key={link.href} asChild variant="outline">
            <Link href={link.href}>
              <link.icon className="mr-2 h-4 w-4" />
              {link.label}
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
