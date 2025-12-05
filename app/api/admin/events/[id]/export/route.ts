import { type NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // In a real application, this would:
    // 1. Validate admin authentication
    // 2. Fetch all tickets for the event from database
    // 3. Generate CSV file with ticket data
    // 4. Return CSV file for download

    // Mock CSV data
    const csvData = [
      ["Número do Ingresso", "Nome", "Email", "Status", "Data de Compra"],
      ["TKT-001", "João Silva", "joao@exemplo.com", "Válido", "2025-01-15"],
      ["TKT-002", "Maria Santos", "maria@exemplo.com", "Válido", "2025-01-15"],
      ["TKT-003", "Pedro Oliveira", "pedro@exemplo.com", "Usado", "2025-01-16"],
    ]

    const csv = csvData.map((row) => row.join(",")).join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="ingressos-evento-${id}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] Error exporting tickets:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
