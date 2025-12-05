"use client"

import Link from "next/link"
import { MoreVertical, Eye, Pause, Play, Download } from "lucide-react"
import type { Event } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AdminEventsTableProps {
  events: Event[]
  onToggleStatus?: (eventId: string, newStatus: "active" | "paused") => void
  onExport?: (eventId: string) => void
}

const categoryLabels = {
  show: "Show",
  jantar: "Jantar",
  palestra: "Palestra",
}

const statusLabels = {
  active: "Ativo",
  paused: "Pausado",
  sold_out: "Esgotado",
  cancelled: "Cancelado",
}

const statusColors = {
  active: "bg-success/10 text-success border-success/20",
  paused: "bg-warning/10 text-warning border-warning/20",
  sold_out: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-muted text-muted-foreground border-border",
}

export function AdminEventsTable({ events, onToggleStatus, onExport }: AdminEventsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const calculateSoldPercentage = (event: Event) => {
    const sold = event.total_tickets - event.available_tickets
    return Math.round((sold / event.total_tickets) * 100)
  }

  const handleExportClick = async (eventId: string) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}/export`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `ingressos-evento-${eventId}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert("Erro ao exportar ingressos")
      }
    } catch (error) {
      console.error("[v0] Error downloading export:", error)
      alert("Erro ao exportar ingressos")
    }
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Vendidos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const soldPercentage = calculateSoldPercentage(event)
            const soldTickets = event.total_tickets - event.available_tickets

            return (
              <TableRow key={event.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{event.location}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{categoryLabels[event.category]}</Badge>
                </TableCell>
                <TableCell className="text-sm">{formatDate(event.date)}</TableCell>
                <TableCell className="font-medium">{formatCurrency(event.price)}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {soldTickets.toLocaleString("pt-BR")} / {event.total_tickets.toLocaleString("pt-BR")}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${soldPercentage}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{soldPercentage}%</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[event.status]}>
                    {statusLabels[event.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/eventos/${event.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Evento
                        </Link>
                      </DropdownMenuItem>
                      {event.status === "active" && (
                        <DropdownMenuItem onClick={() => onToggleStatus?.(event.id, "paused")}>
                          <Pause className="h-4 w-4 mr-2" />
                          Pausar Vendas
                        </DropdownMenuItem>
                      )}
                      {event.status === "paused" && (
                        <DropdownMenuItem onClick={() => onToggleStatus?.(event.id, "active")}>
                          <Play className="h-4 w-4 mr-2" />
                          Retomar Vendas
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleExportClick(event.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar Ingressos
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
