"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip" // Added
import { cn } from "@/lib/utils"

export default function LanguageSwitcher() {
  const { state, isMobile } = useSidebar() // Added isMobile

  const triggerButton = (
    <Button
      variant="ghost"
      size={state === "expanded" ? "default" : "icon"}
      className={cn(state === "expanded" ? "w-full justify-start gap-2 px-2" : "h-9 w-9")}
      aria-label="Change language"
    >
      <Globe className="h-5 w-5" />
      {state === "expanded" && <span className="ml-0">Language</span>} {/* Ensure span is correctly shown */}
    </Button>
  )

  const dropdownContent = (
    <DropdownMenuContent
      align={state === "expanded" ? "start" : "center"}
      side={state === "collapsed" && !isMobile ? "right" : "top"} // Adjust side for collapsed desktop
    >
      <DropdownMenuItem onSelect={() => console.log("English selected")}>English</DropdownMenuItem>
      <DropdownMenuItem onSelect={() => console.log("Arabic selected")}>العربية</DropdownMenuItem>
    </DropdownMenuContent>
  )

  if (state === "collapsed" && !isMobile) {
    return (
      <TooltipProvider>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              Change Language
            </TooltipContent>
          </Tooltip>
          {dropdownContent}
        </DropdownMenu>
      </TooltipProvider>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
      {dropdownContent}
    </DropdownMenu>
  )
}
