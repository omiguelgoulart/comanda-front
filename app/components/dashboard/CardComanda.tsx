"use client"

import Link from "next/link"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Comanda } from "@/types/comanda"
import { Badge } from "@/components/ui/badge"

interface Props {
  comanda: Comanda
}

export function CardComanda({ comanda }: Props) {
  const itens = comanda.pedidos?.length ?? 0

  const total = (comanda.pedidos ?? []).reduce((soma, p) => {
    // usa subtotal se vier; fallback para quantidade * precoUnitario
    const sub = typeof p.subtotal === "number" ? p.subtotal : (p.quantidade ?? 0) * (p.precoUnitario ?? 0)
    return soma + sub
  }, 0)

  const dataFmt = new Date(comanda.data).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  })

  const statusAberta = comanda.status === "ABERTA"

  return (
    <div className="border border-zinc-800 bg-zinc-900 p-4 rounded-xl shadow flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">Comanda {comanda.numero}</p>
          <p className="text-xs text-muted-foreground">🕒 {dataFmt}</p>
        </div>

        <Badge
          className={[
            "badge text-[10px] px-2 py-0.5 rounded-full font-semibold",
            statusAberta ? "bg-emerald-500 text-white" : "bg-zinc-200 text-zinc-900",
          ].join(" ")}
        >
          {comanda.status}
        </Badge>
      </div>

      <div className="mt-4 text-sm space-y-1">
        <p className="text-muted-foreground">
          Itens:{" "}
          <strong>
            {itens} {itens === 1 ? "item" : "itens"}
          </strong>
        </p>
        <p>
          Total:{" "}
          <strong className="text-green-500">
            {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </strong>
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={`/comanda/${comanda.id}`} className="flex-1">
          <Button variant="outline" className="w-full text-xs">
            <Eye size={14} className="mr-1" />
            Visualizar
          </Button>
        </Link>

        <Link href={`/comanda/${comanda.id}`} className="flex-1">
          <Button variant="secondary" className="w-full text-xs" disabled={!statusAberta}>
            Adicionar
          </Button>
        </Link>
      </div>
    </div>
  )
}
