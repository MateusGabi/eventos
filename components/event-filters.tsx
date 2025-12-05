"use client"

import { useState } from "react"
import type { EventCategory } from "@/lib/types"

interface EventFiltersProps {
  onFilterChange: (category: EventCategory | "all") => void
}

const categories = [
  { value: "all" as const, label: "Todos" },
  { value: "show" as const, label: "Shows" },
  { value: "jantar" as const, label: "Jantares" },
  { value: "palestra" as const, label: "Palestras" },
]

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [selected, setSelected] = useState<EventCategory | "all">("all")

  const handleFilterClick = (category: EventCategory | "all") => {
    setSelected(category)
    onFilterChange(category)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => handleFilterClick(category.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === category.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
