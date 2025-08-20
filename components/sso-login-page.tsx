"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SSOLoginPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 animate-gradient bg-400">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-800/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-cyan-900/50"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${(i * 5.5) % 100}%`,
              top: `${(i * 7.3) % 100}%`,
              animationDelay: `${(i * 0.3) % 3}s`,
              animationDuration: `${3 + (i * 0.2) % 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-white tracking-tight">
                Audit Platform
              </CardTitle>
              <CardDescription className="text-lg text-white/80 font-medium">
                Dubai Future Foundation
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button 
              className="w-full h-12 bg-white text-gray-900 hover:bg-gray-100 border-0 shadow-lg font-semibold text-base transition-all duration-200 hover:scale-105"
              onClick={() => {
                // Handle Microsoft SSO login
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

      {/* Additional decorative elements */}
      <div className="absolute bottom-8 left-8 text-white/40 text-sm">
        © 2024 Dubai Future Foundation
      </div>
      
      <div className="absolute bottom-8 right-8 text-white/40 text-sm">
        v1.0.0
      </div>
    </div>
  )
}
