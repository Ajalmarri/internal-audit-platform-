"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip" // Added
import { TooltipProvider } from "@/components/ui/tooltip" // Added
import { cn } from "@/lib/utils"

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const { state, isMobile } = useSidebar() // Added isMobile

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const buttonContent = (
    <>
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {state === "expanded" && <span className="ml-2">Toggle Theme</span>} {/* Added margin for spacing */}
    </>
  )

  if (state === "collapsed" && !isMobile) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9" aria-label="Toggle theme">
              {buttonContent}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            Toggle Theme
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Button
      variant="ghost"
      size={state === "expanded" ? "default" : "icon"}
      onClick={toggleTheme}
      className={cn(state === "expanded" ? "w-full justify-start gap-2 px-2" : "h-9 w-9")}
      aria-label="Toggle theme"
    >
      {buttonContent}
    </Button>
  )
}
