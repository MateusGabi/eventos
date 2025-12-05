import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Tag, Users, Clock, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { mockEvents } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface EventPageProps {
  params: Promise<{ id: string }>
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

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  const event = mockEvents.find((e) => e.id === id)

  if (!event) {
    notFound()
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("pt-BR", {
    weekday: "long",
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
  const isSoldOut = event.status === "sold_out" || event.available_tickets === 0
  const isPaused = event.status === "paused"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para eventos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="relative h-96 w-full overflow-hidden rounded-lg">
              <Image
                src={event.image_url || "/placeholder.svg?height=600&width=800"}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4">
                <Badge className={categoryColors[event.category]}>{categoryLabels[event.category]}</Badge>
              </div>
            </div>

            {/* Event Details */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{event.title}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Data e Hora</p>
                    <p className="text-sm text-muted-foreground capitalize">{formattedDate}</p>
                    <p className="text-sm text-muted-foreground">{formattedTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Local</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Preço</p>
                    <p className="text-sm text-muted-foreground">{formattedPrice} por ingresso</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Disponibilidade</p>
                    <p className="text-sm text-muted-foreground">
                      {event.available_tickets.toLocaleString("pt-BR")} de {event.total_tickets.toLocaleString("pt-BR")}{" "}
                      ingressos
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-bold mb-3">Sobre o Evento</h2>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ingresso</p>
                  <p className="text-3xl font-bold text-primary">{formattedPrice}</p>
                </div>

                {isLowStock && !isSoldOut && (
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-warning">
                      <Clock className="h-4 w-4" />
                      <p className="text-sm font-medium">Últimos ingressos disponíveis!</p>
                    </div>
                  </div>
                )}

                {isSoldOut && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-sm font-medium text-destructive text-center">Ingressos Esgotados</p>
                  </div>
                )}

                {isPaused && (
                  <div className="bg-muted border border-border rounded-lg p-3">
                    <p className="text-sm font-medium text-muted-foreground text-center">Vendas Pausadas</p>
                  </div>
                )}

                <Button asChild size="lg" className="w-full" disabled={isSoldOut || isPaused}>
                  <Link href={`/checkout/${event.id}`}>Comprar Ingresso</Link>
                </Button>

                <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Confirmação instantânea
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Ingresso digital por e-mail
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Pagamento seguro
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
