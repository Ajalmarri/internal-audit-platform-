import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function BusinessOwnerDashboardPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Business Owner Portal</CardTitle>
          <CardDescription>This is your central hub for managing audit-related tasks and information.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
