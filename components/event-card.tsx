import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Tag } from "lucide-react"
import type { Event } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface EventCardProps {
  event: Event
}

const categoryLabels = {
  show: "Show",
  jantar: "Jantar",
  palestra: "Palestra",
}

const categoryColors = {
  show: "bg-primary text-primary-foreground",
  jantar: "bg-secondary text-white",
  palestra: "bg-accent text-accent-foreground",
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
  const formattedTime = eventDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(event.price)

  const availabilityPercentage = (event.available_tickets / event.total_tickets) * 100
  const isLowStock = availabilityPercentage < 20 && availabilityPercentage > 0

  return (
    <Link href={`/eventos/${event.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={event.image_url || "/placeholder.svg?height=400&width=600"}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 right-3">
            <Badge className={categoryColors[event.category]}>{categoryLabels[event.category]}</Badge>
          </div>
        </div>

        <CardContent className="flex-1 p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-balance">{event.title}</h3>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">
                {formattedDate} às {formattedTime}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg text-primary">{formattedPrice}</span>
          </div>

          {isLowStock && event.status === "active" && (
            <Badge variant="outline" className="text-warning border-warning">
              Últimos ingressos
            </Badge>
          )}

          {event.status === "sold_out" && (
            <Badge variant="outline" className="text-destructive border-destructive">
              Esgotado
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
