import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = session.user

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-4">
        <h2 className="text-lg font-medium">Welcome!</h2>
        <p>Here's a summary of your account.</p>
      </div>
      <div className="mt-6">
        <h2 className="text-base font-semibold">Account Overview</h2>
        <div className="mt-2">
          <p>User ID: {user.id}</p>
          <p>Email: {user.email}</p>
          <h2 className="text-gray-800 dark:text-gray-200">Good morning, {user.name}!</h2>
        </div>
      </div>
    </div>
  )
}
