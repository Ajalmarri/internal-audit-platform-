import { redirect } from "next/navigation"

export default function HomePage() {
  // The root page automatically redirects to the dedicated login page.
  redirect("/login")
}
