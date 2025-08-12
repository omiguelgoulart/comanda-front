"use client"

import { CardComanda } from "./CardComanda"
import type { Comanda } from "@/types/comanda";



interface ListaComandasProps {
  comandas: Comanda[]
}

export function ListaComandas({ comandas }: ListaComandasProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Comandas Ativas</h2>
      {comandas.length === 0 ? (
        <div className="text-gray-500">Não há comandas ativas no dia de hoje.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {comandas.map((comanda) => (
            <CardComanda key={comanda.id} comanda={comanda} />
          ))}
        </div>
      )}
    </div>
  )
}
