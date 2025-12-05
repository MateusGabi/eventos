import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"
import { Header } from "@/components/header"
import { CheckoutForm } from "@/components/checkout-form"
import { mockEvents } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"

interface CheckoutPageProps {
  params: Promise<{ id: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params
  const event = mockEvents.find((e) => e.id === id)

  if (!event) {
    notFound()
  }

  if (event.status === "sold_out" || event.available_tickets === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Ingressos Esgotados</h1>
              <p className="text-muted-foreground mb-6">
                Infelizmente os ingressos para este evento já foram esgotados.
              </p>
              <Link href="/" className="text-primary hover:underline">
                Ver outros eventos
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (event.status === "paused") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Vendas Pausadas</h1>
              <p className="text-muted-foreground mb-6">As vendas para este evento estão temporariamente pausadas.</p>
              <Link href="/" className="text-primary hover:underline">
                Ver outros eventos
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Link
          href={`/eventos/${event.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o evento
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>
            <CheckoutForm event={event} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-bold text-lg">Resumo do Pedido</h2>

                <div className="space-y-3 pb-4 border-b border-border">
                  <div>
                    <p className="font-medium text-balance">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4 text-success" />
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4 text-success" />
                    <span>Dados protegidos</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4 text-success" />
                    <span>Confirmação instantânea</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
