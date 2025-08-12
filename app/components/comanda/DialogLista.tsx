// components/comanda/DialogLista.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useComandas } from "@/stores/useComandas"
import { Produto } from "@/types/comanda"
import { TabelaProdutos } from "./TabelaProdutos"
import { X } from "lucide-react"

interface ListaProdutosCardProps {
  onClose: () => void
  onSelectProduct: (produto: Produto) => void
}

export function ListaProdutosCard({ onClose, onSelectProduct }: ListaProdutosCardProps) {
  // pega só o que precisa do store
  const produtos = useComandas(s => s.produtos)
  const listarProdutos = useComandas(s => s.listarProdutos)

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

useEffect(() => {
  let cancelado = false

  if (produtos.length > 0) {
    // Já tem dados no store: não busca e garante que o loading fique falso
    setLoading(false)
    return
  }

  setLoading(true)
  listarProdutos()
    .catch((e) => {
      if (cancelado) return
      console.error("[ListaProdutosCard] Erro ao listar produtos:", e)
      setErro("Não foi possível carregar os produtos.")
    })
    .finally(() => {
      if (!cancelado) setLoading(false)
    })

  return () => { cancelado = true }
  // mantém as deps; length é suficiente pra reavaliar quando a lista chega
}, [listarProdutos, produtos.length])


  // mapeamentos opcionais (ajuste conforme seu enum/labels)
  const tipoLabels: Record<string, string> = {
    REFEICAO_PESO: "Refeição por Kg",
    REFEICAO_FIXO: "Refeição",
    SOBREMESA: "Sobremesa",
    SUCO: "Suco",
    PAO: "Pão",
    OUTRO: "Outro",
  }

  const tipoColors: Record<string, string> = {
    REFEICAO_PESO: "bg-blue-500",
    REFEICAO_FIXO: "bg-indigo-500",
    SOBREMESA: "bg-pink-500",
    SUCO: "bg-emerald-500",
    PAO: "bg-amber-500",
    OUTRO: "bg-zinc-500",
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden border shadow-xl relative">
        <CardHeader className="flex justify-between items-center px-6 pt-4 pb-2">
          <CardTitle className="text-lg">Lista de Produtos</CardTitle>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <ScrollArea className="h-[60vh] pr-4">
            {loading ? (
              <div className="h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
                Carregando produtos...
              </div>
            ) : erro ? (
              <div className="h-[50vh] flex items-center justify-center text-sm text-red-500">
                {erro}
              </div>
            ) : produtos.length === 0 ? (
              <div className="h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
                Nenhum produto encontrado.
              </div>
            ) : (
              <TabelaProdutos
                produtosFiltrados={produtos}
                handleSelect={onSelectProduct}
                tipoLabels={tipoLabels}
                tipoColors={tipoColors}
              />
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
