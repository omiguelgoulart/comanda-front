"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useComandas } from "@/stores/useComandas"
import type { NovaComandaInput } from "c:/ads/comandas/types/comanda"

export function BotaoNovaComanda({ small = false }: { small?: boolean }) {
  const router = useRouter()

  const { criarComanda } = useComandas()

  const handleNovaComanda = async () => {
    try {
      const novaComandaInput: NovaComandaInput = {
        numero: 0, // preencha com valor padrão ou gere um número
        data: new Date().toISOString(),
        status: "ABERTA", // ou outro status padrão
        pedidos: [],
      }
      const nova = await criarComanda(novaComandaInput)
      if (nova === null || nova === undefined || !nova.id) {
        console.error("Erro: criarComanda não retornou uma comanda com ID.")
        return
      }

      router.push(`/comanda/${nova.id}`)
    } catch (err) {
      console.error("Erro ao criar comanda", err)
    }
  }

  return (
    <Button onClick={handleNovaComanda} variant={small ? "secondary" : "default"}>
      {small ? "Adicionar" : "Nova Comanda"}
    </Button>
  )
}
