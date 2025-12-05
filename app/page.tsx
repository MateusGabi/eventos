"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { EventCard } from "@/components/event-card"
import { EventFilters } from "@/components/event-filters"
import { mockEvents } from "@/lib/mock-data"
import type { EventCategory } from "@/lib/types"

export default function HomePage() {
  const [filter, setFilter] = useState<EventCategory | "all">("all")

  const filteredEvents = filter === "all" ? mockEvents : mockEvents.filter((event) => event.category === filter)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Encontre os Melhores Eventos</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Shows, jantares exclusivos e palestras inspiradoras. Garanta seu ingresso agora!
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex justify-center">
          <EventFilters onFilterChange={setFilter} />
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum evento encontrado nesta categoria.</p>
          </div>
        )}
      </main>
    </div>
  )
}
