
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDashboardFilter } from "@/contexts/dashboard-filter-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function DatePicker() {
  const { period, setPeriod, date, setDate } = useDashboardFilter()
  const [open, setOpen] = React.useState(false)

  const handleDateSelect = (selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate)
      setOpen(false)
    }
  }

  const getButtonLabel = () => {
    switch (period) {
      case 'day':
        return format(date, "PPP");
      case 'month':
        return format(date, "MMMM yyyy");
      case 'year':
        return format(date, "yyyy");
      case 'all':
        return "All Time";
      default:
        return "Select Date";
    }
  }

  return (
    <div className="flex items-center gap-2">
       <Select value={period} onValueChange={(value) => setPeriod(value as 'day' | 'month' | 'year' | 'all')}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>
      {period !== 'all' && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getButtonLabel()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              captionLayout="dropdown"
              fromYear={2015}
              toYear={new Date().getFullYear() + 5}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
