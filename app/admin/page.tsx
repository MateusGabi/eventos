"use client"

import { useState } from "react"
import Link from "next/link"
import { Ticket, DollarSign, Calendar, TrendingUp, Plus } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { AdminStatsCard } from "@/components/admin-stats-card"
import { AdminEventsTable } from "@/components/admin-events-table"
import { mockEvents } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import type { Event } from "@/lib/types"

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents)

  // Calculate statistics
  const totalEvents = events.length
  const activeEvents = events.filter((e) => e.status === "active").length

  const totalTicketsSold = events.reduce((sum, event) => {
    return sum + (event.total_tickets - event.available_tickets)
  }, 0)

  const totalRevenue = events.reduce((sum, event) => {
    const sold = event.total_tickets - event.available_tickets
    return sum + sold * event.price
  }, 0)

  const formattedRevenue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(totalRevenue)

  const handleToggleStatus = (eventId: string, newStatus: "active" | "paused") => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === eventId ? { ...event, status: newStatus } : event)),
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Gerencie seus eventos e acompanhe as vendas</p>
          </div>
          <Button asChild>
            <Link href="/admin/eventos/novo">
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard
            title="Receita Total"
            value={formattedRevenue}
            icon={DollarSign}
            trend={{ value: 12.5, isPositive: true }}
          />
          <AdminStatsCard
            title="Ingressos Vendidos"
            value={totalTicketsSold.toLocaleString("pt-BR")}
            icon={Ticket}
            trend={{ value: 8.2, isPositive: true }}
          />
          <AdminStatsCard
            title="Eventos Ativos"
            value={activeEvents}
            icon={Calendar}
            description={`${totalEvents} eventos no total`}
          />
          <AdminStatsCard
            title="Taxa de Conversão"
            value="68%"
            icon={TrendingUp}
            trend={{ value: 3.1, isPositive: true }}
          />
        </div>

        {/* Events Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Eventos</h2>
          </div>
          <AdminEventsTable events={events} onToggleStatus={handleToggleStatus} />
        </div>
      </main>
    </div>
  )
}
