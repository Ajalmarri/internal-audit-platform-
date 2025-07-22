import { redirect } from "next/navigation"

export default function RootPage() {
  // Redirect the root path to the new login page
  redirect("/login")
}
