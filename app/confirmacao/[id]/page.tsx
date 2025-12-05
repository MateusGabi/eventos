import Link from "next/link"
import { CheckCircle, Mail, Download, Home } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ConfirmationPageProps {
  params: Promise<{ id: string }>
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-success/10 p-4">
                  <CheckCircle className="h-16 w-16 text-success" />
                </div>
              </div>
              <CardTitle className="text-3xl">Compra Confirmada!</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">Seu pedido foi processado com sucesso.</p>
                <p className="font-mono text-sm bg-muted px-3 py-2 rounded inline-block">Pedido #{id}</p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Ingressos enviados por e-mail</p>
                    <p className="text-sm text-muted-foreground">
                      Você receberá seus ingressos digitais no e-mail cadastrado em alguns minutos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Download className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Baixe seus ingressos</p>
                    <p className="text-sm text-muted-foreground">
                      Você também pode baixar seus ingressos diretamente pelo link enviado no e-mail.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <h3 className="font-bold">Próximos Passos</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>Verifique sua caixa de entrada (e spam) para o e-mail de confirmação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>Baixe ou salve seus ingressos digitais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>Apresente o QR Code do ingresso na entrada do evento</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild variant="outline" className="flex-1 bg-transparent">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Ver Mais Eventos
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground pt-4">
                Precisa de ajuda? Entre em contato com nosso suporte.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
