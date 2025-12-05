import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin-header"
import { CreateEventForm } from "@/components/create-event-form"

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para dashboard
        </Link>

        <div className="max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Criar Novo Evento</h1>
            <p className="text-muted-foreground">Preencha as informações abaixo para criar um novo evento</p>
          </div>

          <CreateEventForm />
        </div>
      </main>
    </div>
  )
}
