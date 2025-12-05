export type EventCategory = "show" | "jantar" | "palestra"
export type EventStatus = "active" | "paused" | "sold_out" | "cancelled"
export type PaymentMethod = "credit_card" | "boleto" | "pix"
export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled"
export type TicketStatus = "valid" | "used" | "cancelled"

export interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  image_url: string | null
  price: number
  total_tickets: number
  available_tickets: number
  category: EventCategory
  status: EventStatus
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  event_id: string
  quantity: number
  total_amount: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  buyer_document: string
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  event_id: string
  order_id: string
  ticket_number: string
  buyer_name: string
  buyer_email: string
  status: TicketStatus
  created_at: string
  used_at: string | null
}

export interface AdminUser {
  id: string
  email: string
  name: string
  created_at: string
}

export interface CreateOrderInput {
  event_id: string
  quantity: number
  payment_method: PaymentMethod
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  buyer_document: string
}

export interface CreateEventInput {
  title: string
  description: string
  date: string
  location: string
  image_url?: string
  price: number
  total_tickets: number
  category: EventCategory
}
