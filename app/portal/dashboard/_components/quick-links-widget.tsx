import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const quickLinks = [
  { href: "#", label: "Manage Action Plans" },
  { href: "#", label: "View Department Findings" },
  { href: "#", label: "Submit Evidence" },
  { href: "#", label: "Access Knowledge Center" },
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
            <Button key={link.label} asChild size="lg" variant="outline">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
