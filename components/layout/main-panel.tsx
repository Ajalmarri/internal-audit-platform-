"use client"

import type React from "react"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

/**
 * A component that wraps the main content of the application,
 * automatically adjusting its left margin based on the state of the sidebar.
 * This prevents the fixed-position sidebar from overlapping the content.
 */
export default function MainPanel({ children }: { children: React.ReactNode }) {
  const { state, isMobile } = useSidebar()

  return (
    <div
      className={cn(
        "flex flex-col flex-1 h-screen overflow-y-auto transition-all duration-300 ease-in-out",
        // On desktop, apply margin to account for the sidebar width
        {
          "md:ml-[288px]": state === "expanded" && !isMobile,
          "md:ml-[80px]": state === "collapsed" && !isMobile,
        },
        // On mobile, the sidebar is an overlay, so no margin is needed.
      )}
    >
      {children}
    </div>
  )
}
