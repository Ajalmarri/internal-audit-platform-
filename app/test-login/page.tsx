import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function TestLoginPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 to-cyan-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">
            Audit Platform
          </CardTitle>
          <CardDescription className="text-lg text-white/80">
            Dubai Future Foundation
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Button 
            className="w-full h-12 bg-white text-gray-900 hover:bg-gray-100"
            onClick={() => {
              console.log("Microsoft SSO login initiated")
            }}
          >
            <svg 
              className="w-5 h-5 mr-3" 
              viewBox="0 0 23 23" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0H11V11H0V0Z" fill="#F25022"/>
              <path d="M12 0H23V11H12V0Z" fill="#7FBA00"/>
              <path d="M0 12H11V23H0V12Z" fill="#00A4EF"/>
              <path d="M12 12H23V23H12V12Z" fill="#FFB900"/>
            </svg>
            Sign in with Microsoft
          </Button>
          
          <div className="text-center">
            <p className="text-white/60 text-sm">
              Secure access to your audit workspace
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
