"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, FileText, QrCode, Minus, Plus } from "lucide-react"
import type { Event, PaymentMethod } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CheckoutFormProps {
  event: Event
}

const paymentMethods = [
  {
    value: "credit_card" as PaymentMethod,
    label: "Cartão de Crédito",
    icon: CreditCard,
    description: "Aprovação instantânea",
  },
  {
    value: "pix" as PaymentMethod,
    label: "PIX",
    icon: QrCode,
    description: "Aprovação em até 2 minutos",
  },
  {
    value: "boleto" as PaymentMethod,
    label: "Boleto",
    icon: FileText,
    description: "Aprovação em até 2 dias úteis",
  },
]

export function CheckoutForm({ event }: CheckoutFormProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card")
  const [isProcessing, setIsProcessing] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
  })

  const totalAmount = event.price * quantity
  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalAmount)

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= Math.min(10, event.available_tickets)) {
      setQuantity(newQuantity)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate API call
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: event.id,
          quantity,
          payment_method: paymentMethod,
          buyer_name: formData.name,
          buyer_email: formData.email,
          buyer_phone: formData.phone,
          buyer_document: formData.document,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/confirmacao/${data.order_id}`)
      } else {
        alert("Erro ao processar pedido. Tente novamente.")
      }
    } catch (error) {
      console.error("[v0] Error processing order:", error)
      alert("Erro ao processar pedido. Tente novamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quantity Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Quantidade de Ingressos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= Math.min(10, event.available_tickets)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-primary">{formattedTotal}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buyer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Comprador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="João Silva"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="joao@exemplo.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">CPF</Label>
              <Input
                id="document"
                type="text"
                required
                value={formData.document}
                onChange={(e) => handleInputChange("document", e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Forma de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    paymentMethod === method.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 mb-2 ${
                      paymentMethod === method.value ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <p className="font-medium mb-1">{method.label}</p>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
        {isProcessing ? "Processando..." : "Finalizar Compra"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Ao finalizar a compra, você concorda com nossos termos de uso e política de privacidade.
      </p>
    </form>
  )
}
