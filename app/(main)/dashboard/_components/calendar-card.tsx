"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"

export default function CalendarCard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Card className="shadow-soft border-gray-200/80 dark:border-gray-800/50 transition-shadow duration-300 hover:shadow-soft-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Calendar</CardTitle>
        <CardDescription>Your upcoming deadlines and events.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-2 sm:p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          classNames={{
            month: "space-y-2 p-3",
            caption_label: "text-sm font-medium",
            nav_button: "h-7 w-7",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-1.5",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            day_range_end: "day-range-end",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside:
              "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            day_disabled: "text-muted-foreground opacity-50",
            day_hidden: "invisible",
          }}
        />
      </CardContent>
    </Card>
  )
}
