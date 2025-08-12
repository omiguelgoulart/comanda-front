"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { useComandas } from "@/stores/useComandas"
import type { Comanda, PedidoItem } from "@/types/comanda"

// -------- helpers
const toBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n)

function ymd(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function isHoje(input: string | Date): boolean {
  const hoje = ymd(new Date())
  const d = typeof input === "string" ? new Date(input) : input
  if (isNaN(d.getTime())) return false
  return ymd(d) === hoje
}

function getItemTotal(p: PedidoItem): number {
  const qtd = Number(p.quantidade ?? 1)
  // Ajustar conforme o seu tipo real: preco, precoUnitario, valor, etc.
  const preco = Number(
    (p as { preco?: number }).preco ??
    (p as { precoUnitario?: number }).precoUnitario ??
    (p as { valor?: number }).valor ??
    0
  )
  return qtd * preco
}

function getItemQuantidade(p: PedidoItem): number {
  return Number(p.quantidade ?? 1)
}

// -------- cards
function ResumoCard({
  titulo,
  valor,
  subtitulo,
  loading,
}: {
  titulo: string
  valor: string
  subtitulo: string
  loading?: boolean
}) {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl shadow border border-zinc-800">
      <p className="text-sm text-muted-foreground">{titulo}</p>
      {loading ? (
        <div className="animate-pulse h-7 w-24 bg-zinc-800 rounded mt-1 mb-1" />
      ) : (
        <p className="text-2xl font-semibold">{valor}</p>
      )}
      <p className="text-xs text-muted-foreground">{subtitulo}</p>
    </div>
  )
}

export function DashboardResumo() {
  const { comandas, carregarComandas } = useComandas()
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      await carregarComandas()
      setLastUpdated(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }, [carregarComandas])

  useEffect(() => {
    reload()
    const id = setInterval(reload, 30000) // auto refresh 30s
    return () => clearInterval(id)
  }, [reload])

  const { comandasAbertas, totalDia, itensVendidos, ticketMedio } = useMemo(() => {
    const hoje: Comanda[] = comandas.filter((c) => isHoje(c.data))
    const abertas = comandas.filter((c) => c.status === "ABERTA").length

    const totalDiaCalc = hoje.reduce((acc: number, c: Comanda) => {
      const subtotal = c.pedidos.reduce((s, p) => s + getItemTotal(p), 0)
      return acc + subtotal
    }, 0)

    const itensVendidosCalc = hoje.reduce((acc: number, c: Comanda) => {
      return acc + c.pedidos.reduce((s, p) => s + getItemQuantidade(p), 0)
    }, 0)

    const qtdComandasHoje = hoje.length
    const ticketMedioCalc = qtdComandasHoje > 0 ? totalDiaCalc / qtdComandasHoje : 0

    return {
      comandasAbertas: abertas,
      totalDia: totalDiaCalc,
      itensVendidos: itensVendidosCalc,
      ticketMedio: ticketMedioCalc,
    }
  }, [comandas])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {lastUpdated ? `Atualizado às ${lastUpdated.toLocaleTimeString("pt-BR")}` : "—"}
        </div>

        <button
          onClick={reload}
          className="text-xs px-2 py-1 rounded border border-zinc-800 hover:bg-zinc-800"
          disabled={loading}
        >
          {loading ? "Atualizando..." : "Atualizar"}
        </button>
      </div>

      {error && (
        <div className="text-xs text-red-400 border border-red-500/30 bg-red-500/10 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ResumoCard
          titulo="Comandas Abertas"
          valor={String(comandasAbertas)}
          subtitulo="comandas ativas"
          loading={loading}
        />
        <ResumoCard
          titulo="Total do Dia"
          valor={toBRL(totalDia)}
          subtitulo="vendas hoje"
          loading={loading}
        />
        <ResumoCard
          titulo="Itens Vendidos"
          valor={String(itensVendidos)}
          subtitulo="itens hoje"
          loading={loading}
        />
        <ResumoCard
          titulo="Ticket Médio"
          valor={toBRL(ticketMedio)}
          subtitulo="por comanda"
          loading={loading}
        />
      </div>
    </div>
  )
}
