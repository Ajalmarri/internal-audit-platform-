"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// A simple component to represent the four-color Microsoft logo
const MicrosoftLogo = () => (
  <div className="grid grid-cols-2 gap-px">
    <div className="h-3 w-3 bg-[#f25022]" />
    <div className="h-3 w-3 bg-[#7fba00]" />
    <div className="h-3 w-3 bg-[#00a4ef]" />
    <div className="h-3 w-3 bg-[#ffb900]" />
  </div>
)

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = () => {
    setIsLoading(true)
    // Simulate an SSO authentication process
    setTimeout(() => {
      // On successful authentication, redirect to the main application dashboard
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-sky-500 via-blue-600 to-blue-800 bg-[length:300%_300%] animate-animated-gradient p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-black/25 p-8 shadow-2xl backdrop-blur-lg sm:p-10">
        <div className="flex flex-col items-center space-y-8 text-center text-white">
          <ShieldCheck className="h-16 w-16 text-white/90" />

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Audit Platform</h1>
            <p className="text-lg font-light text-white/80">Dubai Future Foundation</p>
          </div>

          <Button
            className="w-full bg-white text-black transition-all hover:bg-gray-200 hover:shadow-md"
            size="lg"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-semibold">Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <MicrosoftLogo />
                <span className="text-base font-semibold">Sign in with Microsoft</span>
              </div>
            )}
          </Button>

          <p className="px-4 text-xs font-light text-white/60">
            By signing in, you agree to our{" "}
            <a href="#" className="underline hover:text-white">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-white">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  )
}
